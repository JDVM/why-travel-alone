import { render, screen } from '@testing-library/react';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

jest.mock('./api/travelers', () => ({
  getTravelers: () => Promise.resolve([]),
}));

test('renders the app header with login links when signed out', async () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  expect(screen.getByText(/why travel alone/i)).toBeInTheDocument();
  expect(await screen.findByText(/log in/i)).toBeInTheDocument();
});
