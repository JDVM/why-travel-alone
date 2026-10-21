import { cspNonce, createStyleCache } from './styleCache';

function pageWithNonce(content: string): Document {
    const doc = document.implementation.createHTMLDocument();
    doc.head.innerHTML = `<meta name="csp-nonce" content="${content}">`;
    return doc;
}

describe('cspNonce', () => {
    test('reads the nonce nginx put into the page', () => {
        expect(cspNonce(pageWithNonce('abc123'))).toBe('abc123');
    });

    test('ignores the placeholder left in development builds', () => {
        expect(cspNonce(pageWithNonce('__CSP_NONCE__'))).toBeUndefined();
        expect(cspNonce(document.implementation.createHTMLDocument())).toBeUndefined();
    });

    test('Material UI style tags carry the nonce', () => {
        expect(createStyleCache('abc123').nonce).toBe('abc123');
    });
});
