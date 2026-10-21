import createCache from '@emotion/cache';

// Material UI adds its styles to the page at runtime. The production
// Content-Security-Policy only allows <style> tags carrying the nonce nginx
// puts into index.html for each response (see nginx/default.conf.template),
// so give Emotion that nonce. In development the placeholder is left as is
// and there's no policy to satisfy.
const NONCE_PLACEHOLDER = '__CSP_NONCE__';

export function cspNonce(doc: Document = document): string | undefined {
    const nonce = doc.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content;
    return nonce && nonce !== NONCE_PLACEHOLDER ? nonce : undefined;
}

export function createStyleCache(nonce = cspNonce()) {
    return createCache({ key: 'mui', nonce, prepend: true });
}
