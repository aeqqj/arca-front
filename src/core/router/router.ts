import { routes } from "./routes.ts";

document.addEventListener("click", (e) => {
	const target = e.target as HTMLAnchorElement;

	if (!target!.matches("nav a")) {
		return;
	}

	e.preventDefault();

	window.history.pushState({}, "", target!.href);

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
