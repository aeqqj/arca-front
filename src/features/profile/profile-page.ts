import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "./../../shared/components/post.ts"; 
import { announcements } from "./components/announcements.ts";
import { profile } from "./components/profile.ts";
import { trending } from "./components/trending.ts";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";

export function ProfilePage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex flex-col">
            ${header()}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar()}
                </aside>
                <div class="text-fg1 w-full h-full px-12 py-8 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex flex-col gap-6">
                        <div class="flex flex-col">
                            ${profile()}
                            <hr class="text-separator mt-1">
                        </div>
                        <div class="flex flex-col gap-6">
                            <button class="flex items-center gap-1">
                                <p>Recent</p>
                                <i data-lucide="chevron-down" class="w-4 h-4 text-fg3"></i>
                            </button>
                            <div>
                                ${post()}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8 self-start sticky top-0">
                        ${announcements()}
                        ${trending()}
                    </div>
                </div>
            </div>
        </div>
    `;
    initIcons();
    bindYoutubeLinks(app);
}
