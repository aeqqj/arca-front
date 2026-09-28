import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import {
	postsTable,
	updatePostTableSelection,
} from "../../components/tables/postsTable.ts";
import { postFullView } from "../../components/posts/postFullView.ts";
import type { Post } from "../../components/posts/postTypes.ts";
import { pagination } from "../../components/controls/pagination.ts";
import { mockPosts } from "./mock-data.ts";

const PAGE_SIZE = 15;
let currentPage = 1;
let selectedPost: Post | null = null;

function getPageData() {
	const totalPages = Math.max(1, Math.ceil(mockPosts.length / PAGE_SIZE));
	currentPage = Math.min(currentPage, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;
	return mockPosts.slice(start, start + PAGE_SIZE);
}

function previewContent(): string {
	return selectedPost
		? postFullView(selectedPost)
		: `<div class="flex flex-col items-center justify-center h-full text-fg5 gap-3"><i data-lucide="file-text" class="w-10 h-10"></i><p class="text-body-md">Select a post to preview</p></div>`;
}

function renderPage() {
	const pagePosts = getPageData();
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Pending Posts")}
                <div class="flex-1 overflow-hidden p-8 flex flex-col gap-3">
                    <div class="flex flex-1 min-h-0 gap-4">
                        <div class="w-1/2 min-w-0 flex flex-col gap-3">
                            <div class="pending-posts-table-viewport flex-1 min-h-0">
                                <div id="pending-posts-table-container" class="admin-table-container admin-table-container--posts">
                                    ${postsTable(pagePosts, selectedPost?.id ?? null)}
                                </div>
                            </div>
                            <div id="pending-posts-pagination-container">
                                ${pagination({ id: "pending-posts", currentPage, totalItems: mockPosts.length, pageSize: PAGE_SIZE, showPageNumbers: true })}
                            </div>
                        </div>
                        <div id="pending-posts-preview-panel" class="w-1/2 shrink-0 border border-border bg-bg2 rounded-xs overflow-y-auto">
                            ${previewContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
	initIcons();
	bindResultEvents();
}

function renderSelection() {
	const tableContainer = document.getElementById(
		"pending-posts-table-container",
	);
	const previewPanel = document.getElementById("pending-posts-preview-panel");
	if (!tableContainer || !previewPanel) return;

	updatePostTableSelection(tableContainer, selectedPost?.id ?? null);
	previewPanel.innerHTML = previewContent();
	initIcons(previewPanel);
}

function renderResults() {
	const tableContainer = document.getElementById(
		"pending-posts-table-container",
	);
	const paginationContainer = document.getElementById(
		"pending-posts-pagination-container",
	);
	if (!tableContainer || !paginationContainer) return;

	tableContainer.innerHTML = postsTable(
		getPageData(),
		selectedPost?.id ?? null,
	);
	paginationContainer.innerHTML = pagination({
		id: "pending-posts",
		currentPage,
		totalItems: mockPosts.length,
		pageSize: PAGE_SIZE,
		showPageNumbers: true,
	});
	bindResultEvents();
}

function bindResultEvents() {
	const tableContainer = document.getElementById(
		"pending-posts-table-container",
	);
	const paginationContainer = document.getElementById(
		"pending-posts-pagination-container",
	);
	if (!tableContainer || !paginationContainer) return;

	tableContainer
		.querySelectorAll<HTMLTableRowElement>("[data-post-id]")
		.forEach((row) => {
			row.addEventListener("click", () => {
				const id = Number(row.dataset.postId);
				selectedPost =
					selectedPost?.id === id
						? null
						: (mockPosts.find((post) => post.id === id) ?? null);
				renderSelection();
			});
		});

	paginationContainer
		.querySelectorAll<HTMLButtonElement>("[data-page]")
		.forEach((button) =>
			button.addEventListener("click", () => {
				if (button.disabled) return;
				currentPage = Number(button.dataset.page);
				renderResults();
			}),
		);
}

export function AdminPendingPostsPage() {
	renderPage();
}
