import type { ErrorEvent } from '@sentry/react';
import { initMonitoring, reportError, scrubBreadcrumb, scrubEvent, stripQuery } from './monitoring';

describe('monitoring', () => {
    test('is off without REACT_APP_SENTRY_DSN, and reporting is then a no-op', () => {
        expect(process.env.REACT_APP_SENTRY_DSN).toBeUndefined();
        expect(initMonitoring()).toBe(false);
        expect(() => reportError(new Error('ignored'))).not.toThrow();
    });

    test('strips query strings and fragments, which can carry one-time tokens', () => {
        expect(stripQuery('https://app.example.com/reset-password?token=abc#x')).toBe(
            'https://app.example.com/reset-password'
        );
        expect(stripQuery('/trips/1')).toBe('/trips/1');
    });

    test('scrubs personal data from events', () => {
        const event = scrubEvent({
            type: undefined,
            request: {
                url: 'https://app.example.com/reset-password?token=abc',
                query_string: 'token=abc',
                cookies: { a: 'b' },
                data: { password: 'x' },
                headers: { 'User-Agent': 'test', Referer: 'https://app.example.com/verify-email?token=def' },
            },
            user: { id: '7', email: 'a@example.com', ip_address: '1.2.3.4' },
        } as ErrorEvent);

        expect(event.request).toEqual({
            url: 'https://app.example.com/reset-password',
            headers: { 'User-Agent': 'test', Referer: 'https://app.example.com/verify-email' },
        });
        expect(event.user).toEqual({ id: '7' });
    });

    test('drops console arguments and query strings from breadcrumbs', () => {
        expect(
            scrubBreadcrumb({
                category: 'console',
                message: 'Request failed',
                data: { arguments: [{ config: { headers: { Authorization: 'Bearer abc' } } }], logger: 'console' },
            })
        ).toEqual({ category: 'console', message: 'Request failed', data: { logger: 'console' } });

        expect(
            scrubBreadcrumb({ category: 'navigation', data: { from: '/login?next=1', to: '/reset-password?token=abc' } })
                .data
        ).toEqual({ from: '/login', to: '/reset-password' });

        expect(scrubBreadcrumb({ category: 'xhr', data: { url: 'http://api/trips?x=1', status_code: 500 } }).data).toEqual(
            { url: 'http://api/trips', status_code: 500 }
        );
    });
});
