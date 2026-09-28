import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import {
	bindPostTableSort,
	postsTable,
	updatePostTableSelection,
	type PostSortConfig,
	type PostSortField,
} from "../../components/tables/postsTable.ts";
import { postFullView } from "../../components/posts/postFullView.ts";
import type { Post } from "../../components/posts/postTypes.ts";
import { tableSearchBar } from "../../components/controls/tableSearchBar.ts";
import { bindDropdown, dropdown } from "../../components/controls/dropdown.ts";
import { pagination } from "../../components/controls/pagination.ts";
import { departmentOptions, posts, tagOptions } from "./mock-data.ts";

const PAGE_SIZE = 15;

let selectedPost: Post | null = null;
let searchQuery = "";
let departmentFilter = "";
let tagFilter = "";
let currentPage = 1;
let currentSort: PostSortConfig = { field: "created", direction: "desc" };

function getSortValue(post: Post, field: PostSortField): string | number {
	switch (field) {
		case "author":
			return `${post.firstName} ${post.lastName}`;
		case "department":
			return post.departmentName;
		case "tag":
			return post.postTag;
		case "created":
			return new Date(post.createdAt).getTime();
		default:
			return post.title;
	}
}

function getFilteredAndSortedPosts(): Post[] {
	const query = searchQuery.trim().toLocaleLowerCase();
	const filtered = posts.filter((post) => {
		const searchableText = [
			post.title,
			`${post.firstName} ${post.lastName}`,
			post.departmentName,
			post.postTag,
		]
			.join(" ")
			.toLocaleLowerCase();

		return (
			(!query || searchableText.includes(query)) &&
			(!departmentFilter || post.departmentName === departmentFilter) &&
			(!tagFilter || post.postTag === tagFilter)
		);
	});

	return filtered.sort((a, b) => {
		const valueA = getSortValue(a, currentSort.field);
		const valueB = getSortValue(b, currentSort.field);
		const comparison =
			typeof valueA === "number" && typeof valueB === "number"
				? valueA - valueB
				: String(valueA).localeCompare(String(valueB), undefined, {
						sensitivity: "base",
					});

		if (comparison === 0) return a.id - b.id;
		return currentSort.direction === "asc" ? comparison : -comparison;
	});
}

function getPageData() {
	const filteredPosts = getFilteredAndSortedPosts();
	const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
	currentPage = Math.min(currentPage, totalPages);
	const start = (currentPage - 1) * PAGE_SIZE;

	return {
		filteredPosts,
		pagePosts: filteredPosts.slice(start, start + PAGE_SIZE),
	};
}

function renderPage() {
	const { filteredPosts, pagePosts } = getPageData();

	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
		<div class="h-full flex">
			${adminSideBar()}
			<div class="flex flex-col flex-1 min-w-0">
				${adminHeader("Posts")}
				<div class="admin-page-content">
					<div id="posts-content" class="admin-content-stack admin-post-table-layout">
						<div id="posts-list-panel" class="flex flex-col gap-3">
							<div class="flex flex-wrap items-center gap-3">
								<div class="flex-1 min-w-48">
									${tableSearchBar({ id: "posts-search", placeholder: "Search title, author, department, or course...", value: searchQuery })}
								</div>
								${dropdown("posts-department-filter", departmentFilter, departmentOptions, "All departments")}
								${dropdown("posts-tag-filter", tagFilter, tagOptions, "All courses")}
							</div>
							<div id="posts-table-container" class="admin-table-container admin-table-container--posts">
								${postsTable(pagePosts, selectedPost?.id ?? null, currentSort)}
							</div>
							<div id="posts-pagination-container">
								${pagination({ id: "posts-pagination", currentPage, totalItems: filteredPosts.length, pageSize: PAGE_SIZE, showPageNumbers: true })}
							</div>
						</div>
						${selectedPost ? previewPanel(selectedPost) : ""}
					</div>
				</div>
			</div>
		</div>
	`;

	initIcons();
	bindControls();
	bindResultEvents();
}

function previewPanel(post: Post): string {
	return `<div id="posts-preview-panel" class="admin-post-preview min-w-0 border border-border bg-bg2 rounded-xs overflow-y-auto">${postFullView(post, false)}</div>`;
}

function renderSelection() {
	const content = document.getElementById("posts-content");
	if (!content) return;

	const tableContainer = document.getElementById("posts-table-container");
	if (tableContainer) {
		updatePostTableSelection(tableContainer, selectedPost?.id ?? null);
	}

	let currentPreview = document.getElementById("posts-preview-panel");
	if (!selectedPost) {
		currentPreview?.remove();
		return;
	}

	if (currentPreview) {
		currentPreview.innerHTML = postFullView(selectedPost, false);
	} else {
		content.insertAdjacentHTML("beforeend", previewPanel(selectedPost));
		currentPreview = document.getElementById("posts-preview-panel");
	}
	if (currentPreview) initIcons(currentPreview);
}

function renderResults() {
	const { filteredPosts, pagePosts } = getPageData();
	const tableContainer = document.getElementById("posts-table-container");
	const paginationContainer = document.getElementById(
		"posts-pagination-container",
	);
	if (!tableContainer || !paginationContainer) return;

	tableContainer.innerHTML = postsTable(
		pagePosts,
		selectedPost?.id ?? null,
		currentSort,
	);
	paginationContainer.innerHTML = pagination({
		id: "posts-pagination",
		currentPage,
		totalItems: filteredPosts.length,
		pageSize: PAGE_SIZE,
		showPageNumbers: true,
	});
	initIcons(tableContainer);
	bindResultEvents();
}

function bindControls() {
	document
		.getElementById("posts-search")
		?.addEventListener("input", (event) => {
			searchQuery = (event.target as HTMLInputElement).value;
			currentPage = 1;
			renderResults();
		});

	bindDropdown(
		"posts-department-filter",
		departmentOptions,
		"All departments",
		(value) => {
			departmentFilter = value;
			currentPage = 1;
			renderResults();
		},
	);
	bindDropdown("posts-tag-filter", tagOptions, "All courses", (value) => {
		tagFilter = value;
		currentPage = 1;
		renderResults();
	});
}

function bindResultEvents() {
	const tableContainer = document.getElementById("posts-table-container");
	const paginationContainer = document.getElementById(
		"posts-pagination-container",
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
						: (posts.find((post) => post.id === id) ?? null);
				renderSelection();
			});
		});

	bindPostTableSort((field) => {
		currentSort =
			currentSort.field === field
				? {
						field,
						direction:
							currentSort.direction === "asc" ? "desc" : "asc",
					}
				: { field, direction: field === "created" ? "desc" : "asc" };
		currentPage = 1;
		renderResults();
	}, tableContainer);

	paginationContainer
		.querySelectorAll<HTMLButtonElement>("[data-page]")
		.forEach((button) => {
			button.addEventListener("click", () => {
				if (button.disabled) return;
				currentPage = Number(button.dataset.page);
				renderResults();
			});
		});
}

export function AdminPostsPage() {
	renderPage();
}
