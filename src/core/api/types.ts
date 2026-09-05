// Types mirroring the live API wire format. The Spring Boot server uses
// Jackson's SNAKE_CASE naming strategy, so JSON keys are snake_case.
// Optional fields reflect "may be null / not always present" on the wire;
// index signatures absorb fields we don't model (the API evolves).

export interface AuthResponse {
	access_token: string;
	refresh_token: string;
	token_type: string;
	email: string;
}

export interface User {
	id: number;
	first_name: string | null;
	last_name: string | null;
	email: string;
	course?: string | null;
	department?: string | null;
	bio?: string | null;
	profile_picture?: string | null;
	roles?: string[];
	[key: string]: unknown;
}

export interface RegisterPayload {
	first_name: string;
	last_name: string;
	email: string;
	password: string;
}

export interface RegisterResponse {
	message: string;
	email: string;
}

export interface FileResponse {
	id: number;
	file_name: string;
	file_type: string;
	file_size: number;
	[key: string]: unknown;
}

export interface FileUploadResult {
	id: number;
	file_name: string;
	file_type: string;
	file_size: number;
	file_path: string;
	user_id: number;
	post_id: number;
	message: string;
}

export interface MultipleFileUploadResponse {
	files: FileUploadResult[];
	message: string;
}

export interface PostResponse {
	id: number; // row primary key — used by GET /posts/{id} and file upload
	post_id: number; // logical post id
	version: number;
	title: string;
	content: string;
	status: string;
	user_id: number;
	first_name?: string | null;
	last_name?: string | null;
	department_id?: number | null;
	department_name?: string | null;
	post_tag?: string | null; // subject name, rendered by the server
	rejection_reason?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	upvote_count?: number;
	downvote_count?: number;
	files?: FileResponse[];
	[key: string]: unknown;
}

export interface PostCreatePayload {
	title: string;
	content: string;
	user_id: number;
	department_id: number;
	post_tag?: number | null; // subject id
}

export interface PostCreateResponse {
	user_id: number;
	post_id: number;
	message: string;
}

export interface DepartmentResponse {
	id: number;
	name: string;
	[key: string]: unknown;
}

export interface SubjectResponse {
	id: number;
	code: string;
	name: string;
	aliases?: string[];
	departments?: DepartmentResponse[];
}

export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface VoteResponse {
	id: number;
	post_id: number;
	user_id: number;
	vote_type: VoteType;
}
