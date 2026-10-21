import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

const { mockRegister } = vi.hoisted(() => ({ mockRegister: vi.fn() }));
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => ({ register: mockRegister }) }));

async function fillIn() {
    await userEvent.type(screen.getByLabelText('First name'), 'Ana');
    await userEvent.type(screen.getByLabelText('Last name'), 'Lima');
    await userEvent.type(screen.getByLabelText('Email'), 'ana@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'a-good-password');
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

        await fillIn();
        const terms = screen.getByRole('checkbox', { name: /i agree to the terms/i });
        expect(terms).toBeRequired();
        await userEvent.click(screen.getByRole('button', { name: 'Register' }));
        // The browser refuses to submit with the box unticked.
        expect(terms).toBeInvalid();
        expect(mockRegister).not.toHaveBeenCalled();
    });

    test('sends the acceptance with the registration', async () => {
        await fillIn();
        await userEvent.click(screen.getByRole('checkbox', { name: /i agree to the terms/i }));
        await userEvent.click(screen.getByRole('button', { name: 'Register' }));

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
