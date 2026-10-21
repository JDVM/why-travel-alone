// A short, readable name for a browser's user-agent string, e.g.
// "Chrome on Windows". Good enough to recognise your own devices.
export function describeDevice(userAgent: string | null): string {
    if (!userAgent) {
        return 'Unknown device';
    }
    const browser =
        (/Edg\//.test(userAgent) && 'Edge') ||
        (/Firefox\//.test(userAgent) && 'Firefox') ||
        (/(Chrome|CriOS)\//.test(userAgent) && 'Chrome') ||
        (/Safari\//.test(userAgent) && 'Safari') ||
        'A browser';
    const system =
        (/iPhone|iPad/.test(userAgent) && 'iPhone or iPad') ||
        (/Android/.test(userAgent) && 'Android') ||
        (/Windows/.test(userAgent) && 'Windows') ||
        (/Mac OS X|Macintosh/.test(userAgent) && 'Mac') ||
        (/Linux/.test(userAgent) && 'Linux') ||
        null;
    return system ? `${browser} on ${system}` : browser;
}
