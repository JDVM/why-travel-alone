import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

const mockRegister = jest.fn();
jest.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ register: mockRegister }) }));

function fillIn() {
    userEvent.type(screen.getByLabelText('First name'), 'Ana');
    userEvent.type(screen.getByLabelText('Last name'), 'Lima');
    userEvent.type(screen.getByLabelText('Email'), 'ana@example.com');
    userEvent.type(screen.getByLabelText('Password'), 'a-good-password');
}

describe('Register', () => {
    beforeEach(() => {
        mockRegister.mockReset().mockResolvedValue(undefined);
        render(
            <MemoryRouter>
                <Register />
            </MemoryRouter>
        );
    });

    test('links to the terms and privacy policy, and requires accepting them', async () => {
        expect(screen.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
        expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy');

        fillIn();
        const terms = screen.getByRole('checkbox', { name: /i agree to the terms/i });
        expect(terms).toBeRequired();
        userEvent.click(screen.getByRole('button', { name: 'Register' }));
        expect(await screen.findByText(/please accept the terms/i)).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('sends the acceptance with the registration', async () => {
        fillIn();
        userEvent.click(screen.getByRole('checkbox', { name: /i agree to the terms/i }));
        userEvent.click(screen.getByRole('button', { name: 'Register' }));

        await waitFor(() =>
            expect(mockRegister).toHaveBeenCalledWith({
                email: 'ana@example.com',
                password: 'a-good-password',
                first_name: 'Ana',
                last_name: 'Lima',
                accept_terms: true,
            })
        );
    });
});
