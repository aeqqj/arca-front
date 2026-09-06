import { routes, publicRoutes } from "./routes.ts";
import { isAuthenticated } from "../auth/session.ts";
import { errorPanel, nextRenderToken, paint } from "../render.ts";

document.addEventListener("click", (e) => {
	if (e.defaultPrevented) {
		return; // already handled (e.g. vote arrows cancel their clicks)
	}
	const anchor = (e.target as Element).closest?.(
		"a[href^='/']",
	) as HTMLAnchorElement | null;

	if (!anchor) {
		return;
	}

	e.preventDefault();

	window.history.pushState({}, "", anchor.href);

	urlLocationHandler();
});

export function navigate(path: string): void {
	window.history.pushState({}, "", path);
	urlLocationHandler();
}

export const urlLocationHandler = () => {
	let location = window.location.pathname;

	if (location.length === 0) {
		location = "/";
	}

	// Auth guards: everything outside /auth/** needs a session; signed-in
	// users don't need the sign-in/sign-up pages.
	const authed = isAuthenticated();
	if (!authed && !publicRoutes.has(location)) {
		location = "/auth/signin";
		window.history.replaceState({}, "", location);
	} else if (authed && publicRoutes.has(location)) {
		location = "/";
		window.history.replaceState({}, "", location);
	}

	const route = routes[location];

	if (route) {
		void route.page();
	} else {
		paint(nextRenderToken(), errorPanel("404", `No page at ${location}`));
	}
};

window.onpopstate = urlLocationHandler;
