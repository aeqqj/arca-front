import type { VoteType } from "./api/types.ts";

// Session-scoped memory of the current user's votes: the UI records every
// vote it casts so arrows can render the user's state without asking the
// server per post. Lost on tab close (server truth is still fetched for the
// single-post view). Cleared whenever the session changes.
const remembered = new Map<number, VoteType>();

export function rememberVote(postId: number, vote: VoteType | null): void {
	if (vote) {
		remembered.set(postId, vote);
	} else {
		remembered.delete(postId);
	}
}

export function getRememberedVote(postId: number): VoteType | undefined {
	return remembered.get(postId);
}

export function clearRememberedVotes(): void {
	remembered.clear();
}
