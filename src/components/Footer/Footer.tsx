import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Stack, Typography } from '@mui/material';
import { brand } from '../../theme';

function Footer() {
    return (
        <Box
            component="footer"
            sx={{ mt: 4, py: 3, px: 2, borderTop: 1, borderColor: brand.cambridgeBlue, textAlign: 'center' }}
        >
            <Stack component="nav" aria-label="Legal" direction="row" spacing={3} sx={{ justifyContent: 'center', mb: 1 }}>
                <Link component={RouterLink} to="/privacy" variant="body2">Privacy Policy</Link>
                <Link component={RouterLink} to="/terms" variant="body2">Terms of Service</Link>
            </Stack>
            <Typography variant="body2">© {new Date().getFullYear()} Why Travel Alone</Typography>
        </Box>
    );
}

export default Footer;
