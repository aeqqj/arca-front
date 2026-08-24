import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "./../../shared/components/post.ts"; 
import { bindYoutubeLinks } from "../../shared/handlers/postHandlers.ts";

export function HomePage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        ${header()}
        <div class="h-full w-full flex">
            ${sideBar()} 
            <div class="text-fg1 w-full p-12">
                ${post()}
            </div>
        </div>
    `;

    initIcons();
    bindYoutubeLinks(app);
}
