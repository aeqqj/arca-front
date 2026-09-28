import { initIcons } from "../../../../shared/icons.ts";
import { adminHeader } from "../../components/layout/adminHeader.ts";
import { adminSideBar } from "../../components/layout/adminSideBar.ts";
import { statCard } from "../../components/dashboard/statCard.ts";
import {
	getMockPendingPosts,
	mockTags,
	recentActivities,
} from "./mock-data.ts";

export function AdminPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="dashboard-layout h-full flex">
            ${adminSideBar()}
            <div class="dashboard-main-column flex flex-col flex-1 min-w-0 min-h-0">
                ${adminHeader("Dashboard")}
                <main class="dashboard-content">
                        <section class="dashboard-stats-grid" aria-label="Dashboard statistics">
                            ${statCard("users")}
                            ${statCard("posts")}
                            ${statCard("pending")}
                        </section>

                        <div class="dashboard-insights-grid">
                            <section class="dashboard-panel">
                                <header class="dashboard-panel-header">
                                    <h2 class="dashboard-panel-title">Post Tags Distribution</h2>
                                </header>
                                <div class="dashboard-panel-body dashboard-panel-body--tags">
                                    <div id="tag-distribution" class="flex flex-col gap-5">
                                        <p class="text-fg5 text-body-sm">Loading...</p>
                                    </div>
                                </div>
                            </section>

                            <section class="dashboard-panel">
                                <header class="dashboard-panel-header">
                                    <h2 class="dashboard-panel-title">Recent Activity</h2>
                                </header>
                                <div class="dashboard-panel-body dashboard-panel-body--activity">
                                    <div id="recent-activity" class="flex flex-col">
                                        <p class="text-fg5 text-body-sm">Loading...</p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section class="dashboard-panel dashboard-pending-panel">
                            <header class="dashboard-panel-header">
                                <h2 class="dashboard-panel-title">Pending Posts</h2>
                            </header>
                            <table class="dashboard-table">
                                <colgroup>
                                    <col class="dashboard-column-title" />
                                    <col class="dashboard-column-author" />
                                    <col class="dashboard-column-department" />
                                    <col class="dashboard-column-tag" />
                                    <col class="dashboard-column-date" />
                                    <col class="dashboard-column-actions" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Department</th>
                                        <th>Tag</th>
                                        <th>Date</th>
                                        <th class="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="pending-table-body">
                                    <tr>
                                        <td colspan="6" class="text-center py-4 text-fg5">Loading...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </main>
            </div>
        </div>
    `;
	initIcons();
	loadStats();
	loadTagDistribution();
	renderRecentActivity();
	loadPendingPosts();
}

async function loadStats() {
	let userCount = 0;
	let pendingCount = 0;

	try {
		const { api } = await import("../../../../core/api/api.ts");
		const { ADMIN, POST } =
			await import("../../../../core/api/endpoints.ts");

		const [users, pendingPosts] = await Promise.all([
			api.get<any[]>(ADMIN.USERS).catch(() => []),
			api.get<any[]>(POST.BY_PENDING).catch(() => []),
		]);

		userCount = users.length;
		pendingCount = pendingPosts.length;
	} catch (e) {
		console.warn("API unavailable for stats");
	}

	document.getElementById("stat-users")!.textContent = String(
		userCount || 32,
	);
	document.getElementById("stat-posts")!.textContent = "—";
	document.getElementById("stat-pending")!.textContent = String(
		pendingCount || 5,
	);
}

async function loadTagDistribution() {
	let tags: { tag: string; count: number }[] = [];

	try {
		const { api } = await import("../../../../core/api/api.ts");
		const { POST } = await import("../../../../core/api/endpoints.ts");
		const posts = await api.get<any[]>(POST.BASE);

		const tagMap = new Map<string, number>();
		for (const post of posts) {
			const tag = post.postTag || "Uncategorized";
			tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
		}

		tags = Array.from(tagMap.entries())
			.map(([tag, count]) => ({ tag, count }))
			.sort((a, b) => b.count - a.count);
	} catch (e) {
		console.warn("API unavailable, using mock tag data:", e);
	}

	if (tags.length === 0) {
		tags = mockTags;
	}

	renderTagDistribution(tags);
}

function renderTagDistribution(tags: { tag: string; count: number }[]) {
	const container = document.getElementById("tag-distribution")!;
	const maxCount = Math.max(...tags.map((t) => t.count));

	container.innerHTML = tags
		.map(({ tag, count }) => {
			const pct = Math.round((count / maxCount) * 100);
			return /* HTML */ `
				<div class="dashboard-tag-row">
					<span class="dashboard-tag-label">${tag}</span>
					<div class="dashboard-tag-track">
						<div
							class="dashboard-tag-fill"
							style="width: ${pct}%"
						></div>
					</div>
					<span class="dashboard-tag-count">${count}</span>
				</div>
			`;
		})
		.join("");
}

function renderRecentActivity() {
	const container = document.getElementById("recent-activity")!;

	container.innerHTML = recentActivities
		.map(
			(a) => `
        <div class="dashboard-activity-item">
            <div class="dashboard-activity-icon">
                <i data-lucide="${a.icon}" class="w-4 h-4"></i>
            </div>
            <div class="flex-1 min-w-0">
                <p class="dashboard-activity-text">${a.text}</p>
                <p class="text-label-md text-fg5 mt-1">${a.time}</p>
            </div>
        </div>
    `,
		)
		.join("");

	initIcons();
}

async function loadPendingPosts() {
	let posts: any[] = [];
	try {
		const { api } = await import("../../../../core/api/api.ts");
		const { POST } = await import("../../../../core/api/endpoints.ts");
		posts = await api.get<any[]>(POST.BY_PENDING);
	} catch (e) {
		console.warn("API unavailable, using mock data:", e);
	}

	if (posts.length === 0) {
		posts = getMockPendingPosts();
	}

	renderPendingPosts(posts);
}

function renderPendingPosts(posts: any[]) {
	const tbody = document.getElementById("pending-table-body")!;

	tbody.innerHTML = posts
		.map(
			(post) => `
        <tr>
            <td class="text-fg2"><span class="dashboard-cell-text">${post.title}</span></td>
            <td class="text-fg3"><span class="dashboard-cell-text">${post.firstName} ${post.lastName}</span></td>
            <td class="text-fg3"><span class="dashboard-cell-text">${post.departmentName}</span></td>
            <td class="text-fg3"><span class="dashboard-tag-badge">${post.postTag || "—"}</span></td>
            <td class="text-fg3"><span class="dashboard-cell-text whitespace-nowrap">${formatDate(post.createdAt)}</span></td>
            <td class="text-fg3 text-right">
                <div class="flex gap-2 justify-end">
                    <button class="dashboard-reject-button" data-reject="${post.id}" title="Reject" aria-label="Reject post">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                    <button class="dashboard-approve-button" data-approve="${post.id}" title="Approve" aria-label="Approve post">
                        <i data-lucide="check" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `,
		)
		.join("");

	initIcons();
	bindPostActions();
}

function bindPostActions() {
	document
		.querySelectorAll<HTMLButtonElement>("[data-approve]")
		.forEach((btn) => {
			btn.addEventListener("click", async () => {
				const postId = btn.dataset.approve!;
				await handlePostAction(Number(postId), true);
			});
		});

	document
		.querySelectorAll<HTMLButtonElement>("[data-reject]")
		.forEach((btn) => {
			btn.addEventListener("click", async () => {
				const postId = btn.dataset.reject!;
				await handlePostAction(Number(postId), false);
			});
		});
}

async function handlePostAction(postId: number, approved: boolean) {
	try {
		const { api } = await import("../../../../core/api/api.ts");
		const { POST } = await import("../../../../core/api/endpoints.ts");

		await api.post(POST.APPROVE(String(postId)), {
			approved,
			rejectionReason: approved ? undefined : "Rejected by admin",
		});

		loadPendingPosts();
		loadStats();
	} catch (e) {
		console.error("Failed to approve/reject post:", e);
	}
}

function formatDate(dateStr: string): string {
	if (!dateStr) return "—";
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMin = Math.floor(diffMs / 60000);
	const diffHr = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHr / 24);

	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	if (diffHr < 24) return `${diffHr}h ago`;
	if (diffDay < 7) return `${diffDay}d ago`;
	return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
