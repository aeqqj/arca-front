export function createLinks() {
    return `
        <div class="w-100 flex flex-col gap-2">
            <label for="attachments" class="text-fg2">Attachments</label>
            <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-60 flex items-center justify-center relative transition-colors">
                <input type="file" id="attachments" class="absolute inset-0 opacity-0 cursor-pointer" multiple>
                <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
                    <i data-lucide="paperclip" class="w-4 h-4 text-fg-icon"></i>
                </button>
            </div>
        </div>
    `
}
