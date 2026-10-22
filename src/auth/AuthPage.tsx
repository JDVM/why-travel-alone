import { FormEvent, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Container, Link, Paper, Typography } from '@mui/material';

// The card the sign-in, registration and emailed-link pages sit in.
export function AuthPage({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Container maxWidth="xs" sx={{ my: { xs: 3, sm: 6 } }}>
            <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                    {title}
                </Typography>
                {children}
            </Paper>
        </Container>
    );
}

// The form's fields and button, evenly spaced.
export function AuthForm({ onSubmit, children }: { onSubmit: (e: FormEvent<HTMLFormElement>) => void; children: ReactNode }) {
    return (
        <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {children}
        </Box>
    );
}

export function AuthError({ children }: { children: ReactNode }) {
    return (
        <Alert severity="error">
            {children}
        </Alert>
    );
}

export function AuthNotice({ children }: { children: ReactNode }) {
    return (
        <Alert severity="success" role="status" sx={{ mb: 2 }}>
            {children}
        </Alert>
    );
}

// A line under the form, e.g. "Need an account? Register".
export function AuthSwitch({ children }: { children: ReactNode }) {
    return (
        <Typography variant="body2" sx={{ mt: 2 }}>
            {children}
        </Typography>
    );
}

// A react-router link styled like the rest of the app's links.
export function AuthLink({ to, children }: { to: string; children: ReactNode }) {
    return (
        <Link component={RouterLink} to={to}>
            {children}
        </Link>
    );
}
