import { initIcons } from "../../shared/icons.ts";
import { header } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import { bindYoutubeLinks } from "../../shared/handlers/postHandlers.ts";
import { textEditor, initTextEditor } from "./components/textEditor.ts";

export function CreatePostPage() {
	const app = document.querySelector<HTMLDivElement>("#app")!;
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        ${header()}
        <div class="w-full flex">
            ${sideBar()} 
            <div class="text-fg1 w-full p-12 flex gap-10 justify-center">
                <form action="" class="w-200 flex flex-col gap-8">
                    <div>
                        <label for="">Title</label>
                        <input type="" class="p-4 h-fit w-full border border-border bg-bg2 hover:bg-bg3/60 focus:border-fg5/60 transition-colors">
                    </div>
                    ${textEditor()}
                    <div class="flex gap-4">
                        <div class="flex flex-col gap-2 w-full">
                            <label for="attachments">Attachments</label>
                            <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-40 flex items-center justify-center relative transition-colors">
                                <input type="file" id="attachments" class="absolute inset-0 opacity-0 cursor-pointer" multiple>
                                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
                                    <i data-lucide="paperclip" class="w-4 h-4 text-fg-icon"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flex flex-col gap-2 w-full ">
                            <label for="links">Links</label>
                            <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-40 flex items-center justify-center relative transition-colors">
                                <input type="url" id="links" class="absolute inset-0 opacity-0 cursor-pointer" placeholder="">
                                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
                                    <i data-lucide="link" class="w-4 h-4 text-fg-icon"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 w-full">
                        <button class="w-full bg-bg3 text-fg2 border border-border py-3 rounded-xs hover:opacity-90 transition-all">Save Draft</button>
                        <button class="w-full bg-fg2 text-bg3 border border-fg2 py-3 rounded-xs hover:opacity-90 transition-all">Post</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    initTextEditor();
    initIcons();
    bindYoutubeLinks(app);
}
