import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import { forgotPassword, resetPassword } from '../../api/auth';

const mockLogout = jest.fn();
jest.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));
jest.mock('../../api/auth', () => ({ resetPassword: jest.fn(), forgotPassword: jest.fn() }));

function LoginPage() {
    const location = useLocation();
    return <p>Login page {JSON.stringify(location.state)}</p>;
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
        userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        userEvent.type(screen.getByLabelText('Confirm new password'), 'a-different-one');
        userEvent.click(screen.getByRole('button', { name: 'Change password' }));
        expect(await screen.findByText(/don't match/i)).toBeInTheDocument();
        expect(resetPassword).not.toHaveBeenCalled();
    });

    test('changes the password, signs out and says so on the login page', async () => {
        (resetPassword as jest.Mock).mockResolvedValue(undefined);
        renderAt('/reset-password?token=tok');
        userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        userEvent.type(screen.getByLabelText('Confirm new password'), 'a-new-password');
        userEvent.click(screen.getByRole('button', { name: 'Change password' }));

        expect(await screen.findByText(/login page/i)).toHaveTextContent('"passwordReset":true');
        expect(resetPassword).toHaveBeenCalledWith('tok', 'a-new-password');
        expect(mockLogout).toHaveBeenCalled();
    });

    test('offers a new link when this one has expired', async () => {
        (resetPassword as jest.Mock).mockRejectedValue({
            isAxiosError: true,
            response: { status: 400, data: { error: 'This link is invalid or has expired. Ask for a new one.' } },
        });
        renderAt('/reset-password?token=old');
        userEvent.type(screen.getByLabelText('New password'), 'a-new-password');
        userEvent.type(screen.getByLabelText('Confirm new password'), 'a-new-password');
        userEvent.click(screen.getByRole('button', { name: 'Change password' }));

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
        (forgotPassword as jest.Mock).mockResolvedValue(undefined);
        renderAt('/forgot-password');
        userEvent.type(screen.getByLabelText('Email'), 'someone@example.com');
        userEvent.click(screen.getByRole('button', { name: 'Send reset link' }));

        expect(await screen.findByText(/if an account uses someone@example.com/i)).toBeInTheDocument();
        expect(forgotPassword).toHaveBeenCalledWith('someone@example.com');
    });
});
