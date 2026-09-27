import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import { postsTable } from "../../components/tables/postsTable.ts";
import { postFullView } from "../../components/posts/postFullView.ts";
import type { Post } from "../../components/posts/postTypes.ts";
import { pagination } from "../../components/controls/pagination.ts";
import { mockPosts } from "./mock-data.ts";

let selectedPost: Post | null = null;

function renderPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Pending Posts")}
                <div class="flex-1 overflow-hidden p-8 flex flex-col gap-3">
                    <div class="flex flex-1 min-h-0 gap-4">
                        <div class="w-1/2 min-w-0 flex flex-col gap-3">
                            <div id="posts-table-container" class="flex-1 min-h-0 overflow-y-auto">
                                ${postsTable(mockPosts, selectedPost?.id ?? null)}
                            </div>
                            ${pagination({ id: "pending-posts", currentPage: 1, totalItems: mockPosts.length, pageSize: 10 })}
                        </div>
                        <div class="w-1/2 shrink-0 border border-border bg-bg2 rounded-xs overflow-y-auto">
                            ${selectedPost ? postFullView(selectedPost) : `<div class="flex flex-col items-center justify-center h-full text-fg5 gap-3"><i data-lucide="file-text" class="w-10 h-10"></i><p class="text-body-md">Select a post to preview</p></div>`}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindRowClicks();
}

function bindRowClicks() {
	document
		.querySelectorAll<HTMLTableRowElement>("[data-post-id]")
		.forEach((row) => {
			row.addEventListener("click", () => {
				const id = Number(row.dataset.postId);
				selectedPost =
					selectedPost?.id === id
						? null
						: (mockPosts.find((p) => p.id === id) ?? null);
				renderPage();
			});
		});
}

export function AdminPendingPostsPage() {
	renderPage();
}
