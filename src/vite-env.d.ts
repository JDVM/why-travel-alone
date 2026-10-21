/// <reference types="vite/client" />

// Build-time settings (see .env.example). Values are strings, or undefined
// when not set.
interface ImportMetaEnv {
    readonly REACT_APP_API_BASE_URL?: string;
    readonly REACT_APP_API_URL?: string;
    readonly REACT_APP_API_PORT?: string;
    readonly REACT_APP_SENTRY_DSN?: string;
    readonly REACT_APP_SENTRY_ENVIRONMENT?: string;
    readonly REACT_APP_SENTRY_RELEASE?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
