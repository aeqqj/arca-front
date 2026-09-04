// Shared render helpers: a monotonic render token so a slow response from
// a previous page can never overwrite the current one, plus small HTML
// utilities used by every page.

let renderSeq = 0;

export function nextRenderToken(): number {
	return ++renderSeq;
}

export function isCurrentRender(token: number): boolean {
	return token === renderSeq;
}

/** Replace #app content unless a newer render already took over. */
export function paint(token: number, html: string): boolean {
	if (!isCurrentRender(token)) {
		return false;
	}
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = html;
	return true;
}

const ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

export function esc(value: string | number | null | undefined): string {
	return String(value ?? "").replace(/[&<>"']/g, (c) => ESCAPES[c]!);
}

/** "2026-09-05T01:23:45" (server LocalDateTime, local tz) → "3 hours ago". */
export function timeAgo(iso: string | null | undefined): string {
	if (!iso) {
		return "";
	}
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) {
		return "";
	}
	const secs = Math.round((then - Date.now()) / 1000);
	const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	type RtfUnit = "year" | "month" | "week" | "day" | "hour" | "minute" | "second";
	const steps: [RtfUnit, number][] = [
		["year", 31536000],
		["month", 2592000],
		["week", 604800],
		["day", 86400],
		["hour", 3600],
		["minute", 60],
	];
	for (const [unit, per] of steps) {
		if (Math.abs(secs) >= per) {
			return rtf.format(Math.round(secs / per), unit);
		}
	}
	return rtf.format(secs, "second");
}

/** Plain-text preview from stored editor HTML (feed cards). */
export function htmlToText(html: string | null | undefined): string {
	if (!html) {
		return "";
	}
	const tmp = document.createElement("template");
	tmp.innerHTML = html;
	return (tmp.content.textContent ?? "").replace(/\s+/g, " ").trim();
}

export function formatBytes(bytes: number | null | undefined): string {
	if (bytes == null) {
		return "";
	}
	if (bytes < 1024) {
		return `${bytes} b`;
	}
	const units = ["kb", "mb", "gb"];
	let value = bytes;
	let unit = "b";
	for (const u of units) {
		if (value < 1024) break;
		value /= 1024;
		unit = u;
	}
	return `${value.toFixed(value >= 10 ? 0 : 1)} ${unit}`;
}

export function loadingShell(): string {
	return `
		<div class="h-full flex items-center justify-center text-fg4">
			<p class="text-body-lg animate-pulse">Loading…</p>
		</div>
	`;
}

export function errorPanel(title: string, detail?: string): string {
	return `
		<div class="w-full max-w-xl mx-auto mt-16 flex flex-col gap-3 items-center text-center">
			<p class="text-title-md font-medium text-fg2">${esc(title)}</p>
			${detail ? `<p class="text-body-md text-fg4">${esc(detail)}</p>` : ""}
			<a href="/" class="text-fg-link hover:underline text-body-md">Back to feed</a>
		</div>
	`;
}
