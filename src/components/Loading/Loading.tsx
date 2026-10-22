import { Box, Paper, Skeleton, Stack } from '@mui/material';

// Placeholders in the shape of what's loading, instead of "Loading…" text.
// Screen readers still hear what is loading.

// Hidden on screen, read by screen readers.
const visuallyHidden = {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
} as const;

// A grid of card placeholders, for the trip, traveler and invitation lists.
export function LoadingCards({ label, count = 3, height = 150 }: { label: string; count?: number; height?: number }) {
    return (
        <Box role="status">
            <Box component="span" sx={visuallyHidden}>{label}</Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' } }}>
                {Array.from({ length: count }, (_, i) => (
                    <Skeleton key={i} variant="rounded" height={height} sx={{ borderRadius: '16px' }} />
                ))}
            </Box>
        </Box>
    );
}

// A panel of field placeholders, for detail pages and forms.
export function LoadingPanel({ label, rows = 4 }: { label: string; rows?: number }) {
    return (
        <Paper variant="outlined" role="status" sx={{ p: { xs: 2, sm: 3 } }}>
            <Box component="span" sx={visuallyHidden}>{label}</Box>
            <Stack spacing={2}>
                <Skeleton variant="text" width="40%" sx={{ fontSize: '1.5rem' }} />
                {Array.from({ length: rows }, (_, i) => (
                    <Skeleton key={i} variant="rounded" height={44} />
                ))}
            </Stack>
        </Paper>
    );
}
