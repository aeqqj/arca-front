// Minimal TTL cache for GET responses, with in-flight request dedupe.
// Keys are namespaced strings ("posts.feed", "subject", ...); invalidate()
// drops by prefix so mutations can target whole families at once.
// Anything user-specific must go through clearCache() on session change.

type Entry = {
	value: unknown;
	expiresAt: number;
};

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

export const TTL = {
	subjects: 5 * 60_000,
	users: 5 * 60_000,
	posts: 30_000,
} as const;

export function cached<T>(
	key: string,
	ttlMs: number,
	fetch: () => Promise<T>,
): Promise<T> {
	const hit = store.get(key);
	if (hit && hit.expiresAt > Date.now()) {
		return Promise.resolve(hit.value as T);
	}
	const pending = inflight.get(key);
	if (pending) {
		return pending as Promise<T>;
	}
	const promise = fetch()
		.then((value) => {
			store.set(key, { value, expiresAt: Date.now() + ttlMs });
			return value;
		})
		.finally(() => {
			inflight.delete(key);
		});
	inflight.set(key, promise);
	return promise;
}

// Drop every cached key starting with the given prefix.
export function invalidate(prefix: string): void {
	for (const key of store.keys()) {
		if (key.startsWith(prefix)) {
			store.delete(key);
		}
	}
}

export function clearCache(): void {
	store.clear();
}
