import { createTheme } from '@mui/material/styles';

// The brand palette. Bronze and redwood are a shade darker than the original
// palette so white text on them, and redwood text on the page, meet the WCAG
// AA contrast minimum (4.5:1). textDark is for text on the lighter brand
// colours (moonstone, cambridge blue), where white would be too faint.
// deepTeal is the darkest moonstone that still carries white text (the
// landing page hero); sand is the warm page background.
export const brand = {
    moonstone: '#72BCC6',
    deepTeal: '#2E6B73',
    bronze: '#9a6528',
    cambridgeBlue: '#7AA57D',
    redwood: '#9d6159',
    fernGreen: '#496F44',
    sand: '#FAF6F0',
    sandBorder: '#E9E1D6',
    backgroundGray: '#F7F8F9',
    textDark: '#1f1f1f',
    danger: '#a33a2f',
};

const reducedMotion = '@media (prefers-reduced-motion: reduce)';

const theme = createTheme({
    palette: {
        primary: { main: brand.fernGreen, contrastText: '#fff' },
        secondary: { main: brand.bronze, contrastText: '#fff' },
        error: { main: brand.danger },
        background: { default: brand.sand, paper: '#fff' },
        text: { primary: brand.textDark },
        divider: brand.sandBorder,
    },
    shape: { borderRadius: 12 },
    typography: {
        // Nunito is bundled with the app (src/index.tsx); the rest are fallbacks
        // while it loads.
        fontFamily: [
            '"Nunito Variable"',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'sans-serif',
        ].join(','),
        h1: { fontWeight: 800 },
        h2: { fontWeight: 800 },
        h3: { fontWeight: 800 },
        h4: { fontWeight: 800 },
        h5: { fontWeight: 800 },
        h6: { fontWeight: 700 },
        button: { textTransform: 'none', fontWeight: 700 },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                // A clear outline on whatever has keyboard focus, everywhere.
                ':focus-visible': { outline: `2px solid ${brand.fernGreen}`, outlineOffset: 2 },
            },
        },
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 999 } },
        },
        // Outlined cards and panels: a soft warm border and rounder corners.
        MuiPaper: {
            styleOverrides: {
                outlined: { borderColor: brand.sandBorder, borderRadius: 16 },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    transition: 'box-shadow 150ms ease, transform 150ms ease',
                    // Cards that link somewhere lift a little on hover.
                    '&:has(.MuiCardActionArea-root):hover': {
                        boxShadow: '0 6px 20px rgba(46, 107, 115, 0.15)',
                        transform: 'translateY(-2px)',
                    },
                    [reducedMotion]: { transition: 'none', '&:has(.MuiCardActionArea-root):hover': { transform: 'none' } },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                // Soft moonstone chips; dark text keeps them readable.
                filled: { backgroundColor: 'rgba(114, 188, 198, 0.2)', color: brand.textDark },
            },
        },
    },
});

export default theme;
