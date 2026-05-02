import { routes } from "./routes.ts";

document.addEventListener("click", (e) => {
    const target = e.target as HTMLAnchorElement;

    if (!target!.matches("nav a")) {
        return;
    }

    e.preventDefault();

    window.history.pushState({}, "", target!.href);

    urlLocationHandler();
})

const urlLocationHandler = async () => {
    let location = window.location.pathname;
    
    if (location.length == 0) {
        location = "/";
    }

    const route = routes[location] || routes[404];

    const html = await fetch(route.page).then((res) => res.text());
    document.getElementById("content")!.innerHTML = html;
};

window.onpopstate = urlLocationHandler;

urlLocationHandler();
