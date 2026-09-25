import { initIcons } from "../../shared/icons.ts";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";
import { header } from "../../shared/components/header.ts";
import { fullPost } from "./components/fullPost.ts";
import { profileExtra } from "./components/profileExtra.ts";
import { miniProfile } from "./components/miniProfile.ts";

export function PostPage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex flex-col">
            ${header()}
            <div class="w-full px-12 py-8 flex gap-10 justify-center items-start flex-1 min-h-0 overflow-y-auto">
                <div class="flex flex-col gap-6">
                    ${fullPost()}
                </div>
                <div class="flex flex-col gap-8 self-start sticky top-0">
                    ${miniProfile()}
                    ${profileExtra()}
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindYoutubeLinks(app);
}
