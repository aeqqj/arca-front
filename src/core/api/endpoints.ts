// Every HTTP call the app makes lives here — one grep-able module.

import {
	apiBlob,
	apiGet,
	apiPost,
	apiPostForm,
	getRefreshToken,
} from "./client.ts";
import { DEFAULT_DEPARTMENT_ID } from "../config.ts";
import { cached, invalidate, TTL } from "./cache.ts";
import type {
	AuthResponse,
	MultipleFileUploadResponse,
	PostCreatePayload,
	PostCreateResponse,
	PostResponse,
	RegisterPayload,
	RegisterResponse,
	SubjectResponse,
	User,
	VoteResponse,
	VoteType,
} from "./types.ts";

// --- auth ---

export function login(email: string, password: string): Promise<AuthResponse> {
	return apiPost<AuthResponse>(
		"/api/v1/auth/login",
		{ email, password },
		false,
	);
}

export function register(payload: RegisterPayload): Promise<RegisterResponse> {
	return apiPost<RegisterResponse>("/api/v1/auth/register", payload, false);
}

export function logout(): Promise<unknown> {
	return apiPost<unknown>(
		"/api/v1/auth/logout",
		{ refresh_token: getRefreshToken() ?? "" },
		false,
	);
}

// --- users ---

export function getUsers(): Promise<User[]> {
	return cached("users", TTL.users, () => apiGet<User[]>("/api/v1/user"));
}

export function getUserById(userId: number): Promise<User> {
	return cached(`user.${userId}`, TTL.users, () =>
		apiGet<User>(`/api/v1/user/${userId}`),
	);
}

// --- posts ---

// There is no global "all posts" endpoint and the backend is frozen, so
// department 1's approved posts serve as the site-wide feed.
export function getFeed(): Promise<PostResponse[]> {
	return cached("posts.feed", TTL.posts, () =>
		apiGet<PostResponse[]>(
			`/api/v1/posts/department/${DEFAULT_DEPARTMENT_ID}`,
		),
	);
}

export function getPost(id: number): Promise<PostResponse> {
	return cached(`posts.${id}`, TTL.posts, () =>
		apiGet<PostResponse>(`/api/v1/posts/${id}`),
	);
}

export function getUserPosts(userId: number): Promise<PostResponse[]> {
	return cached(`posts.user.${userId}`, TTL.posts, () =>
		apiGet<PostResponse[]>(`/api/v1/posts/user/${userId}`),
	);
}

export function createPost(
	payload: PostCreatePayload,
): Promise<PostCreateResponse> {
	return apiPost<PostCreateResponse>("/api/v1/posts", payload).then((res) => {
		invalidate("posts");
		return res;
	});
}

// --- files ---

export function uploadFiles(
	files: File[],
	userId: number,
	postId: number,
): Promise<MultipleFileUploadResponse> {
	const form = new FormData();
	for (const file of files) {
		form.append("file", file);
	}
	form.append("user_id", String(userId));
	form.append("post_id", String(postId));
	return apiPostForm<MultipleFileUploadResponse>(
		"/api/v1/files/upload",
		form,
	).then((res) => {
		invalidate("posts");
		return res;
	});
}

export function downloadFile(fileId: number): Promise<Blob> {
	return apiBlob(`/api/v1/files/download/${fileId}`);
}

// The create response only carries the logical post_id, but file upload
// needs the post row PK. The server embeds it in the success message
// ("Post created successfully with Id 42. Awaiting admin approval").
export function parseCreatedPostRowId(
	response: PostCreateResponse,
): number | null {
	const match = /Id\s+(\d+)/.exec(response.message ?? "");
	return match ? Number(match[1]) : null;
}

// --- subjects (courses) ---

export function getSubjects(): Promise<SubjectResponse[]> {
	return cached("subjects", TTL.subjects, () =>
		apiGet<SubjectResponse[]>("/api/v1/subject"),
	);
}

// --- votes ---

// The backend vote endpoint is a toggle: POST with the same type the user
// already voted deletes the vote (empty response); a different type flips it.
export function castVote(
	postId: number,
	voteType: VoteType,
): Promise<VoteResponse | undefined> {
	return apiPost<VoteResponse | undefined>("/api/v1/votes", {
		post_id: postId,
		vote_type: voteType,
	}).then((res) => {
		invalidate("posts");
		invalidate("votes");
		return res;
	});
}

// Empty body when the user has no vote on the post.
export function getMyVote(postId: number): Promise<VoteResponse | undefined> {
	return cached(`votes.my.${postId}`, TTL.posts, () =>
		apiGet<VoteResponse | undefined>(`/api/v1/votes/${postId}/my-vote`),
	);
}
