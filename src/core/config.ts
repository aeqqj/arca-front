// Central runtime configuration for the API layer.
// Empty API_BASE means same-origin requests, which the Vite dev proxy
// (vite.config.ts) forwards to the arca Spring Boot server on :20255.
export const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? "";

// The Post schema requires a department_id (NOT NULL) even though the
// frontend treats departments as deprecated. We always send these
// fixed defaults; override via env vars if the seeded rows differ.
export const DEFAULT_DEPARTMENT_ID: number = Number(
	import.meta.env.VITE_DEFAULT_DEPARTMENT_ID ?? 1,
);
export const DEFAULT_SCHOOL_ID: number = Number(
	import.meta.env.VITE_DEFAULT_SCHOOL_ID ?? 1,
);

// Home feed source: without a global list endpoint, department 1's
// approved posts act as the site-wide feed.
export const FEED_DEPARTMENT_ID: number = DEFAULT_DEPARTMENT_ID;
