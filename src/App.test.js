import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

test('sends a signed-out visitor to the login page and hides member-only links', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByText(/why travel alone/i)).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getAllByRole('link', { name: /register/i }).length).toBeGreaterThan(0);
  for (const memberOnly of ['Travelers', 'Trips', 'Invitations', 'Profile']) {
    expect(screen.queryByRole('link', { name: memberOnly })).not.toBeInTheDocument();
  }
});
