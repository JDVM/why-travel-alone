import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import YourData from './YourData';
import { deleteAccount, exportAccountData } from '../../api/account';

const mockLogout = jest.fn();
jest.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));
jest.mock('../../api/account', () => ({ exportAccountData: jest.fn(), deleteAccount: jest.fn() }));

function LoginPage() {
    const location = useLocation();
    return <p>Login page {JSON.stringify(location.state)}</p>;
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
        jest.clearAllMocks();
    });

    test('downloads the export as a file', async () => {
        (exportAccountData as jest.Mock).mockResolvedValue(new Blob(['{}'], { type: 'application/json' }));
        const createObjectURL = jest.fn(() => 'blob:export');
        const revokeObjectURL = jest.fn();
        Object.assign(URL, { createObjectURL, revokeObjectURL });
        const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

        renderYourData();
        userEvent.click(screen.getByRole('button', { name: 'Download my data' }));

        await waitFor(() => expect(click).toHaveBeenCalled());
        expect(createObjectURL).toHaveBeenCalled();
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:export');
        click.mockRestore();
    });

    test('asks for the password before deleting, and can be cancelled', async () => {
        renderYourData();
        expect(screen.queryByLabelText(/enter your password/i)).not.toBeInTheDocument();

        userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        expect(await screen.findByText(/can't be undone/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/enter your password/i)).toBeRequired();

        userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        await waitFor(() => expect(screen.queryByLabelText(/enter your password/i)).not.toBeInTheDocument());
        expect(deleteAccount).not.toHaveBeenCalled();
    });

    test('deletes the account, logs out and says so on the login page', async () => {
        (deleteAccount as jest.Mock).mockResolvedValue(undefined);
        renderYourData();

        userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        userEvent.type(await screen.findByLabelText(/enter your password/i), 'my-password');
        userEvent.click(screen.getByRole('button', { name: 'Delete my account permanently' }));

        expect(await screen.findByText(/login page/i)).toHaveTextContent('"accountDeleted":true');
        expect(deleteAccount).toHaveBeenCalledWith('my-password');
        expect(mockLogout).toHaveBeenCalled();
    });

    test("shows the API's error and stays signed in when the password is wrong", async () => {
        (deleteAccount as jest.Mock).mockRejectedValue({
            isAxiosError: true,
            response: { status: 403, data: { error: 'Incorrect password' } },
        });
        renderYourData();

        userEvent.click(screen.getByRole('button', { name: 'Delete my account' }));
        userEvent.type(await screen.findByLabelText(/enter your password/i), 'wrong');
        userEvent.click(screen.getByRole('button', { name: 'Delete my account permanently' }));

        expect(await screen.findByText('Incorrect password')).toBeInTheDocument();
        expect(mockLogout).not.toHaveBeenCalled();
    });
});
