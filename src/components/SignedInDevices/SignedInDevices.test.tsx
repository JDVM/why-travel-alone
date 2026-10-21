import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignedInDevices from './SignedInDevices';
import { describeDevice } from './describeDevice';
import { getSessions, signOutOtherSessions } from '../../api/auth';

vi.mock('../../api/auth', () => ({ getSessions: vi.fn(), signOutOtherSessions: vi.fn() }));

const CHROME_WINDOWS =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36';
const SAFARI_IPHONE =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';

const session = (overrides: object) => ({
    id: 'a'.repeat(16),
    user_agent: CHROME_WINDOWS,
    created_at: '2026-10-01T10:00:00Z',
    last_seen_at: '2026-10-20T10:00:00Z',
    current: false,
    ...overrides,
});

describe('describeDevice', () => {
    test('names common browsers and systems', () => {
        expect(describeDevice(CHROME_WINDOWS)).toBe('Chrome on Windows');
        expect(describeDevice(SAFARI_IPHONE)).toBe('Safari on iPhone or iPad');
        expect(describeDevice(null)).toBe('Unknown device');
    });
});

describe('SignedInDevices', () => {
    test('lists devices, marks this one, and signs out the others', async () => {
        (getSessions as Mock)
            .mockResolvedValueOnce([
                session({ id: '1', current: true }),
                session({ id: '2', user_agent: SAFARI_IPHONE }),
            ])
            .mockResolvedValueOnce([session({ id: '1', current: true })]);
        (signOutOtherSessions as Mock).mockResolvedValue(1);
        render(<SignedInDevices />);

        expect(await screen.findByText('(this device)')).toBeInTheDocument();
        expect(screen.getByText('Safari on iPhone or iPad')).toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Sign out other devices' }));
        expect(await screen.findByText('Signed out 1 other device.')).toBeInTheDocument();
        expect(signOutOtherSessions).toHaveBeenCalledTimes(1);
        expect(await screen.findAllByRole('listitem')).toHaveLength(1);
        expect(screen.queryByRole('button', { name: 'Sign out other devices' })).not.toBeInTheDocument();
    });

    test('offers nothing to sign out when this is the only device', async () => {
        (getSessions as Mock).mockResolvedValue([session({ current: true })]);
        render(<SignedInDevices />);
        expect(await screen.findByText('(this device)')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sign out other devices' })).not.toBeInTheDocument();
    });
});
