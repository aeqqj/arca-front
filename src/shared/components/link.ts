import github from "/github.svg";

export function extractYoutubeId(url: string): string | null {
	const match = url.match(
		/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
	);
	return match ? match[1] : null;
}

export function githubLink() {
    return `
        <div class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 hover:bg-bg5/80 transition-colors">
            <div class="w-fit h-fit p-2.5 bg-bg-icon">
                <img src="${github}" class="w-5 h-5"/>
            </div>
            <div class="flex flex-col gap-1.5">
                <div class="flex text-label-sm">
                    <p class="text-fg4">google/</p>
                    <p class="text-fg-link">&nbsp;btree</p>
                </div>
                <p class="text-sm text-fg3">A Go Implementation of B-Trees, mirroring the interfaces/behavior of container/heap and container list. </p>
                <div class="flex text-body-sm gap-4 text-fg5">
                    <div class="flex gap-1 items-center">
                        <i data-lucide="star" class="w-4 h-4"></i>
                        <p>3.1k</p>
                    </div>
                    <div class="flex gap-1 items-center">
                        <i data-lucide="git-fork" class="w-4 h-4"></i>
                        <p>245</p>
                    </div>
                </div>
            </div>
        </div>
    `
}

export function link() {
    return `
        <div class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center hover:bg-bg5/80 transition-colors">
            <div class="w-fit h-fit p-2.5 bg-bg-icon">
                <i data-lucide="link2" class="w-4 h-4 text-fg-icon"></i> 
            </div>
            <div class="flex flex-col">
                <p class="text-sm text-fg3">Java Documentation - Oracle</p>
                <p class="text-xs text-fg5">docs.oracle.com</p>
            </div>
        </div>
    `
}

export function youtubeLink() {
    return `
        <div class="relative w-full aspect-video bg-bg4 cursor-pointer hover:bg-bg5/80 transition-colors" data-video-id="4WfSohJ9K5o" data-yt-thumb>
            <img src="https://img.youtube.com/vi/4WfSohJ9K5o/maxresdefault.jpg" class="w-full h-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center">
                <i data-lucide="play" class="w-12 h-12 text-white"></i>
            </div>
        </div>
    `
}
