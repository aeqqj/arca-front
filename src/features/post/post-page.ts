import { initIcons } from "../../shared/icons.ts";
import { header, bindHeader } from "../../shared/components/header.ts";
import { fullPost } from "./components/fullPost.ts";
import { profileExtra } from "./components/profileExtra.ts";
import { miniProfile } from "./components/miniProfile.ts";
import { ensureVotesBound } from "../../shared/handlers/voteHandler.ts";
import {
	downloadFile,
	getMyVote,
	getPost,
	getUserById,
	getUserPosts,
} from "../../core/api/endpoints.ts";
import type { PostResponse, User } from "../../core/api/types.ts";
import { getCurrentUser } from "../../core/auth/session.ts";
import {
	errorPanel,
	isCurrentRender,
	nextRenderToken,
	paint,
	loadingShell,
} from "../../core/render.ts";

export async function PostPage() {
	const token = nextRenderToken();
	paint(token, loadingShell());

	const id = Number(new URLSearchParams(window.location.search).get("id"));

	let post: PostResponse | null = null;
	let author: User | null = null;
	let authorPosts: PostResponse[] = [];
	let myVote: Awaited<ReturnType<typeof getMyVote>>;
	let error = "";
	if (!Number.isInteger(id) || id <= 0) {
		error = "Missing or invalid post id.";
	} else {
		try {
			post = await getPost(id);
			// Author sidebar context; a failure here must not hide the post.
			[author, authorPosts, myVote] = await Promise.all([
				getUserById(post.user_id).catch(() => null),
				getUserPosts(post.user_id).catch(() => [] as PostResponse[]),
				getMyVote(post.id).catch(() => undefined),
			]);
		} catch (e) {
			error = e instanceof Error ? e.message : "Failed to load post";
		}
	}

	const content = post
		? fullPost(post, myVote?.vote_type ?? null)
		: errorPanel("Post not found", error || undefined);

	const painted = paint(
		token,
		`
        <div class="h-full flex flex-col">
            ${header(getCurrentUser())}
            <div class="w-full px-12 py-8 flex gap-10 justify-center items-start flex-1 min-h-0 overflow-y-auto">
                <div class="flex flex-col gap-6">
                    ${content}
                </div>
                <div class="flex flex-col gap-8 self-start sticky top-0">
                    ${miniProfile(author)}
                    ${profileExtra(author, authorPosts, post?.id)}
                </div>
            </div>
        </div>
    `,
	);
	if (!painted) {
		return;
	}
	initIcons();
	bindHeader();
	ensureVotesBound();

	// The download endpoint requires the Authorization header, which plain
	// <a href> cannot send — fetch each file as an authenticated blob.
	for (const f of post?.files ?? []) {
		downloadFile(f.id)
			.then((blob) => {
				// blob may resolve after the user navigated away
				if (!isCurrentRender(token)) {
					return;
				}
				const link = document.querySelector<HTMLAnchorElement>(
					`a[data-file-id="${f.id}"]`,
				);
				if (!link) {
					return;
				}
				link.href = URL.createObjectURL(blob);
				link.download = f.file_name;
			})
			.catch(() => {
				// leave the card inert if the download fails
			});
	}
}
