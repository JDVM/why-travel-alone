import { Component, ErrorInfo, ReactNode } from 'react';
import { Button, Container, Link, Stack, Typography } from '@mui/material';
import { reportError } from '../../monitoring';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// Catches rendering errors below it, reports them, and shows a recovery
// message instead of a blank page. Uses plain links so it works outside the
// router too.
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('Rendering error', error);
        reportError(error, { componentStack: info.componentStack });
    }

    render() {
        if (!this.state.hasError) {
            return this.props.children;
        }
        return (
            <Container maxWidth="sm" sx={{ py: 6 }} role="alert">
                <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    Something went wrong
                </Typography>
                <Typography sx={{ mb: 3 }}>
                    This page hit an unexpected error. It has been reported. Reloading usually fixes it.
                </Typography>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Button variant="contained" onClick={() => window.location.reload()}>
                        Reload page
                    </Button>
                    <Link href="/">Go to the home page</Link>
                </Stack>
            </Container>
        );
    }
}

export default ErrorBoundary;
