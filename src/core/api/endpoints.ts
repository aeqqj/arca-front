export const AUTH = {
	LOGIN: "/api/v1/auth/login",
	REGISTER: "/api/v1/auth/register",
	REFRESH: "/api/v1/auth/refresh",
	LOGOUT: "/api/v1/auth/logout",
} as const;

export const USER = {
	BASE: "/api/v1/user",
	BY_ID: (id: string) => `/api/v1/user/${id}`,
	PROFILE_PICTURE: (id: string) => `/api/v1/user/${id}/profile-picture`,
} as const;

export const POST = {
	BASE: "/api/v1/posts",
	BY_ID: (id: string) => `/api/v1/posts/${id}`,
	BY_USER: (id: string) => `/api/v1/posts/user/${id}`,
	BY_PENDING: "/api/v1/posts/pending",
	BY_HISTORY: (id: string) => `/api/v1/posts/history/${id}`,
	APPROVE: (id: string) => `/api/v1/posts/${id}/approve`,
	BY_PENDING_DEPARTMENT: (id: string) => `/api/v1/posts/pending/${id}`,
	// BY_DEPARTMENT: (id: string) => `/api/v1/posts/department/${id}`,
} as const;

export const SUBJECT = {
	BASE: "/api/v1/subject",
	BY_ID: (id: string) => `/api/v1/subject/${id}`,
} as const;

// waiting for scale v2 lol
// export const SCHOOL = {
//     BASE: "/api/v1/schools",
//     EDIT: (id: string) => `/api/v1/schools/edit/${id}`,
//     DELETE: (id: string) => `/api/v1/schools/delete/${id}`,
// }

// waiting for scale agen
// export const DEPARTMENT = {
//     BASE: "/api/v1/departments",
//     BY_ID: (id: string) => `/api/v1/departments/${id}`,
// } as const;

export const VAULT = {
	BY_ID: (id: string) => `/api/v1/vaults/${id}`,
	ADD: "/api/v1/vaults/add",
	USER: "/api/v1/vaults/user",
	CHECK: "/api/v1/vaults/check",
	REMOVE: "/api/v1/vaults/remove",
	EDIT: "/api/v1/vaults/edit-label",
};

export const ADMIN = {
	CREATE_ADMIN: "/api/v1/admin/create-admin",
	BANNED_EMAILS: "/api/v1/admin/banned-emails",
	UNBAN_EMAIL: (email: string) => `/api/v1/admin/banned-emails/${email}`,
	USERS: "/api/v1/admin/users",
	USERS_BY_ID: (id: string) => `/api/v1/admin/users/${id}`,
	PROMOTE: (id: string) => `/api/v1/admin/users/${id}/promote`,
	DEMOTE: (id: string) => `/api/v1/admin/users/${id}/demote`,
	ADD_ROLE: (id: string) => `/api/v1/admin/users/${id}/roles/add`,
	REMOVE_ROLE: (id: string) => `/api/v1/admin/users/${id}/roles/remove`,
};

export const FILE = {
	BY_ID: (id: string) => `/api/v1/files/${id}`,
	UPLOAD: "/api/v1/files/upload",
	DOWNLOAD: (id: string) => `/api/v1/files/download/${id}`,
};

export const VOTE = {
	BASE: "/api/v1/votes",
	BY_POST: (id: string) => `/api/v1/votes/${id}`,
	MY_VOTE: (id: string) => `/api/v1/votes/${id}/my-vote`,
	UPVOTES: (id: string) => `/api/v1/votes/${id}/upvotes`,
	DOWNVOTES: (id: string) => `/api/v1/votes/${id}/downvotes`,
};
