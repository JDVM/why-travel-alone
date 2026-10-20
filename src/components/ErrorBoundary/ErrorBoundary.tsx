import { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '../../monitoring';
import './ErrorBoundary.scss';

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
            <section className="error-boundary" role="alert">
                <h1 className="error-boundary__title">Something went wrong</h1>
                <p className="error-boundary__text">
                    This page hit an unexpected error. It has been reported. Reloading usually fixes it.
                </p>
                <div className="error-boundary__actions">
                    <button type="button" className="error-boundary__button" onClick={() => window.location.reload()}>
                        Reload page
                    </button>
                    <a className="error-boundary__link" href="/">
                        Go to the home page
                    </a>
                </div>
            </section>
        );
    }
}

export default ErrorBoundary;
