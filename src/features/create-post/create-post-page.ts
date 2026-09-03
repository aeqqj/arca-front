import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";
import { textEditor, initTextEditor } from "./components/textEditor.ts";
import { createLinks } from "./components/createLinks.ts";
import { createAttachments } from "./components/createAttachments.ts";

export function CreatePostPage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        ${header()}
        <div class="w-full flex">
            ${sideBar()} 
            <div class="w-full p-12 flex gap-10 justify-center">
                <div class="flex gap-8 flex-col">
                    <div class="flex justify-between">
                        <h1 class="text-fg1 font-medium">Create Post</h1>
                        <button class="w-fit h-fit px-3 py-2 text-fg3 text-body-lg border border-border hover:bg-bg3 transition-colors">Pick a course</button>
                    </div>
                    <form action="" class="w-200 flex flex-col gap-8 text-fg3">
                        <div class="flex flex-col gap-2">
                            <label for="" class="text-fg2">Title</label>
                            <input type="" class="p-4 h-fit w-full border border-border bg-bg2 hover:bg-bg3/60 focus:border-fg5/60 transition-colors">
                        </div>
                        <div class="text-fg2 flex flex-col gap-2">
                            <p>Video</p>
                            <div class="border border-border relative w-full aspect-video bg-bg4 cursor-pointer hover:bg-bg5/80 transition-colors" data-video-id="4WfSohJ9K5o" data-yt-thumb>
                                <img src="https://img.youtube.com/vi/4WfSohJ9K5o/maxresdefault.jpg" class="w-full h-full object-cover" />
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <i data-lucide="play" class="w-12 h-12 text-fg2" fill="#e5e5e5"></i>
                                </div>
                            </div>
                        </div>
                        <div class="text-fg2 flex flex-col gap-2">
                            <p>Image</p>
                            <div class="border border-border relative w-full aspect-video bg-bg4 hover:bg-bg5/80 transition-colors"> 
                                <img src="https://img.youtube.com/vi/4WfSohJ9K5o/maxresdefault.jpg" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        ${textEditor()}
                        <div class="flex gap-2 w-full">
                            <button class="w-full bg-bg3 text-fg2 border border-border py-3 rounded-xs hover:opacity-90 transition-all">Save Draft</button>
                            <button class="w-full bg-fg2 text-bg3 border border-fg2 py-3 rounded-xs hover:opacity-90 transition-all">Post</button>
                        </div>
                    </form>
                </div>
                <div class="flex flex-col gap-8">
                    ${createAttachments()}
                    ${createLinks()}
                </div>
            </div>
        </div>
    `;

    initTextEditor();
    initIcons();
    bindYoutubeLinks(app);
}
