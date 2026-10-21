import type { Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import YourData from './YourData';
import { deleteAccount, exportAccountData } from '../../api/account';

const { mockLogout } = vi.hoisted(() => ({ mockLogout: vi.fn() }));
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));
vi.mock('../../api/account', () => ({ exportAccountData: vi.fn(), deleteAccount: vi.fn() }));

function LoginPage() {
    return <p>Login page</p>;
}

function renderYourData() {
    render(
        <MemoryRouter initialEntries={['/profile']}>
            <Routes>
                <Route path="/profile" element={<YourData />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('YourData', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('downloads the export as a file', async () => {
        (exportAccountData as Mock).mockResolvedValue(new Blob(['{}'], { type: 'application/json' }));
        const createObjectURL = vi.fn(() => 'blob:export');
        const revokeObjectURL = vi.fn();
        Object.assign(URL, { createObjectURL, revokeObjectURL });
        const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        renderYourData();
        await userEvent.click(screen.getByRole('button', { name: 'Download my data' }));

        await waitFor(() => expect(click).toHaveBeenCalled());
        expect(createObjectURL).toHaveBeenCalled();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:export');
        click.mockRestore();
    });

    test('asks for the password before deleting, and can be cancelled', async () => {
        renderYourData();
        expect(screen.queryByLabelText(/enter your password/i)).not.toBeInTheDocument();

        await userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        expect(await screen.findByText(/can't be undone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/enter your password/i)).toBeRequired();

        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        await waitFor(() => expect(screen.queryByLabelText(/enter your password/i)).not.toBeInTheDocument());
        expect(deleteAccount).not.toHaveBeenCalled();
    });

    test('deletes the account, logs out and says so on the login page', async () => {
        (deleteAccount as Mock).mockResolvedValue(undefined);
        renderYourData();

        await userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        await userEvent.type(await screen.findByLabelText(/enter your password/i), 'my-password');
        await userEvent.click(screen.getByRole('button', { name: 'Delete my account permanently' }));

        expect(await screen.findByText(/login page/i)).toBeInTheDocument();
        expect(deleteAccount).toHaveBeenCalledWith('my-password');
        expect(mockLogout).toHaveBeenCalledWith('Your account and its data have been deleted.');
    });

    test("shows the API's error and stays signed in when the password is wrong", async () => {
        (deleteAccount as Mock).mockRejectedValue({
            isAxiosError: true,
            response: { status: 403, data: { error: 'Incorrect password' } },
        });
        renderYourData();

        await userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        await userEvent.type(await screen.findByLabelText(/enter your password/i), 'wrong');
        await userEvent.click(screen.getByRole('button', { name: 'Delete my account permanently' }));

        expect(await screen.findByText('Incorrect password')).toBeInTheDocument();
        expect(mockLogout).not.toHaveBeenCalled();
    });
});
