export function pagination(): string {
    return `
        <div class="flex justify-between items-center mt-3">
            <p class="text-body-md text-fg4">Showing 1–5 of 8</p>
            <div class="flex gap-4">
                <button class="px-3 py-1.5 bg-bg2 text-body-md text-fg4 rounded-xs hover:text-fg3 hover:bg-bg3/90 border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed" disabled>Previous</button>
                <button class="px-3 py-1.5 bg-bg2 text-body-md text-fg4 rounded-xs hover:text-fg3 hover:bg-bg3/90 border border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
        </div>
    `;
}
