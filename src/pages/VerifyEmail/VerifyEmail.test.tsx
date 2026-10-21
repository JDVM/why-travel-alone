import type { Mock } from 'vitest';
import { StrictMode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import VerifyEmail from './VerifyEmail';
import { verifyEmail } from '../../api/auth';

const { mockRefreshAccount } = vi.hoisted(() => ({ mockRefreshAccount: vi.fn() }));
let mockAuthenticated = false;
vi.mock('../../auth/AuthContext', () => ({
    useAuth: () => ({ isAuthenticated: mockAuthenticated, refreshAccount: mockRefreshAccount }),
}));
vi.mock('../../api/auth', () => ({ verifyEmail: vi.fn() }));

function Url() {
    const location = useLocation();
    return <p data-testid="url">{location.pathname + location.search}</p>;
}

function renderAt(url: string) {
    render(
        <StrictMode>
            <MemoryRouter initialEntries={[url]}>
                <Routes>
                    <Route path="/verify-email" element={<><VerifyEmail /><Url /></>} />
                </Routes>
            </MemoryRouter>
        </StrictMode>
    );
}

describe('VerifyEmail', () => {
    beforeEach(() => {
        mockAuthenticated = false;
        mockRefreshAccount.mockReset().mockResolvedValue(undefined);
    });

    test('confirms the address once, and removes the token from the address bar', async () => {
        (verifyEmail as Mock).mockResolvedValue(undefined);
        renderAt('/verify-email?token=abc123');

        expect(await screen.findByText(/your email address is confirmed/i)).toBeInTheDocument();
        expect(verifyEmail).toHaveBeenCalledTimes(1);
        expect(verifyEmail).toHaveBeenCalledWith('abc123');
        expect(screen.getByTestId('url')).toHaveTextContent(/^\/verify-email$/);
        expect(screen.getByRole('link', { name: 'Log in' })).toBeInTheDocument();
    });

    test('refreshes the signed-in account so the reminder disappears', async () => {
        mockAuthenticated = true;
        (verifyEmail as Mock).mockResolvedValue(undefined);
        renderAt('/verify-email?token=abc123');

        expect(await screen.findByText(/your email address is confirmed/i)).toBeInTheDocument();
        // The refresh runs in an effect after that render, and only once.
        await waitFor(() => expect(mockRefreshAccount).toHaveBeenCalled());
        expect(mockRefreshAccount).toHaveBeenCalledTimes(1);
    });

    test("shows the API's message for a used or expired link", async () => {
        (verifyEmail as Mock).mockRejectedValue({
            isAxiosError: true,
            response: { status: 400, data: { error: 'This link is invalid or has expired. Log in to get a new one.' } },
        });
        renderAt('/verify-email?token=used');
        expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument();
    });

    test('explains a link without a token', () => {
        renderAt('/verify-email');
        expect(screen.getByText(/missing its code/i)).toBeInTheDocument();
        expect(verifyEmail).not.toHaveBeenCalled();
    });
});
