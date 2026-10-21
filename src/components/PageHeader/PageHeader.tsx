import { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import BackButton from '../BackButton/BackButton';

interface PageHeaderProps {
    title: string;
    // Shows a back arrow before the title.
    back?: boolean;
    // Buttons on the right, e.g. "New trip".
    actions?: ReactNode;
}

// A page's h1, with an optional back arrow and actions.
function PageHeader({ title, back = false, actions }: PageHeaderProps) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3, flexWrap: 'wrap', rowGap: 1 }}>
            {back && <BackButton />}
            <Typography component="h1" variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
                {title}
            </Typography>
            {actions}
        </Stack>
    );
}

export default PageHeader;
