import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "./../../shared/components/post.ts"; 
import { announcements } from "./components/announcements.ts";
import { profile } from "./components/profile.ts";
import { trending } from "./components/trending.ts";
import { bindYoutubeLinks } from "../../shared/handlers/postHandlers.ts";

export function ProfilePage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        ${header()}
        <div class="w-full flex">
            ${sideBar()} 
            <div class="text-fg1 w-full p-12 flex gap-10 justify-center">
                <div class="flex flex-col gap-2">
                    ${profile()}
                    <div class="flex flex-col gap-6">
                        ${post()}
                    </div>
                </div>
                <div class="flex flex-col gap-8">
                    ${announcements()}
                    ${trending()}
                </div>
            </div>
        </div>
    `;

    initIcons();
    bindYoutubeLinks(app);
}
