import avatarPlaceholder from "/dog.png";
import { link, githubLink, youtubeLink } from "../../../shared/components/link.ts";
import { file } from "../../../shared/components/file.ts";

function loadVideo(el: HTMLElement) {
	const id = el.dataset.videoId;
	el.outerHTML = `
        <iframe class="w-full aspect-video" src="https://www.youtube.com/embed/${id}?autoplay=1" 
            frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    `;
}

export function post() {
	return `
        <div class="w-200 h-fit bg-bg2 border border-border flex flex-col p-6 gap-4 rounded-xs hover:bg-bg3/60 transition-colors cursor-pointer shadow-md">
            <div class="flex gap-4">
                <img src="${avatarPlaceholder}" class="w-12 h-12 rounded-xs mt-1" />
                <div class="w-full flex flex-col">
                    <div class="w-full flex justify-between items-center">
                        <div class="flex text-label-md items-center">
                            <a href="/" class="text-fg4 hover:text-fg-link transition-colors">retardedmoron69</a>
                            <p class="text-fg5">&nbsp; • 15 hours</p>
                        </div>
                        <div class="p-1 hover:bg-bg5/80 transition-colors rounded-xs">
                            <i data-lucide="ellipsis" class="w-4 h-4 text-fg3"></i>
                        </div>
                    </div>
                    <p class="text-fg2 text-title-md">
                        google made btrees in golang instead of c and so should you go is good its better than everything
                    </p>
                </div>
            </div>
            <p class="text-fg3 text-text"> go is GOOD use GO, check this shit out</p>

            ${youtubeLink()}

            ${githubLink()}

            ${link()}

            <div class="flex gap-3.5">
                ${file()}
                ${file()}
            </div>

            <div class="flex items-center justify-between">
                <div class="flex gap-4">
                    <div class="w-fit h-fit flex gap-6 bg-bg3 text-fg3 px-2.5 py-2 border border-border rounded-xs items-center">
                        <i data-lucide="arrow-up" class="w-5 h-5 hover:text-good transition-colors"></i> 
                        <p>22</p>
                        <i data-lucide="arrow-down" class="w-5 h-5 hover:text-bad transition-colors"></i> 
                    </div>
                    <div class="w-fit h-fit p-3 bg-bg3 border border-border rounded-xs hover:bg-bg4 transition-colors">
                        <i data-lucide="square-arrow-out-up-right" class="w-4 h-4 text-fg3"></i> 
                    </div>
                </div>
                <div class="w-fit h-fit py-0.5 px-4 bg-red-100 text-bg2 rounded-xs text-sm">Data Structures & Algorithms</div>
            </div>
        </div>
    `;
}
