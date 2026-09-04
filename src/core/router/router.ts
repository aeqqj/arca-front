import { routes, publicRoutes } from "./routes.ts";
import { isAuthenticated } from "../auth/session.ts";

document.addEventListener("click", (e) => {
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

	console.log("current path:", location);

	if (location.length == 0) {
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
		document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
			<div class="h-full flex flex-col items-center justify-center gap-2 text-fg3">
				<p class="text-title-md font-medium text-fg2">404</p>
				<p class="text-body-md">No page at ${location}</p>
				<a href="/" class="text-fg-link hover:underline">Back to feed</a>
			</div>
		`;
	}
};

window.onpopstate = urlLocationHandler;
