import { reloadIfStale, shouldReload } from './staleChunks';

function memoryStorage() {
    const items = new Map<string, string>();
    return {
        getItem: (key: string) => items.get(key) ?? null,
        setItem: (key: string, value: string) => void items.set(key, value),
    };
}

describe('shouldReload', () => {
    test('reloads once, then not again within a minute', () => {
        const storage = memoryStorage();
        let time = 1_000_000;
        const clock = { now: () => time, storage };

        expect(shouldReload(clock)).toBe(true);
        time += 30_000;
        expect(shouldReload(clock)).toBe(false);
        time += 31_000;
        expect(shouldReload(clock)).toBe(true);
    });

    test("doesn't reload when storage is unavailable", () => {
        const blocked = {
            getItem: () => {
                throw new Error('blocked');
            },
            setItem: () => {},
        };
        expect(shouldReload({ now: Date.now, storage: blocked })).toBe(false);
        expect(shouldReload({ now: Date.now, storage: null })).toBe(false);
    });
});

describe('reloadIfStale', () => {
    test('passes a successful import through', async () => {
        const reload = vi.fn();
        const load = reloadIfStale(() => Promise.resolve('page'), { now: Date.now, storage: memoryStorage(), reload });
        await expect(load()).resolves.toBe('page');
        expect(reload).not.toHaveBeenCalled();
    });

    test('reloads on a failed import, then lets a repeat failure through', async () => {
        const reload = vi.fn();
        const clock = { now: () => 5_000_000, storage: memoryStorage(), reload };
        const failing = () => Promise.reject(new Error('Failed to fetch dynamically imported module'));

        // The first failure reloads and never settles, so the loading bar stays up.
        const first = reloadIfStale(failing, clock)();
        let settled = false;
        first.then(() => (settled = true), () => (settled = true));
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(reload).toHaveBeenCalledTimes(1);
        expect(settled).toBe(false);

        // Failing again straight after the reload reaches the error screen.
        await expect(reloadIfStale(failing, clock)()).rejects.toThrow(/dynamically imported/);
        expect(reload).toHaveBeenCalledTimes(1);
    });
});
