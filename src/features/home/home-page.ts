import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { post } from "./../../shared/components/post.ts"; 
import { announcements } from "./components/announcements.ts";
import { trending } from "./components/trending.ts";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";

export function HomePage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex flex-col">
            ${header()}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar()}
                </aside>
                <div class="w-full h-full px-12 py-6 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex flex-col gap-6">
                        ${post()}
                        ${post()}
                    </div>
                    <div class="flex flex-col gap-8 sticky top-0 self-start">
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
