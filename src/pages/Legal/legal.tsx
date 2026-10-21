import { ReactNode } from 'react';
import { Alert, Container, Paper, Typography } from '@mui/material';
import { brand } from '../../theme';

// The version of the Terms of Service and Privacy Policy. Keep it equal to
// TERMS_VERSION in the API's config.js, which records it when accounts sign up.
export const LEGAL_VERSION = '2026-10-21';

// Shown until a lawyer has reviewed the documents and the placeholders are
// filled in. Remove it then.
export function DraftNotice() {
    return (
        <Alert severity="warning" role="note" sx={{ my: 2 }}>
            Draft for legal review. Text in [brackets] still needs to be filled in.
        </Alert>
    );
}

// A legal document: its title, version, and the text below in readable type.
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Paper
                component="article"
                variant="outlined"
                sx={{
                    p: { xs: 2, sm: 4 },
                    lineHeight: 1.6,
                    '& h2': { typography: 'h6', fontWeight: 700, mt: 3, mb: 1 },
                    '& ul': { pl: 3 },
                    '& li': { mb: 0.75 },
                    '& a': { color: brand.fernGreen },
                }}
            >
                <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Version {LEGAL_VERSION}
                </Typography>
                <DraftNotice />
                {children}
            </Paper>
        </Container>
    );
}
