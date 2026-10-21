import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VerifyEmailBanner from './VerifyEmailBanner';
import { resendVerification } from '../../api/auth';

const { mockRefreshAccount } = vi.hoisted(() => ({ mockRefreshAccount: vi.fn() }));
let mockAccount: { email: string; email_verified: boolean } | null = null;
vi.mock('../../auth/AuthContext', () => ({
    useAuth: () => ({ account: mockAccount, refreshAccount: mockRefreshAccount }),
}));
vi.mock('../../api/auth', () => ({ resendVerification: vi.fn() }));

describe('VerifyEmailBanner', () => {
    beforeEach(() => {
        mockRefreshAccount.mockReset().mockResolvedValue(undefined);
    });

    test('is hidden when signed out or already confirmed', () => {
        mockAccount = null;
        const { container, rerender } = render(<VerifyEmailBanner />);
        expect(container).toBeEmptyDOMElement();

        mockAccount = { email: 'a@example.com', email_verified: true };
        rerender(<VerifyEmailBanner />);
        expect(container).toBeEmptyDOMElement();
    });

    test('asks an unconfirmed user to confirm, and sends a new link', async () => {
        mockAccount = { email: 'a@example.com', email_verified: false };
        (resendVerification as Mock).mockResolvedValue(undefined);
        render(<VerifyEmailBanner />);

        expect(screen.getByText(/confirm your email address to invite travelers/i)).toHaveTextContent('a@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Send a new link' }));

        expect(await screen.findByText(/sent\. check a@example.com/i)).toBeInTheDocument();
        expect(resendVerification).toHaveBeenCalledTimes(1);
        expect(mockRefreshAccount).toHaveBeenCalled();
    });
});
