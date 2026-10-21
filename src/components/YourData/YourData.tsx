import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { exportAccountData, deleteAccount } from '../../api/account';
import { errorMessage } from '../../api/errors';
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';

// Saves a Blob as a file through a temporary link.
function saveFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

// Download a copy of your data, or delete your account.
function YourData() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDownload = async () => {
        setDownloadError(null);
        setDownloading(true);
        try {
            const data = await exportAccountData();
            saveFile(data, `why-travel-alone-data-${new Date().toISOString().slice(0, 10)}.json`);
        } catch (err) {
            console.error(err);
            setDownloadError('Unable to download your data. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDelete = async (e: FormEvent) => {
        e.preventDefault();
        setDeleteError(null);
        setDeleting(true);
        try {
            await deleteAccount(password);
            logout('Your account and its data have been deleted.');
            navigate('/login', { replace: true });
        } catch (err) {
            setDeleteError(errorMessage(err, 'Unable to delete your account. Please try again.'));
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setConfirming(false);
        setPassword('');
        setDeleteError(null);
    };

    return (
        <Paper
            component="section"
            variant="outlined"
            aria-labelledby="your-data-title"
            sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-start' }}
        >
            <Typography id="your-data-title" component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                Your data
            </Typography>
            <Typography>Download a copy of everything Why Travel Alone stores about you, as a JSON file.</Typography>
            <Button variant="outlined" onClick={handleDownload} disabled={downloading}>
                {downloading ? 'Preparing download…' : 'Download my data'}
            </Button>
            {downloadError && <Alert severity="error">{downloadError}</Alert>}

            {!confirming ? (
                <Button variant="outlined" color="error" onClick={() => setConfirming(true)}>
                    Delete my account
                </Button>
            ) : (
                <Box
                    component="form"
                    onSubmit={handleDelete}
                    sx={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', gap: 2, p: 2, border: 1, borderColor: 'error.main', borderRadius: 1 }}
                >
                    <Alert severity="warning">
                        This permanently deletes your account, your profile and the trips you own. Travelers on
                        your trips lose access to them. Trips you joined continue without you. This can't be undone.
                    </Alert>
                    <TextField
                        id="delete-password"
                        label="Enter your password to confirm"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        slotProps={{ htmlInput: { required: true } }}
                    />
                    {deleteError && <Alert severity="error">{deleteError}</Alert>}
                    <Stack direction="row" spacing={2}>
                        <Button type="submit" variant="contained" color="error" disabled={deleting}>
                            {deleting ? 'Deleting…' : 'Delete my account permanently'}
                        </Button>
                        <Button onClick={cancelDelete} disabled={deleting}>
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            )}
        </Paper>
    );
}

export default YourData;
