import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import { forgotPassword, resetPassword } from '../../api/auth';

const { mockLogout } = vi.hoisted(() => ({ mockLogout: vi.fn() }));
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));
vi.mock('../../api/auth', () => ({ resetPassword: vi.fn(), forgotPassword: vi.fn() }));

function LoginPage() {
    return <p>Login page</p>;
}

function renderAt(url: string) {
    render(
        <MemoryRouter initialEntries={[url]}>
            <Routes>
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('ResetPassword', () => {
    test('checks the two passwords match before sending', async () => {
        renderAt('/reset-password?token=tok');
        await userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        await userEvent.type(screen.getByLabelText('Confirm new password'), 'a-different-one');
        await userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        expect(await screen.findByText(/don't match/i)).toBeInTheDocument();
        expect(resetPassword).not.toHaveBeenCalled();
    });

    test('changes the password, signs out and says so on the login page', async () => {
        (resetPassword as Mock).mockResolvedValue(undefined);
        renderAt('/reset-password?token=tok');
        await userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        await userEvent.type(screen.getByLabelText('Confirm new password'), 'a-new-password');
        await userEvent.click(screen.getByRole('button', { name: 'Change password' }));

        expect(await screen.findByText(/login page/i)).toBeInTheDocument();
        expect(resetPassword).toHaveBeenCalledWith('tok', 'a-new-password');
        expect(mockLogout).toHaveBeenCalledWith('Your password has been changed. Log in with your new password.');
    });

    test('offers a new link when this one has expired', async () => {
        (resetPassword as Mock).mockRejectedValue({
            isAxiosError: true,
            response: { status: 400, data: { error: 'This link is invalid or has expired. Ask for a new one.' } },
        });
        renderAt('/reset-password?token=old');
        await userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        await userEvent.type(screen.getByLabelText('Confirm new password'), 'a-new-password');
        await userEvent.click(screen.getByRole('button', { name: 'Change password' }));

        expect(await screen.findByText(/invalid or has expired/i)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /ask for a new one/i })).toHaveAttribute('href', '/forgot-password');
    });

    test('explains a link without a token', () => {
        renderAt('/reset-password');
        expect(screen.getByText(/missing its code/i)).toBeInTheDocument();
    });
});

describe('ForgotPassword', () => {
    test('shows the same confirmation whatever the answer', async () => {
        (forgotPassword as Mock).mockResolvedValue(undefined);
        renderAt('/forgot-password');
        await userEvent.type(screen.getByLabelText('Email'), 'someone@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

        expect(await screen.findByText(/if an account uses someone@example.com/i)).toBeInTheDocument();
        expect(forgotPassword).toHaveBeenCalledWith('someone@example.com');
    });
});
