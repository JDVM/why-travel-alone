import { createTheme } from '@mui/material/styles';

// The brand palette. Bronze and redwood are a shade darker than the original
// palette so white text on them, and redwood text on the page, meet the WCAG
// AA contrast minimum (4.5:1). textDark is for text on the lighter brand
// colours (moonstone, cambridge blue), where white would be too faint.
export const brand = {
    moonstone: '#72BCC6',
    bronze: '#9a6528',
    cambridgeBlue: '#7AA57D',
    redwood: '#9d6159',
    fernGreen: '#496F44',
    backgroundGray: '#F7F8F9',
    textDark: '#1f1f1f',
    danger: '#a33a2f',
};

const theme = createTheme({
    palette: {
        primary: { main: brand.fernGreen, contrastText: '#fff' },
        secondary: { main: brand.bronze, contrastText: '#fff' },
        error: { main: brand.danger },
        background: { default: brand.backgroundGray },
        text: { primary: brand.textDark },
    },
    shape: { borderRadius: 8 },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            '"Fira Sans"',
            '"Droid Sans"',
            '"Helvetica Neue"',
            'sans-serif',
        ].join(','),
        button: { textTransform: 'none', fontWeight: 600 },
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
    },
});

export default theme;
