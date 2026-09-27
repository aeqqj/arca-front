import { routes } from "./routes.ts";

document.addEventListener("click", (e) => {
	if (
		e.defaultPrevented ||
		e.button !== 0 ||
		e.metaKey ||
		e.ctrlKey ||
		e.shiftKey ||
		e.altKey
	) {
		return;
	}

	const eventTarget = e.target;
	if (!(eventTarget instanceof Element)) {
		return;
	}

	const anchor = eventTarget.closest<HTMLAnchorElement>("a[href]");
	if (!anchor) {
		return;
	}

	const href = anchor.getAttribute("href");
	if (
		!href?.startsWith("/") ||
		href.startsWith("//") ||
		anchor.hasAttribute("download") ||
		(anchor.target && anchor.target !== "_self") ||
		anchor.relList.contains("external")
	) {
		return;
	}

	const url = new URL(anchor.href, window.location.href);
	if (url.origin !== window.location.origin) {
		return;
	}

	e.preventDefault();
	window.history.pushState({}, "", url.href);
	urlLocationHandler();
});

export const urlLocationHandler = () => {
	let location = window.location.pathname;

	console.log("current path:", location);

	if (location.length == 0) {
		location = "/";
	}

	const route = routes[location] || routes[404];

	route.page();
};

window.onpopstate = urlLocationHandler;

urlLocationHandler();
