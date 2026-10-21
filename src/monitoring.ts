// Error reporting to Sentry. Off unless REACT_APP_SENTRY_DSN is set when the
// app is built. The Sentry SDK is loaded as a separate chunk only when it's on,
// so builds without it don't ship it.
//
// Privacy: events carry no query strings (which can hold one-time tokens), no
// console arguments, and the only user detail is the numeric account id.
import type { Breadcrumb, ErrorEvent } from '@sentry/react';

type SentryModule = typeof import('@sentry/react');

let sentry: SentryModule | null = null;
let loading: Promise<void> | null = null;
// Errors reported while the SDK is still loading.
let queued: Array<{ error: unknown; context?: Record<string, unknown> }> = [];
let userId: number | null = null;

export function stripQuery(url: string): string {
    return url.split(/[?#]/)[0];
}

export function scrubEvent(event: ErrorEvent): ErrorEvent {
    if (event.request) {
        delete event.request.query_string;
        delete event.request.cookies;
        delete event.request.data;
        if (event.request.url) {
            event.request.url = stripQuery(event.request.url);
        }
        if (event.request.headers) {
            const { Referer, referer, ...headers } = event.request.headers;
            const ref = Referer || referer;
            event.request.headers = ref ? { ...headers, Referer: stripQuery(ref) } : headers;
        }
    }
    if (event.user) {
        event.user = event.user.id === undefined ? undefined : { id: event.user.id };
    }
    return event;
}

export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
    const data = breadcrumb.data ? { ...breadcrumb.data } : undefined;
    if (data) {
        // Console arguments can be whole request errors, auth headers included.
        delete data.arguments;
        for (const key of ['url', 'from', 'to']) {
            if (typeof data[key] === 'string') {
                data[key] = stripQuery(data[key]);
            }
        }
    }
    return { ...breadcrumb, data };
}

export function initMonitoring(): boolean {
    const dsn = import.meta.env.REACT_APP_SENTRY_DSN;
    if (!dsn || loading) {
        return Boolean(dsn);
    }
    loading = import('@sentry/react')
        .then((Sentry) => {
            Sentry.init({
                dsn,
                environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT || import.meta.env.MODE,
                release: import.meta.env.REACT_APP_SENTRY_RELEASE || undefined,
                // Collect nothing personal; the scrubbers are a second line of defense.
                dataCollection: {
                    userInfo: false,
                    cookies: false,
                    httpHeaders: false,
                    httpBodies: [],
                    urlQueryParams: false,
                },
                beforeSend: scrubEvent,
                beforeBreadcrumb: scrubBreadcrumb,
            });
            sentry = Sentry;
            Sentry.setUser(userId === null ? null : { id: String(userId) });
            for (const { error, context } of queued) {
                Sentry.captureException(error, context ? { extra: context } : undefined);
            }
            queued = [];
        })
        .catch(() => {
            // Blocked by an ad blocker or offline: carry on without reporting.
            queued = [];
        });
    return true;
}

export function reportError(error: unknown, context?: Record<string, unknown>): void {
    if (sentry) {
        sentry.captureException(error, context ? { extra: context } : undefined);
    } else if (loading) {
        queued.push({ error, context });
    }
}

// Tags later reports with the signed-in account id (null when signed out).
export function setMonitoringUser(accountId: number | null): void {
    userId = accountId;
    if (sentry) {
        sentry.setUser(accountId === null ? null : { id: String(accountId) });
    }
}
