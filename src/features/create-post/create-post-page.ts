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
                <form action="" class="flex flex-col gap-8">
                    <div>
                        <label for="">Title</label>
                        <input type="" class="h-10 w-full border border-border bg-bg2">
                    </div>
                    ${textEditor()}
                    <div class="flex gap-2">
                        <div class="flex flex-col">
                            <label for="myfile">Attachments</label>
                            <input type="file" id="myfile"> 
                        </div>
                        <div class="flex flex-col">
                            <label for="myfile">Links</label>
                            <input type="file" id="myfile"> 
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;

    initTextEditor();
    initIcons();
    bindYoutubeLinks(app);
}
