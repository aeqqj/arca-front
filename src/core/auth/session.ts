// Auth session: token storage lives in core/api/client.ts; this module
// layers the "who am I" cache on top and exposes login/logout flows.

import * as endpoints from "../api/endpoints.ts";
import { clearCache } from "../api/cache.ts";
import { clearTokens, getAccessToken, setTokens } from "../api/client.ts";
import { clearRememberedVotes } from "../votes.ts";
import type { RegisterPayload, User } from "../api/types.ts";

const USER_KEY = "arca_session_user";

export function isAuthenticated(): boolean {
	return getAccessToken() !== null;
}

export function getCurrentUser(): User | null {
	const raw = localStorage.getItem(USER_KEY);
	if (!raw) {
		return null;
	}
	try {
		return JSON.parse(raw) as User;
	} catch {
		return null;
	}
}

function saveUser(user: User): void {
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
	clearTokens();
	clearCache();
	clearRememberedVotes();
	localStorage.removeItem(USER_KEY);
}

// There is no /user/me endpoint, so resolve the current user by matching
// the email from the auth response against the full user list.
async function resolveAndCacheUser(email: string): Promise<void> {
	const users = await endpoints.getUsers();
	const me = users.find(
		(u) => (u.email ?? "").toLowerCase() === email.toLowerCase(),
	);
	if (me) {
		saveUser(me);
	}
}

export async function signIn(email: string, password: string): Promise<void> {
	const auth = await endpoints.login(email, password);
	// New identity => drop anything the previous session may have cached.
	clearCache();
	clearRememberedVotes();
	setTokens(auth.access_token, auth.refresh_token);
	await resolveAndCacheUser(auth.email || email);
}

export async function signUp(payload: RegisterPayload): Promise<void> {
	const res = await endpoints.register(payload);
	await signIn(res.email || payload.email, payload.password);
}

// Best-effort server-side logout; local session is always cleared.
export async function signOut(): Promise<void> {
	try {
		await endpoints.logout();
	} catch {
		// ignore — clearing locally is what matters
	}
	clearSession();
}

export function displayName(user: User | null): string {
	if (!user) {
		return "";
	}
	return (
		[user.first_name, user.last_name].filter(Boolean).join(" ") ||
		user.email
	);
}
