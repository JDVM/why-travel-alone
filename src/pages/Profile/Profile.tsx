import { useEffect, useState, FormEvent, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Container,
    FormControlLabel,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { getProfile, updateProfile, getTypesOfTravel } from '../../api/profile';
import { getDestinations } from '../../api/destinations';
import { errorMessage } from '../../api/errors';
import { Destination, Profile as ProfileData, TypeOfTravel } from '../../types';
import YourData from '../../components/YourData/YourData';
import SignedInDevices from '../../components/SignedInDevices/SignedInDevices';
import PageHeader from '../../components/PageHeader/PageHeader';
import { LoadingPanel } from '../../components/Loading/Loading';

// users.special_considerations is a VARCHAR(50).
const SPECIAL_CONSIDERATIONS_MAX = 50;

interface FormState {
    first_name: string;
    last_name: string;
    has_kids: boolean;
    type_of_travel_id: string;
    special_considerations: string;
    special_considerations_consent: boolean;
    preferred_destination_ids: number[];
}

function toForm(profile: ProfileData | null): FormState {
    return {
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
        has_kids: profile?.has_kids ?? false,
        type_of_travel_id: profile?.type_of_travel_id ? String(profile.type_of_travel_id) : '',
        special_considerations: profile?.special_considerations ?? '',
        special_considerations_consent: profile?.special_considerations_consent ?? false,
        preferred_destination_ids: profile ? profile.preferred_destinations.map((destination) => destination.id) : [],
    };
}

function Profile() {
    const { refreshAccount } = useAuth();
    const location = useLocation();
    const welcome = Boolean((location.state as { welcome?: boolean } | null)?.welcome);

    const [form, setForm] = useState<FormState | null>(null);
    const [types, setTypes] = useState<TypeOfTravel[]>([]);
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        Promise.all([getProfile(), getTypesOfTravel(), getDestinations()])
            .then(([profile, typeList, destinationList]) => {
                setTypes(typeList);
                setDestinations(destinationList);
                setForm(toForm(profile));
            })
            .catch((err) => {
                console.error(err);
                setError('Unable to load your profile. Please try again.');
            });
    }, []);

    const update = (changes: Partial<FormState>) => {
        setSaved(false);
        setForm((current) => (current ? { ...current, ...changes } : current));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!form) {
            return;
        }
        setError(null);
        setSaving(true);
        try {
            const profile = await updateProfile({
                first_name: form.first_name,
                last_name: form.last_name,
                has_kids: form.has_kids,
                type_of_travel_id: form.type_of_travel_id ? Number(form.type_of_travel_id) : null,
                special_considerations: form.special_considerations,
                special_considerations_consent: form.special_considerations_consent,
                preferred_destination_ids: form.preferred_destination_ids,
            });
            setForm(toForm(profile));
            setSaved(true);
            // The header and other pages read the name from the account.
            await refreshAccount();
        } catch (err) {
            setError(errorMessage(err, 'Unable to save your profile. Please try again.'));
        } finally {
            setSaving(false);
        }
    };

    if (!form) {
        return (
            <Container maxWidth="md" sx={{ py: 3 }}>
                <PageHeader title="Your traveler profile" />
                {error ? <Alert severity="error">{error}</Alert> : <LoadingPanel label="Loading your profile" rows={5} />}
            </Container>
        );
    }

    const selectedDestinations = destinations.filter((destination) => form.preferred_destination_ids.includes(destination.id));

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <PageHeader title="Your traveler profile" />
            {welcome && (
                <Alert severity="info" sx={{ mb: 3 }}>
                    Welcome! Add a few details so other travelers know how you like to travel. You can change them any time.
                </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Section title="About you">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            id="first_name"
                            label="First name"
                            value={form.first_name}
                            onChange={(e) => update({ first_name: e.target.value })}
                            fullWidth
                            slotProps={{ htmlInput: { required: true, maxLength: 255 } }}
                        />
                        <TextField
                            id="last_name"
                            label="Last name"
                            value={form.last_name}
                            onChange={(e) => update({ last_name: e.target.value })}
                            fullWidth
                            slotProps={{ htmlInput: { required: true, maxLength: 255 } }}
                        />
                    </Stack>
                    <TextField
                        id="type_of_travel"
                        select
                        label="Travel style"
                        value={form.type_of_travel_id}
                        onChange={(e) => update({ type_of_travel_id: e.target.value })}
                        slotProps={{ select: { native: true }, inputLabel: { shrink: true } }}
                    >
                        <option value="">Not set</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>{type.type_of_travel}</option>
                        ))}
                    </TextField>
                    <Autocomplete
                        multiple
                        id="destinations"
                        options={destinations}
                        value={selectedDestinations}
                        onChange={(_, chosen) => update({ preferred_destination_ids: chosen.map((destination) => destination.id) })}
                        getOptionLabel={(destination) => destination.place}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        filterSelectedOptions
                        renderInput={(params) => (
                            <TextField {...params} label="Preferred destinations" placeholder="Type to search" />
                        )}
                    />
                </Section>

                <Section
                    title="Private details"
                    hint="Only you, and the owners of trips you join, can see these."
                >
                    <FormControlLabel
                        label="I travel with kids"
                        control={
                            <Checkbox
                                id="has_kids"
                                checked={form.has_kids}
                                onChange={(e) => update({ has_kids: e.target.checked })}
                            />
                        }
                    />
                    <TextField
                        id="special_considerations"
                        label="Special considerations"
                        value={form.special_considerations}
                        onChange={(e) => update({ special_considerations: e.target.value })}
                        placeholder="e.g. vegetarian, step-free access"
                        helperText={`${form.special_considerations.length}/${SPECIAL_CONSIDERATIONS_MAX}`}
                        slotProps={{ htmlInput: { maxLength: SPECIAL_CONSIDERATIONS_MAX } }}
                    />
                    <FormControlLabel
                        sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0 } }}
                        label={
                            <Typography variant="body2">
                                I agree to Why Travel Alone storing my special considerations, which may include health
                                information, and showing them only to me and the owners of trips I join. To withdraw, clear
                                the field and save.
                            </Typography>
                        }
                        control={
                            <Checkbox
                                id="special_considerations_consent"
                                checked={form.special_considerations_consent}
                                onChange={(e) => update({ special_considerations_consent: e.target.checked })}
                                slotProps={{ input: { required: form.special_considerations.trim() !== '' } }}
                            />
                        }
                    />
                </Section>

                {error && <Alert severity="error">{error}</Alert>}
                {saved && <Alert severity="success">Profile saved.</Alert>}
                <Box>
                    <Button variant="contained" size="large" type="submit" disabled={saving}>
                        {saving ? 'Saving…' : 'Save profile'}
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                <SignedInDevices />
                <YourData />
            </Box>
        </Container>
    );
}

// A titled card grouping related fields.
function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
                <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
                {hint && <Typography variant="body2" color="text.secondary">{hint}</Typography>}
            </Box>
            {children}
        </Paper>
    );
}

export default Profile;
