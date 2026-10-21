// Adds jest-dom's matchers (toBeInTheDocument, toHaveTextContent…) to expect.
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
});
