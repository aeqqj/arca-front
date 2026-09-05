import { initIcons } from "../../shared/icons.ts";
import { header, bindHeader } from "../../shared/components/header.ts";
import { sideBar } from "../../shared/components/sideBar.ts";
import {
	textEditor,
	initTextEditor,
	getEditorHtmlContent,
	getEditorTextContent,
	getTextEditor,
} from "./components/textEditor.ts";
import { createLinks } from "./components/createLinks.ts";
import {
	createAttachments,
	bindCreateAttachments,
	clearSelectedFiles,
	getSelectedFiles,
} from "./components/createAttachments.ts";
import { $getRoot } from "lexical";
import { bindYoutubeLinks } from "../../shared/handlers/youtubeHandler.ts";
import {
	createPost,
	getSubjects,
	parseCreatedPostRowId,
	uploadFiles,
} from "../../core/api/endpoints.ts";
import type { SubjectResponse } from "../../core/api/types.ts";
import { getCurrentUser } from "../../core/auth/session.ts";
import { DEFAULT_DEPARTMENT_ID } from "../../core/config.ts";
import {
	esc,
	nextRenderToken,
	paint,
	isCurrentRender,
	loadingShell,
} from "../../core/render.ts";

export async function CreatePostPage() {
	const token = nextRenderToken();
	paint(token, loadingShell());

	let subjects: SubjectResponse[] = [];
	try {
		subjects = await getSubjects();
	} catch {
		// course list is optional — the select just stays empty
	}

	const painted = paint(
		token,
		`
        <div class="h-full flex flex-col">
            ${header(getCurrentUser())}
            <div class="w-full flex items-start flex-1 min-h-0">
                <aside class="h-full overflow-y-auto shrink-0">
                    ${sideBar(subjects)}
                </aside>
                <div class="w-full h-full px-12 py-8 flex gap-10 justify-center overflow-y-auto">
                    <div class="flex gap-4 flex-col">
                        <div class="flex justify-between items-center">
                            <h1 class="text-fg1 font-medium">Create Post</h1>
                            <select id="post-tag" class="px-3 py-2 bg-bg2 border border-border text-fg2 hover:bg-bg3 focus:border-fg5/60 outline-none transition-colors">
                                <option value="">No course</option>
                                ${subjects
									.map(
										(s) =>
											`<option value="${s.id}">${esc(s.name)}</option>`,
									)
									.join("")}
                            </select>
                        </div>
                        <form id="create-post-form" action="" class="w-200 flex flex-col gap-8 text-fg3">
                            <div class="flex flex-col gap-2">
                                <label for="post-title" class="text-fg2">Title</label>
                                <input type="text" id="post-title" maxlength="30" class="p-4 h-fit w-full border border-border bg-bg2 hover:bg-bg3/60 focus:border-fg5/60 transition-colors">
                            </div>
                            <div class="text-fg2 flex flex-col gap-2">
                                <p>Video</p>
                                <div class="border border-border relative w-full aspect-video bg-bg4 cursor-pointer hover:bg-bg5/80 transition-colors" data-video-id="4WfSohJ9K5o" data-yt-thumb>
                                    <img src="https://img.youtube.com/vi/4WfSohJ9K5o/maxresdefault.jpg" class="w-full h-full object-cover" />
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <i data-lucide="play" class="w-12 h-12 text-fg2" fill="#e5e5e5"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="text-fg2 flex flex-col gap-2">
                                <p>Image</p>
                                <div class="border border-border relative w-full aspect-video bg-bg4 hover:bg-bg5/80 transition-colors"> 
                                    <img src="https://img.youtube.com/vi/4WfSohJ9K5o/maxresdefault.jpg" class="w-full h-full object-cover" />
                                </div>
                            </div>
                            ${textEditor()}
                            <p id="post-msg" class="text-body-md hidden p-3 border border-border rounded-xs"></p>
                            <div class="flex gap-2 w-full">
                                <button type="button" class="w-full bg-bg3 text-fg2 border border-border py-3 rounded-xs hover:opacity-90 transition-all">Save Draft</button>
                                <button id="post-submit" type="submit" class="w-full bg-fg2 text-bg3 border border-fg2 py-3 rounded-xs hover:opacity-90 transition-all">Post</button>
                            </div>
                        </form>
                    </div>
                    <div class="flex flex-col gap-8 sticky top-0 self-start">
                        ${createAttachments()}
                        ${createLinks()}
                    </div>
                </div>
            </div>
        </div>
    `,
	);
	if (!painted) {
		return;
	}
	initTextEditor();
	initIcons();
	bindHeader();
	bindYoutubeLinks(document.querySelector<HTMLDivElement>("#app")!);
	bindCreateAttachments();

	const form = document.querySelector<HTMLFormElement>("#create-post-form")!;
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		void submitPost(token);
	});
}

function setMsg(text: string, bad = false): void {
	const el = document.querySelector<HTMLParagraphElement>("#post-msg")!;
	el.textContent = text;
	el.classList.remove("hidden");
	el.style.borderColor = bad ? "var(--color-bad, #ef4444)" : "";
}

async function submitPost(renderToken: number): Promise<void> {
	const user = getCurrentUser();
	if (!user) {
		setMsg("Your session expired. Sign in again.", true);
		return;
	}

	const title = document
		.querySelector<HTMLInputElement>("#post-title")!
		.value.trim();
	const content = getEditorHtmlContent();
	const text = getEditorTextContent().trim();
	const tagEl = document.querySelector<HTMLSelectElement>("#post-tag")!;
	const tag = tagEl.value ? Number(tagEl.value) : null;
	const files = getSelectedFiles();
	const submitBtn =
		document.querySelector<HTMLButtonElement>("#post-submit")!;

	if (!title) {
		setMsg("A title is required.", true);
		return;
	}
	if (!text) {
		setMsg("Write some content before posting.", true);
		return;
	}

	setMsg("Posting…");
	submitBtn.disabled = true;

	try {
		const created = await createPost({
			title,
			content,
			user_id: user.id,
			department_id: DEFAULT_DEPARTMENT_ID,
			post_tag: tag,
		});

		let message =
			created.message || "Post created — awaiting admin approval.";

		// Attachments need the post row PK, which only appears in the
		// create message text (backend is frozen; see PLAN.md).
		const rowId = parseCreatedPostRowId(created);
		if (files.length > 0) {
			if (rowId === null) {
				message +=
					" (attachments skipped: post id not found in response)";
			} else {
				try {
					const uploaded = await uploadFiles(files, user.id, rowId);
					message += ` ${uploaded.message ?? ""}`.trimEnd();
				} catch (ue) {
					message += ` Upload failed: ${ue instanceof Error ? ue.message : "unknown error"}`;
				}
			}
			clearSelectedFiles();
		}

		if (!isCurrentRender(renderToken)) return;
		setMsg(message);
		document.querySelector<HTMLInputElement>("#post-title")!.value = "";
		getTextEditor()?.update(() => {
			$getRoot().clear();
		});
		tagEl.value = "";
	} catch (err) {
		if (!isCurrentRender(renderToken)) return;
		setMsg(
			err instanceof Error ? err.message : "Failed to create post",
			true,
		);
	} finally {
		const btn = document.querySelector<HTMLButtonElement>("#post-submit");
		if (btn) {
			btn.disabled = false;
		}
	}
}
