import { Link as RouterLink } from 'react-router-dom';
import { Avatar, AvatarGroup, Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import GroupsIcon from '@mui/icons-material/Groups';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { brand } from '../../theme';
import { picForIndex } from '../../data/profilePics';

const STEPS = [
    {
        icon: <MapIcon fontSize="large" />,
        title: 'Plan a trip',
        text: 'Pick a destination, how long you’re going for, and whether it’s kid friendly.',
    },
    {
        icon: <GroupsIcon fontSize="large" />,
        title: 'Find your travelers',
        text: 'Browse people who love the same places and travel the way you do, then invite them along.',
    },
    {
        icon: <FlightTakeoffIcon fontSize="large" />,
        title: 'Go together',
        text: 'Everyone on the trip sees the plan and who’s coming. No more solo trips by default.',
    },
];

// What signed-out visitors see at the site's address: the pitch, how it
// works, and the way in.
function Landing() {
    return (
        <>
            <Box
                component="section"
                aria-labelledby="landing-title"
                sx={{
                    color: '#fff',
                    background: `linear-gradient(135deg, ${brand.deepTeal} 0%, ${brand.fernGreen} 100%)`,
                    py: { xs: 6, md: 10 },
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <Typography id="landing-title" component="h1" variant="h3" sx={{ fontSize: { xs: '2.1rem', md: '3rem' }, mb: 2 }}>
                        Find your people. Plan the trip together.
                    </Typography>
                    <Typography sx={{ fontSize: { xs: '1.05rem', md: '1.25rem' }, maxWidth: 620, mx: 'auto', mb: 4, opacity: 0.95 }}>
                        Why Travel Alone connects you with travelers who share your style and favourite destinations, so
                        your next trip comes with company.
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center', mb: 4 }}>
                        <Button
                            component={RouterLink}
                            to="/register"
                            size="large"
                            variant="contained"
                            sx={{ bgcolor: '#fff', color: brand.deepTeal, px: 4, '&:hover': { bgcolor: brand.sand } }}
                        >
                            Sign up free
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            size="large"
                            variant="outlined"
                            sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.8)', px: 4, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Log in
                        </Button>
                    </Stack>
                    <Stack direction="row" spacing={1.5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                        <AvatarGroup max={5} sx={{ '& .MuiAvatar-root': { borderColor: brand.deepTeal } }}>
                            {[3, 7, 11, 15, 19].map((n) => (
                                <Avatar key={n} src={picForIndex(n)} alt="" />
                            ))}
                        </AvatarGroup>
                        <Typography variant="body2" sx={{ opacity: 0.95 }}>Travelers are planning trips right now</Typography>
                    </Stack>
                </Container>
            </Box>

            <Container component="section" aria-labelledby="how-it-works" maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
                <Typography id="how-it-works" component="h2" variant="h4" sx={{ textAlign: 'center', mb: { xs: 3, md: 5 } }}>
                    How it works
                </Typography>
                <Box component="ol" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
                    {STEPS.map((step, index) => (
                        <Card component="li" key={step.title} variant="outlined">
                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ color: brand.deepTeal, mb: 1 }} aria-hidden="true">{step.icon}</Box>
                                <Typography component="h3" variant="h6">
                                    {index + 1}. {step.title}
                                </Typography>
                                <Typography color="text.secondary" sx={{ mt: 1 }}>{step.text}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
                <Box sx={{ textAlign: 'center', mt: { xs: 4, md: 6 } }}>
                    <Button component={RouterLink} to="/register" variant="contained" color="secondary" size="large" sx={{ px: 4 }}>
                        Start planning
                    </Button>
                </Box>
            </Container>
        </>
    );
}

export default Landing;
