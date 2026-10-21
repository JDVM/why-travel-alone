import { createTheme } from '@mui/material/styles';

// The brand palette from src/styles/partials/_variables.scss, for Material UI.
// Keep the two in step while pages move from Sass to MUI components.
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
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: { root: { borderRadius: 999 } },
        },
    },
});

export default theme;
