export function file() {
    return `
        <div class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center hover:bg-bg5/80 transition-colors">
            <div class="w-fit h-fit p-2.5 bg-bg-icon">
                <i data-lucide="file-text" class="w-4 h-4 text-fg-icon"></i> 
            </div>
            <div class="flex flex-col">
                <p class="text-sm text-fg3">README.md</p>
                <p class="text-xs text-fg5">1.2 mb</p>
            </div>
        </div>
    `
}
