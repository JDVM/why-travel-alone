import { apiBaseUrl } from './client';

describe('apiBaseUrl', () => {
    test('uses the full API address when one is set', () => {
        expect(apiBaseUrl({ REACT_APP_API_BASE_URL: 'https://api.example.com/' } as NodeJS.ProcessEnv)).toBe(
            'https://api.example.com'
        );
    });

    test('otherwise joins the local development URL and port', () => {
        expect(
            apiBaseUrl({ REACT_APP_API_URL: 'http://localhost', REACT_APP_API_PORT: '8080' } as NodeJS.ProcessEnv)
        ).toBe('http://localhost:8080');
    });
});
