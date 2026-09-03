import avatarPlaceholder from "/dog.png";
import { link, githubLink, youtubeLink } from "../../../shared/components/link.ts";
import { attachment } from "../../../shared/components/attachment.ts";

export function fullPost() {
	return `
        <div class="w-fit flex gap-5 items-start">
            <div class="flex flex-col gap-4 sticky top-20 self-start">
                <button class="w-fit h-fit p-2.5 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5 text-fg3"></i> 
                </button>
                <div class="w-fit h-fit flex flex-col gap-6 bg-bg3 text-fg3 mt-6 px-2.5 py-2 border border-border rounded-xs items-center">
                    <i data-lucide="arrow-up" class="w-5 h-5 hover:text-good transition-colors mt-2"></i> 
                    <p>22</p>
                    <i data-lucide="arrow-down" class="w-5 h-5 hover:text-bad transition-colors mb-2"></i> 
                </div>
                <button class="w-fit h-fit p-3 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="square-arrow-out-up-right" class="w-4 h-4 text-fg3"></i> 
                </button>
                <button class="w-fit h-fit p-2.5 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                    <i data-lucide="bookmark" class="w-5 h-5 text-fg3"></i> 
                </button>
            </div>
            <div class="w-4xl flex flex-col gap-4">
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 gap-4 rounded-xs hover:bg-bg3/60 transition-colors cursor-pointer shadow-md">
                    <div class="flex flex-col gap-4">
                        <div class="flex gap-4">
                            <img src="${avatarPlaceholder}" class="w-12 h-12 rounded-xs mt-1" />
                            <div class="w-full flex justify-between items-start">
                                <div class="flex flex-col gap-1">
                                    <a href="/" class="text-body-lg text-fg3 hover:text-fg-link transition-colors">retardedmoron69</a>
                                    <p class="text-fg4 text-body-md">15 hours</p>
                                </div>
                                <div class="p-1 hover:bg-bg5/60 transition-colors rounded-xs">
                                    <i data-lucide="ellipsis" class="w-4 h-4 text-fg3"></i>
                                </div>
                            </div>
                        </div>
                        <p class="text-fg2 text-title-lg font-medium">
                            google made btrees in golang instead of c and so should you go is good its better than everything
                        </p>
                    </div>
                    <div class="w-fit h-fit py-0.5 px-3 bg-red-100 text-bg2 rounded-xs text-body-md">Data Structures & Algorithms</div>
                    ${youtubeLink()}
                    <p class="text-fg3 text-body-lg mt-2"> go is GOOD use GO, check this shit out</p>
                </div>
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 rounded-xs hover:bg-bg3/60 transition-colors gap-4">
                    <h4 class="text-fg3 font-medium">Attachments</h4>
                    <div class="w-full flex flex-col gap-4">
                        ${githubLink()}
                        ${link()}
                    </div>
                </div>
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 rounded-xs hover:bg-bg3/60 transition-colors gap-4">
                    <h4 class="text-fg3 font-medium">Links</h4>
                    <div class="w-full flex flex-col gap-4">
                        ${attachment()}
                        ${attachment()}
                    </div>
                </div>
            </div>
        </div>
    `;
}
