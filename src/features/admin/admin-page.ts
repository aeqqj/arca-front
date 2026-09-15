import { initIcons } from "../../shared/icons.ts";
import { adminHeader } from "./components/adminHeader.ts";
import { adminSideBar } from "./components/adminSideBar.ts";
import { statCard } from "./components/statCard.ts";

export function AdminPage() {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
        <div class="h-full flex">
            ${adminSideBar()}
            <div class="flex flex-col flex-1 min-w-0">
                ${adminHeader("Dashboard")}
                <div class="flex-1 overflow-y-auto p-8">
                    <div class="flex flex-col gap-8 w-full h-full">
                        <div class="flex gap-4">
                            ${statCard("users")}
                            ${statCard("posts")}
                            ${statCard("pending")}
                        </div>

                        <div class="flex gap-4">
                            <div class="flex flex-1 flex-col gap-4">
                                <div class="h-fit w-fit py-2 px-4 bg-bg3 border border-border">
                                    <p class="text-fg3 font-medium">Post Tags Distribution</p>
                                </div>
                                <div class="h-full bg-bg2 border border-border rounded-xs p-6">
                                    <div id="tag-distribution" class="flex flex-col gap-8">
                                        <p class="text-fg5 text-body-sm">Loading...</p>
                                    </div>
                                </div>
                            </div>
                            <div class="h-full flex flex-1 flex-col gap-4">
                                <div class="h-fit w-fit py-2 px-4 bg-bg3 border border-border">
                                    <p class="text-fg3 font-medium">Recent Activity</p>
                                </div>
                                <div class="flex-1 bg-bg2 border border-border rounded-xs p-5">
                                    <div id="recent-activity" class="flex flex-col gap-3">
                                        <p class="text-fg5 text-body-sm">Loading...</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div class="h-fit w-fit py-2 px-4 bg-bg3 border border-border">
                                <p class="text-fg3 font-medium">Pending Posts</p>
                            </div>
                            <table class="admin-table w-full table-layout-fixed bg-bg2">
                                <colgroup>
                                    <col class="w-[40%]" />
                                    <col class="w-[10%]" />
                                    <col class="w-[10%]" />
                                    <col class="w-[20%]" />
                                    <col class="w-[14%]" />
                                    <col class="w-[6%]" />
                                </colgroup>
                                <thead>
                                    <tr class="bg-bg3">
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
                                        <td colspan="6" class="text-center py-8 text-fg5">Loading...</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
        const { api } = await import("../../core/api/api.ts");
        const { ADMIN, POST } = await import("../../core/api/endpoints.ts");

        const [users, pendingPosts] = await Promise.all([
            api.get<any[]>(ADMIN.USERS).catch(() => []),
            api.get<any[]>(POST.BY_PENDING).catch(() => []),
        ]);

        userCount = users.length;
        pendingCount = pendingPosts.length;
    } catch (e) {
        console.warn("API unavailable for stats");
    }

    document.getElementById("stat-users")!.textContent = String(userCount || 32);
    document.getElementById("stat-posts")!.textContent = "—";
    document.getElementById("stat-pending")!.textContent = String(pendingCount || 5);
}

async function loadTagDistribution() {
    const mockTags = [
        { tag: "Algorithms and Complexities", count: 12 },
        { tag: "Web Development", count: 8 },
        { tag: "Data Structures and Algorithms", count: 6 },
        { tag: "Operating Systems", count: 4 },
        { tag: "Software Engineering", count: 3 },
    ];

    let tags: { tag: string; count: number }[] = [];

    try {
        const { api } = await import("../../core/api/api.ts");
        const { POST } = await import("../../core/api/endpoints.ts");
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
    const maxCount = Math.max(...tags.map(t => t.count));

    container.innerHTML = tags.map(({ tag, count }) => {
        const pct = Math.round((count / maxCount) * 100);
        return `
            <div class="flex items-center gap-3">
                <span class="text-fg3 text-body-md w-52 truncate shrink-0">${tag}</span>
                <div class="flex-1 h-2 bg-bg4 rounded-full overflow-hidden">
                    <div class="h-full bg-good/40 rounded-full" style="width: ${pct}%"></div>
                </div>
                <span class="text-fg4 text-body-sm w-8 text-right shrink-0">${count}</span>
            </div>
        `;
    }).join('');
}

function renderRecentActivity() {
    const container = document.getElementById("recent-activity")!;

    const activities = [
        { icon: "file-text", text: '<span>John Doe</span> posted <span class="text-fg-link">"B-trees in Go vs C"</span>', time: "2h ago" },
        { icon: "user-plus", text: '<span>Jane Smith</span> joined the platform', time: "3h ago" },
        { icon: "check", text: '<span -fg1">Admin</span> approved a post by <span class="text-fg1">Mike Chen</span>', time: "5h ago" },
        { icon: "x", text: '<span class="text-fg1">Admin</span> rejected a post by <span class="text-fg1">Anna Reyes</span>', time: "1d ago" },
        { icon: "file-text", text: '<span class="text-fg1">Carlos Garcia</span> posted <span class="text-fg-link">"React vs vanilla JS"</span>', time: "3d ago" },
    ];

    container.innerHTML = activities.map(a => `
        <div class="flex items-start gap-3">
            <i data-lucide="${a.icon}" class="w-4 h-4 text-fg4 mt-0.5 shrink-0"></i>
            <div class="flex-1 min-w-0">
                <p class="text-body-md text-fg3">${a.text}</p>
                <p class="text-label-md text-fg5">${a.time}</p>
            </div>
        </div>
    `).join('');

    initIcons();
}

async function loadPendingPosts() {
    const mockPosts = [
        { id: 101, title: "google made btrees in golang instead of c and so should you go is good its better than everything", firstName: "John", lastName: "Doe", departmentName: "DCISM", postTag: "Algorithms and Complexities", createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
        { id: 102, title: "docker containers are basically just chroot with marketing and everyone acts like its revolutionary", firstName: "Jane", lastName: "Smith", departmentName: "DCISM", postTag: "Software Engineering", createdAt: new Date(Date.now() - 5 * 3600000).toISOString() },
        { id: 103, title: "arcawerawer waerwarware taewrwaerwar eoirwaorejaorejojwajre  aeworjwaoiejrowaerwiraejr ypescript is just javascript wearing a suit and it still lies to you at runtime sometimes anyway, so do this instead retards", firstName: "Mike", lastName: "Chen", departmentName: "DCISM", postTag: "Operating Systems", createdAt: new Date(Date.now() - 24 * 3600000).toISOString() },
        { id: 104, title: "SQL query optimization", firstName: "Anna", lastName: "Reyes", departmentName: "DCISM", postTag: "Data Structures and Algorithms", createdAt: new Date(Date.now() - 48 * 3600000).toISOString() },
        { id: 105, title: "React vs vanilla JS", firstName: "Carlos", lastName: "Garcia", departmentName: "DCISM", postTag: "Web Development", createdAt: new Date(Date.now() - 72 * 3600000).toISOString() },
    ];

    let posts: any[] = [];
    try {
        const { api } = await import("../../core/api/api.ts");
        const { POST } = await import("../../core/api/endpoints.ts");
        posts = await api.get<any[]>(POST.BY_PENDING);
    } catch (e) {
        console.warn("API unavailable, using mock data:", e);
    }

    if (posts.length === 0) {
        posts = mockPosts;
    }

    renderPendingPosts(posts);
}

function renderPendingPosts(posts: any[]) {
    const tbody = document.getElementById("pending-table-body")!;

    tbody.innerHTML = posts.map(post => `
        <tr class="hover:bg-bg2/90 transition-colors">
            <td class="text-fg2 truncate">${post.title}</td>
            <td class="text-fg3 truncate">${post.firstName} ${post.lastName}</td>
            <td class="text-fg3 truncate">${post.departmentName}</td>
            <td class="text-fg3 truncate"><span class="py-1 px-4 text-body-sm text-bg2 bg-red-100 rounded-xs">${post.postTag || '—'}</span></td>
            <td class="text-fg3 truncate">${formatDate(post.createdAt)}</td>
            <td class="text-fg3 text-right">
                <div class="flex gap-2 justify-end">
                    <button class="p-1.5 rounded-xs bg-bad/10 text-bad hover:bg-bad/20 transition-colors" data-reject="${post.id}" title="Reject">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                    <button class="p-1.5 rounded-xs bg-good/10 text-good hover:bg-good/20 transition-colors" data-approve="${post.id}" title="Approve">
                        <i data-lucide="check" class="w-4 h-4"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');

    initIcons();
    bindPostActions();
}

function bindPostActions() {
    document.querySelectorAll<HTMLButtonElement>("[data-approve]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const postId = btn.dataset.approve!;
            await handlePostAction(Number(postId), true);
        });
    });

    document.querySelectorAll<HTMLButtonElement>("[data-reject]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const postId = btn.dataset.reject!;
            await handlePostAction(Number(postId), false);
        });
    });
}

async function handlePostAction(postId: number, approved: boolean) {
    try {
        const { api } = await import("../../core/api/api.ts");
        const { POST } = await import("../../core/api/endpoints.ts");

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
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
