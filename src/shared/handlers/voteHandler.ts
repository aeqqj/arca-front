import { castVote, getPost } from "../../core/api/endpoints.ts";
import { rememberVote } from "../../core/votes.ts";
import type { VoteType } from "../../core/api/types.ts";

// One document-level delegated listener drives every vote widget in the app.
// Cards/full posts mark themselves with [data-post-id] and their arrows with
// [data-vote]; a click POSTs the toggle and refreshes counts from the server.
let bound = false;

export function ensureVotesBound(): void {
	if (bound) {
		return;
	}
	bound = true;
	document.addEventListener(
		"click",
		(e) => {
			const arrow = (e.target as Element | null)?.closest?.(
				"[data-vote]",
			) as HTMLElement | null;
			if (!arrow) {
				return;
			}
			// Vote targets live inside clickable cards — capture the click
			// before the router's bubble-phase listener can navigate.
			e.preventDefault();
			e.stopPropagation();
			void handleVote(arrow);
		},
		true,
	);
}

async function handleVote(arrow: HTMLElement): Promise<void> {
	const card = arrow.closest<HTMLElement>("[data-post-id]");
	const postId = Number(card?.dataset.postId);
	const type = arrow.dataset.vote as VoteType | undefined;
	if (!card || !Number.isInteger(postId) || postId <= 0 || !type) {
		return;
	}

	try {
		// Toggle semantics: clicking the same arrow again clears the vote
		// (server responds empty); clicking the other one flips it.
		const result = await castVote(postId, type);
		rememberVote(postId, result?.vote_type ?? null);
		const fresh = await getPost(postId);

		setCount(card, "up", fresh.upvote_count ?? 0);
		setCount(card, "down", fresh.downvote_count ?? 0);

		const mine = result?.vote_type ?? null;
		for (const a of card.querySelectorAll<HTMLElement>("[data-vote]")) {
			const active = a.dataset.vote === mine;
			a.classList.toggle(
				"text-good",
				active && a.dataset.vote === "UPVOTE",
			);
			a.classList.toggle(
				"text-bad",
				active && a.dataset.vote === "DOWNVOTE",
			);
		}
	} catch {
		// failed votes simply leave the previous state on screen
	}
}

function setCount(
	card: HTMLElement,
	which: "up" | "down",
	value: number,
): void {
	const el = card.querySelector<HTMLElement>(`[data-count="${which}"]`);
	if (el) {
		el.textContent = String(value);
	}
}
