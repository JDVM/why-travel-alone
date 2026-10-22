// After a new release, a browser that still has the old app open asks for
// page chunks the server no longer has, and the import fails. Reloading picks
// up the new release.
//
// Reload once at most every minute, so a chunk that is really missing (or a
// network that is down) shows the error screen instead of reloading forever.

const KEY = 'wta:stale-chunk-reload';
const MIN_INTERVAL_MS = 60_000;

interface Clock {
    now: () => number;
    storage: Pick<Storage, 'getItem' | 'setItem'> | null;
    reload: () => void;
}

// Whether to reload, recording the reload if so.
export function shouldReload({ now, storage }: Pick<Clock, 'now' | 'storage'>): boolean {
    try {
        if (!storage) {
            return false;
        }
        const last = Number(storage.getItem(KEY) ?? 0);
        if (now() - last < MIN_INTERVAL_MS) {
            return false;
        }
        storage.setItem(KEY, String(now()));
        return true;
    } catch {
        // Storage can be unavailable (private windows, blocked site data). Not
        // reloading is the safe choice: the error screen has a Reload button.
        return false;
    }
}

function sessionStore(): Storage | null {
    try {
        return window.sessionStorage;
    } catch {
        return null;
    }
}

const browserClock: Clock = {
    now: () => Date.now(),
    storage: sessionStore(),
    reload: () => window.location.reload(),
};

// Wraps a page's dynamic import for React.lazy: if the import fails, reload
// the page (once a minute at most) and keep waiting, so the loading bar shows
// until the new release arrives. Otherwise the error reaches the error screen.
export function reloadIfStale<T>(load: () => Promise<T>, clock: Clock = browserClock): () => Promise<T> {
    return () =>
        load().catch((err) => {
            if (shouldReload(clock)) {
                clock.reload();
                return new Promise<T>(() => {});
            }
            throw err;
        });
}
