import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Header from './Header';
import { Account } from '../../types';

const { auth } = vi.hoisted(() => ({
    auth: { isAuthenticated: false, account: null as Account | null, logout: vi.fn() },
}));
vi.mock('../../auth/AuthContext', () => ({ useAuth: () => auth }));

const ANA: Account = {
    id: 1,
    email: 'ana@example.com',
    email_verified: true,
    traveler: { user_id: 1, first_name: 'Ana', last_name: 'Lima' },
};

// Shows the current path, so tests can see where a link or button went.
function CurrentPath() {
    return <p>Now at {useLocation().pathname}</p>;
}

function renderHeader(path = '/Trips') {
    render(
        <MemoryRouter initialEntries={[path]}>
            <Header />
            <CurrentPath />
        </MemoryRouter>
    );
}

function signIn(account: Account = ANA) {
    auth.isAuthenticated = true;
    auth.account = account;
}

describe('Header', () => {
    beforeEach(() => {
        auth.isAuthenticated = false;
        auth.account = null;
        auth.logout = vi.fn();
    });

    test('offers guests only logging in and registering', () => {
        renderHeader('/');

        const nav = screen.getByRole('navigation', { name: 'Main' });
        expect(screen.getByRole('link', { name: 'Log In' })).toHaveAttribute('href', '/login');
        expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
        expect(nav.querySelectorAll('a')).toHaveLength(2);
        expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Account' })).not.toBeInTheDocument();
    });

    test('shows members every page and marks the current one', () => {
        signIn();
        renderHeader('/Trips');

        for (const name of ['Travelers', 'Trips', 'New Trip', 'Invitations', 'Profile']) {
            expect(screen.getByRole('link', { name })).toBeInTheDocument();
        }
        expect(screen.getByRole('link', { name: 'Trips' })).toHaveAttribute('aria-current', 'page');
        expect(screen.getByRole('link', { name: 'Travelers' })).not.toHaveAttribute('aria-current');
    });

    describe('page menu (small screens)', () => {
        test('opens and closes with its button', async () => {
            signIn();
            renderHeader();

            const toggle = screen.getByRole('button', { name: 'Menu' });
            expect(toggle).toHaveAttribute('aria-expanded', 'false');
            expect(toggle).toHaveAttribute('aria-controls', 'site-nav');

            await userEvent.click(toggle);
            expect(toggle).toHaveAttribute('aria-expanded', 'true');
            expect(toggle).toHaveAccessibleName('Close');

            await userEvent.click(toggle);
            expect(toggle).toHaveAttribute('aria-expanded', 'false');
            expect(toggle).toHaveAccessibleName('Menu');
        });

        test('closes after following a link', async () => {
            signIn();
            renderHeader('/Trips');

            await userEvent.click(screen.getByRole('button', { name: 'Menu' }));
            await userEvent.click(screen.getByRole('link', { name: 'Invitations' }));

            expect(screen.getByText('Now at /invitations')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false');
        });
    });

    describe('account menu', () => {
        test('opens from the avatar with the signed-in name and email', async () => {
            signIn();
            renderHeader();

            const button = screen.getByRole('button', { name: 'Account' });
            expect(button).toHaveAttribute('aria-expanded', 'false');
            expect(screen.queryByRole('menu')).not.toBeInTheDocument();

            await userEvent.click(button);

            const menu = screen.getByRole('menu');
            expect(button).toHaveAttribute('aria-expanded', 'true');
            expect(menu).toHaveTextContent('Ana Lima');
            expect(menu).toHaveTextContent('ana@example.com');
            expect(screen.getByRole('menuitem', { name: 'Your profile' })).toHaveAttribute('href', '/profile');
        });

        test('keeps the account name in the page while closed', () => {
            signIn();
            renderHeader();
            expect(screen.getByTestId('account-name')).toHaveTextContent('Ana Lima');
        });

        test('names an account without a profile by its email, once', async () => {
            signIn({ ...ANA, traveler: null });
            renderHeader();

            await userEvent.click(screen.getByRole('button', { name: 'Account' }));

            expect(screen.getByTestId('account-name')).toHaveTextContent('ana@example.com');
            expect(screen.getAllByText('ana@example.com')).toHaveLength(1);
        });

        test('closes after going to the profile', async () => {
            signIn();
            renderHeader('/Trips');

            await userEvent.click(screen.getByRole('button', { name: 'Account' }));
            await userEvent.click(screen.getByRole('menuitem', { name: 'Your profile' }));

            expect(screen.getByText('Now at /profile')).toBeInTheDocument();
            await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
        });

        test('closes on Escape', async () => {
            signIn();
            renderHeader();

            await userEvent.click(screen.getByRole('button', { name: 'Account' }));
            await userEvent.keyboard('{Escape}');

            await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
            expect(screen.getByRole('button', { name: 'Account' })).toHaveAttribute('aria-expanded', 'false');
        });

        test('logs out and goes to the login page', async () => {
            signIn();
            renderHeader('/Trips');

            await userEvent.click(screen.getByRole('button', { name: 'Account' }));
            await userEvent.click(screen.getByRole('menuitem', { name: 'Log Out' }));

            expect(auth.logout).toHaveBeenCalledTimes(1);
            expect(screen.getByText('Now at /login')).toBeInTheDocument();
        });
    });
});
