// fetch wrapper: base URL, JSON handling, Bearer auth, one auto-refresh
// on 401, and normalized ApiError. All HTTP in the app goes through here.

import { API_BASE } from "../config.ts";
import type { AuthResponse } from "./types.ts";

const ACCESS_KEY = "arca_access_token";
const REFRESH_KEY = "arca_refresh_token";

export function getAccessToken(): string | null {
	return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
	return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
	localStorage.setItem(ACCESS_KEY, accessToken);
	localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens(): void {
	localStorage.removeItem(ACCESS_KEY);
	localStorage.removeItem(REFRESH_KEY);
}

export class ApiError extends Error {
	status: number;

	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	body?: unknown;
	form?: FormData;
	/** Set false for public endpoints (login/register/refresh). */
	auth?: boolean;
	expect?: "json" | "blob" | "text" | "none";
}

async function rawFetch(
	path: string,
	opts: Required<Pick<RequestOptions, "method" | "auth" | "expect">> & {
		body?: unknown;
		form?: FormData;
	},
): Promise<Response> {
	const headers: Record<string, string> = {};
	const token = opts.auth ? getAccessToken() : null;
	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	let body: BodyInit | undefined;
	if (opts.form) {
		body = opts.form; // the browser sets the multipart content-type
	} else if (opts.body !== undefined) {
		headers["Content-Type"] = "application/json";
		body = JSON.stringify(opts.body);
	}

	return fetch(API_BASE + path, { method: opts.method, headers, body });
}

// Single-flight token refresh so parallel 401s trigger one /auth/refresh.
let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
	const refreshToken = getRefreshToken();
	if (!refreshToken) {
		return false;
	}
	try {
		const res = await fetch(API_BASE + "/api/v1/auth/refresh", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refresh_token: refreshToken }),
		});
		if (!res.ok) {
			return false;
		}
		const data = (await res.json()) as AuthResponse;
		setTokens(data.access_token, data.refresh_token);
		return true;
	} catch {
		return false;
	}
}

function tryRefresh(): Promise<boolean> {
	if (!refreshInFlight) {
		refreshInFlight = refreshTokens().finally(() => {
			refreshInFlight = null;
		});
	}
	return refreshInFlight;
}

function forceSignedOut(): void {
	clearTokens();
	localStorage.removeItem("arca_session_user");
	if (!window.location.pathname.startsWith("/auth/")) {
		window.location.assign("/auth/signin");
	}
}

async function toApiError(res: Response): Promise<ApiError> {
	let message = `Request failed (${res.status} ${res.statusText})`;
	try {
		const body = (await res.json()) as { message?: string; error?: string };
		message = body.message ?? body.error ?? message;
	} catch {
		// non-JSON error body: keep the status-based message
	}
	return new ApiError(res.status, message);
}

export async function request<T>(
	path: string,
	opts: RequestOptions = {},
): Promise<T> {
	const method = opts.method ?? "GET";
	const auth = opts.auth ?? true;
	const expect = opts.expect ?? "json";

	let res = await rawFetch(path, {
		method,
		auth,
		expect,
		body: opts.body,
		form: opts.form,
	});

	if (
		res.status === 401 &&
		auth &&
		getRefreshToken() &&
		!(await tryRefresh())
	) {
		forceSignedOut();
		throw new ApiError(401, "Session expired. Please sign in again.");
	}
	if (res.status === 401 && auth && getRefreshToken()) {
		// refresh succeeded — replay the request once
		res = await rawFetch(path, {
			method,
			auth,
			expect,
			body: opts.body,
			form: opts.form,
		});
	}

	if (!res.ok) {
		throw await toApiError(res);
	}
	if (expect === "none" || res.status === 204) {
		return undefined as T;
	}
	if (expect === "blob") {
		return (await res.blob()) as T;
	}
	const text = await res.text();
	if (expect === "text") {
		return text as T;
	}
	return (text ? JSON.parse(text) : undefined) as T;
}

export function apiGet<T>(path: string): Promise<T> {
	return request<T>(path);
}

export function apiPost<T>(
	path: string,
	body: unknown,
	auth = true,
): Promise<T> {
	return request<T>(path, { method: "POST", body, auth });
}

export function apiPostForm<T>(path: string, form: FormData): Promise<T> {
	return request<T>(path, { method: "POST", form });
}

export function apiBlob(path: string): Promise<Blob> {
	return request<Blob>(path, { expect: "blob" });
}
