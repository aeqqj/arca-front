// export function createLinks() {
//     return `
//         <div class="w-100 flex flex-col gap-2">
//             <label for="links" class="text-fg2">Links</label>
//             <div class="bg-bg2 border border-dashed border-border hover:bg-bg3/60 focus:border-fg5/60 rounded-xs h-60 flex items-center justify-center relative transition-colors p-6">
//                 <input type="url" id="links" class="absolute inset-0 opacity-0 cursor-pointer" placeholder="">
//                 <button type="button" class="w-10 h-10 flex items-center justify-center rounded-xs bg-bg-icon pointer-events-none">
//                     <i data-lucide="link" class="w-4 h-4 text-fg-icon"></i>
//                 </button>
//             </div>
//         </div>
//     `
// }

export function createLinks() {
	return /* HTML */ `
		<div class="w-100 flex flex-col gap-2">
			<div class="w-full flex justify-between items-center">
				<label for="links" class="text-fg2 font-medium">Links</label>
				<button
					type="button"
					class="p-2 hover:bg-bg5/60 transition-colors"
				>
					<i
						data-lucide="plus"
						class="w-4.5 h-4.5 text-fg2 pointer-events-none"
					></i>
				</button>
			</div>
			<div
				class="h-fit bg-bg2 border border-dashed border-border hover:bg-bg3/60 rounded-xs flex flex-col items-center justify-center relative transition-colors p-6 gap-4"
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
						<i data-lucide="play" class="w-4 h-4 text-fg-icon"></i>
					</div>
					<div class="flex flex-col min-w-0 flex-1">
						<p class="text-sm text-fg3 truncate">
							Spacey Electro & Techno Mix in the Twilight Zone |
							Tinzo
						</p>
						<p class="text-xs text-fg5 truncate">youtube.com</p>
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
						<i data-lucide="play" class="w-4 h-4 text-fg-icon"></i>
					</div>
					<div class="flex flex-col min-w-0 flex-1">
						<p class="text-sm text-fg3 truncate">
							Spacey Electro & Techno Mix in the Twilight Zone |
							Tinzo
						</p>
						<p class="text-xs text-fg5 truncate">youtube.com</p>
					</div>
				</div>
			</div>
		</div>
	`;
}
