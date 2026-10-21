import { render, screen, within } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

test('sends a signed-out visitor to the login page and hides member-only links', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByRole('heading', { name: /why travel alone/i })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /register/i }).length).toBeGreaterThan(0);
  for (const memberOnly of ['Travelers', 'Trips', 'Invitations', 'Profile']) {
    expect(screen.queryByRole('link', { name: memberOnly })).not.toBeInTheDocument();
  }
});

test('shows the legal pages and footer links to signed-out visitors', async () => {
  window.history.pushState({}, '', '/privacy');
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(await screen.findByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeInTheDocument();
  expect(screen.getByText(/draft for legal review/i)).toBeInTheDocument();
  const legalNav = screen.getByRole('navigation', { name: 'Legal' });
  expect(within(legalNav).getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms');
  window.history.pushState({}, '', '/');
});
