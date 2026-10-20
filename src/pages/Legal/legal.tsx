// The version of the Terms of Service and Privacy Policy. Keep it equal to
// TERMS_VERSION in the API's config.js, which records it when accounts sign up.
export const LEGAL_VERSION = '2026-10-21';

// Shown until a lawyer has reviewed the documents and the placeholders are
// filled in. Remove it then.
export function DraftNotice() {
    return (
        <p className="legal__draft" role="note">
            Draft for legal review. Text in [brackets] still needs to be filled in.
        </p>
    );
}
