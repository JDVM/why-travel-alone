import { FormEvent, ReactNode } from 'react';
import { Alert, Autocomplete, Box, Button, Checkbox, FormControlLabel, Paper, Stack, TextField } from '@mui/material';
import { Destination, TripInput } from '../../types';

interface TripFormProps {
    trip: TripInput;
    onChange: (trip: TripInput) => void;
    destinations: Destination[];
    submitLabel: string;
    onSubmit: () => void;
    error: string | null;
    // More buttons next to the submit button, e.g. "Delete Trip".
    extraActions?: ReactNode;
}

// The fields of a trip, shared by the add and edit pages. Checks the required
// fields before calling onSubmit.
function TripForm({ trip, onChange, destinations, submitLabel, onSubmit, error, extraActions }: TripFormProps) {
    const set = (changes: Partial<TripInput>) => onChange({ ...trip, ...changes });

    const destination = destinations.find((place) => String(place.id) === String(trip.destination_id)) ?? null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                    id="name"
                    label="Trip Name"
                    placeholder="Name of trip"
                    value={trip.trip_name}
                    onChange={(e) => set({ trip_name: e.target.value })}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        id="length"
                        label="Trip Length"
                        placeholder="Days"
                        value={trip.trip_length}
                        onChange={(e) => set({ trip_length: e.target.value })}
                        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                        sx={{ flex: 1 }}
                    />
                    {/* Searchable: the list is every country. */}
                    <Autocomplete
                        id="destination"
                        options={destinations}
                        value={destination}
                        onChange={(_, chosen) => set({ destination_id: chosen ? chosen.id : '' })}
                        getOptionLabel={(place) => place.place}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => <TextField {...params} label="Destination" placeholder="Type to search" />}
                        sx={{ flex: 2 }}
                    />
                </Stack>
                <FormControlLabel
                    label="Kid Friendly Trip"
                    control={
                        <Checkbox
                            name="kids"
                            checked={trip.kid_friendly}
                            onChange={(e) => set({ kid_friendly: e.target.checked })}
                        />
                    }
                />
                <TextField
                    id="notes"
                    label="Description/Notes"
                    placeholder="Add travel details"
                    multiline
                    minRows={3}
                    value={trip.notes}
                    onChange={(e) => set({ notes: e.target.value })}
                />
                {error && <Alert severity="error">{error}</Alert>}
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'flex-end' }}>
                    {extraActions}
                    <Button variant="contained" type="submit">{submitLabel}</Button>
                </Stack>
            </Box>
        </Paper>
    );
}

export default TripForm;
