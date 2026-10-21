import { TripInput } from '../../types';

// The message when a required field is missing, or null if the trip is complete.
export function tripFormError(trip: TripInput): string | null {
    if (!trip.trip_name || !trip.destination_id || trip.trip_length === '' || Number.isNaN(Number(trip.trip_length))) {
        return 'Please fill in all required fields and ensure trip length is a valid number.';
    }
    return null;
}
