import { initIcons } from "../../shared/icons.ts";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";
import { header } from "../../shared/components/header.ts";
import { fullPost } from "./components/fullPost.ts";
import { profileExtra } from "./components/profileExtra.ts";
import { miniProfile } from "./components/miniProfile.ts";

export function PostPage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        ${header()}
        <div class="w-full px-12 py-8 flex gap-10 justify-center items-start">
            <div class="flex flex-col gap-6">
                ${fullPost()}
            </div>
            <div class="flex flex-col gap-8 sticky top-20 self-start">
                ${miniProfile()}
                ${profileExtra()}
            </div>
        </div>
    `;
    initIcons();
    bindYoutubeLinks(app);
}
