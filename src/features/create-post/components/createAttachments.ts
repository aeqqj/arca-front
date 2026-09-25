// export function createAttachments() {
//     return `
//         <div class="w-100 flex flex-col gap-2">
//             <label for="attachments" class="text-fg2">Attachments</label>
//             <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-60 flex items-center justify-center relative transition-colors">
//                 <input type="file" id="attachments" class="absolute inset-0 opacity-0 cursor-pointer" multiple>
//                 <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
//                     <i data-lucide="paperclip" class="w-4 h-4 text-fg-icon"></i>
//                 </button>
//             </div>
//         </div>
//     `
// }

export function createAttachments() {
	return /* HTML */ `
		<div class="w-100 flex flex-col gap-2">
			<div class="w-full flex justify-between items-center">
				<label class="text-fg2 font-medium">Attachments</label>
				<button
					type="button"
					id="attachments-add"
					class="p-2 hover:bg-bg5/60 transition-colors"
				>
					<i
						data-lucide="plus"
						class="w-4.5 h-4.5 text-fg2 pointer-events-none"
					></i>
				</button>
				<input
					type="file"
					id="attachments-input"
					class="hidden"
					multiple
				/>
			</div>
			<div
				class="h-fit bg-bg2 border border-dashed border-border hover:bg-bg3/60 rounded-xs flex items-center justify-center relative transition-colors p-6 flex-col gap-4"
			>
				<div
					class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center hover:bg-bg5/80 transition-colors relative"
				>
					<button
						type="button"
						class="group absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-xs bg-bg5 border border-border hover:bg-bg4 transition-colors"
					>
						<i
							data-lucide="x"
							class="w-4 h-4 text-fg5 group-hover:text-fg3 pointer-events-none transition-colors"
						></i>
					</button>
					<div class="w-fit h-fit p-2.5 bg-bg-icon">
						<i data-lucide="link2" class="w-4 h-4 text-fg-icon"></i>
					</div>
					<div class="flex flex-col min-w-0 flex-1">
						<p class="text-sm text-fg3 truncate">
							Java Documentation - Oracle
						</p>
						<p class="text-xs text-fg5 truncate">docs.oracle.com</p>
					</div>
				</div>
				<div
					class="w-full h-fit border border-border bg-bg4 p-4 flex gap-2 items-center hover:bg-bg5/80 transition-colors relative"
				>
					<button
						type="button"
						class="group absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-xs bg-bg5 border border-border hover:bg-bg4 transition-colors"
					>
						<i
							data-lucide="x"
							class="w-4 h-4 text-fg5 group-hover:text-fg3 pointer-events-none transition-colors"
						></i>
					</button>
					<div class="w-fit h-fit p-2.5 bg-bg-icon">
						<i data-lucide="link2" class="w-4 h-4 text-fg-icon"></i>
					</div>
					<div class="flex flex-col min-w-0 flex-1">
						<p class="text-sm text-fg3 truncate">
							Java Documentation - Oracle
						</p>
						<p class="text-xs text-fg5 truncate">docs.oracle.com</p>
					</div>
				</div>
			</div>
		</div>
	`;
}
