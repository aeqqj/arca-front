import avatarPlaceholder from "/dog.png";
import { link, githubLink } from "../../../shared/components/link.ts";
import { attachment } from "../../../shared/components/attachment.ts";

export interface Post {
    id: number;
    title: string;
    content: string;
    firstName: string;
    lastName: string;
    departmentName: string;
    postTag: string;
    status: string;
    createdAt: string;
    upvoteCount: number;
    downvoteCount: number;
    hasGithub?: boolean;
    hasLink?: boolean;
    attachmentCount?: number;
}

export function postFullView(post: Post) {
    return `
        <div class="w-full p-6">
            <div class="w-4xl mx-auto h-fit bg-bg2 border border-border flex flex-col p-6 gap-4 rounded-xs shadow-md">
                <div class="flex gap-4">
                    <img src="${avatarPlaceholder}" class="w-12 h-12 rounded-xs mt-1 shrink-0" />
                    <div class="w-full flex justify-between items-start min-w-0">
                        <div class="flex flex-col gap-1">
                            <span class="text-body-lg text-fg3">${post.firstName} ${post.lastName}</span>
                            <span class="text-fg4 text-body-md">${formatRelativeTime(post.createdAt)} <span class="text-fg5">[${formatStatus(post.status)}]</span></span>
                        </div>
                        <div class="p-1 hover:bg-bg5/60 transition-colors rounded-xs shrink-0">
                            <i data-lucide="ellipsis" class="w-4 h-4 text-fg3"></i>
                        </div>
                    </div>
                </div>
                <p class="text-fg2 text-title-lg font-medium">${post.title}</p>
                <div class="w-fit h-fit py-0.5 px-3 bg-red-100 text-bg2 rounded-xs text-body-md">${post.postTag || 'Uncategorized'}</div>
                <p class="text-fg3 text-body-lg mt-1">${post.content}</p>
            </div>

            ${post.hasGithub || post.hasLink ? `
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 rounded-xs gap-4 mt-4">
                    <h4 class="text-fg3 font-medium">Attachments</h4>
                    <div class="w-full flex flex-col gap-4">
                        ${post.hasGithub ? githubLink() : ''}
                        ${post.hasLink ? link() : ''}
                    </div>
                </div>
            ` : ''}

            ${post.attachmentCount ? `
                <div class="w-full h-fit bg-bg2 border border-border flex flex-col p-6 rounded-xs gap-4 mt-4">
                    <h4 class="text-fg3 font-medium">Files</h4>
                    <div class="w-full flex flex-col gap-4">
                        ${Array(post.attachmentCount).fill(0).map(() => attachment()).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function formatRelativeTime(dateStr: string): string {
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
