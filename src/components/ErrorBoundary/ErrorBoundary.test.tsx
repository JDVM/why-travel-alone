import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';
import { reportError } from '../../monitoring';

jest.mock('../../monitoring', () => ({ reportError: jest.fn() }));

function Broken(): JSX.Element {
    throw new Error('boom');
}

describe('ErrorBoundary', () => {
    beforeEach(() => {
        // React logs caught render errors; keep the test output readable.
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('renders its children when nothing fails', () => {
        render(
            <ErrorBoundary>
                <p>All good</p>
            </ErrorBoundary>
        );
        expect(screen.getByText('All good')).toBeInTheDocument();
    });

    test('shows a recovery message and reports the error when a child crashes', () => {
        render(
            <ErrorBoundary>
                <Broken />
            </ErrorBoundary>
        );
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /home page/i })).toHaveAttribute('href', '/');
        expect(reportError).toHaveBeenCalledWith(
            expect.objectContaining({ message: 'boom' }),
            expect.objectContaining({ componentStack: expect.any(String) })
        );
    });
});
