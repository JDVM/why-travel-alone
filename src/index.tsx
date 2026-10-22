import React from 'react';
import ReactDOM from 'react-dom/client';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import '@fontsource-variable/nunito';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { initMonitoring } from './monitoring';
import theme from './theme';
import { createStyleCache } from './styleCache';

initMonitoring();

const container = document.getElementById('root');
if (!container) {
  throw new Error('index.html has no #root element');
}

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <CacheProvider value={createStyleCache()}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
