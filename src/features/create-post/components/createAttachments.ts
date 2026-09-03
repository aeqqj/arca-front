export function createAttachments() {
    return `
        <div class="w-100 flex flex-col gap-2">
            <label for="links" class="text-fg2">Links</label>
            <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-60 flex items-center justify-center relative transition-colors">
                <input type="url" id="links" class="absolute inset-0 opacity-0 cursor-pointer" placeholder="">
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
                    <i data-lucide="link" class="w-4 h-4 text-fg-icon"></i>
                </button>
            </div>
        </div>
    `
}
