export function bindYoutubeLinks(root: HTMLElement) {
	root.addEventListener("click", (e) => {
		const thumb = (e.target as HTMLElement).closest<HTMLElement>("[data-yt-thumb]");
		if (!thumb) return;

		const id = thumb.dataset.videoId;
		if (!id) return;

		thumb.outerHTML = `
            <div class="w-full aspect-video border border-border">
                <iframe
                    class="w-full h-full"
                    src="https://www.youtube.com/embed/${id}?autoplay=1"
                    title="YouTube video player"
                    frameborder="0"
                    allow="autoplay; encrypted-media"
                    allowfullscreen>
                </iframe>
            </div>
        `;
	});
}
