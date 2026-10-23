import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TripForm from './TripForm';
import { tripFormError } from './tripFormError';
import { TripInput } from '../../types';

const DESTINATIONS = [
    { id: 1, place: 'Portugal' },
    { id: 2, place: 'Japan' },
    { id: 3, place: 'Peru' },
];

const EMPTY_TRIP: TripInput = { trip_name: '', kid_friendly: false, trip_length: '', destination_id: '', notes: '' };

const trip = (overrides: Partial<TripInput> = {}): TripInput => ({
    trip_name: 'Lisbon in spring',
    kid_friendly: false,
    trip_length: '5',
    destination_id: 1,
    notes: '',
    ...overrides,
});

// TripForm is controlled, so the tests hold the trip in state the way the add
// and edit pages do, and record what would be submitted.
function Harness({ initial, onSubmit, error = null }: { initial: TripInput; onSubmit: (trip: TripInput) => void; error?: string | null }) {
    const [value, setValue] = useState(initial);
    return (
        <TripForm
            trip={value}
            onChange={setValue}
            destinations={DESTINATIONS}
            submitLabel="Save Trip"
            onSubmit={() => onSubmit(value)}
            error={error}
            extraActions={<button type="button">Delete Trip</button>}
        />
    );
}

describe('TripForm', () => {
    test('shows the trip being edited', () => {
        render(<Harness initial={trip({ kid_friendly: true, notes: 'Pack light' })} onSubmit={vi.fn()} />);

        expect(screen.getByLabelText('Trip Name')).toHaveValue('Lisbon in spring');
        expect(screen.getByLabelText('Trip Length')).toHaveValue('5');
        expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveValue('Portugal');
        expect(screen.getByRole('checkbox', { name: 'Kid Friendly Trip' })).toBeChecked();
        expect(screen.getByLabelText('Description/Notes')).toHaveValue('Pack light');
    });

    test('finds the destination when its id arrives as a string', () => {
        render(<Harness initial={trip({ destination_id: '2' })} onSubmit={vi.fn()} />);
        expect(screen.getByRole('combobox', { name: 'Destination' })).toHaveValue('Japan');
    });

    test('submits everything that was filled in', async () => {
        const onSubmit = vi.fn();
        render(<Harness initial={EMPTY_TRIP} onSubmit={onSubmit} />);

        await userEvent.type(screen.getByLabelText('Trip Name'), 'Machu Picchu');
        await userEvent.type(screen.getByLabelText('Trip Length'), '10');
        await userEvent.type(screen.getByRole('combobox', { name: 'Destination' }), 'Pe');
        await userEvent.click(screen.getByRole('option', { name: 'Peru' }));
        await userEvent.click(screen.getByRole('checkbox', { name: 'Kid Friendly Trip' }));
        await userEvent.type(screen.getByLabelText('Description/Notes'), 'Train from Cusco');
        await userEvent.click(screen.getByRole('button', { name: 'Save Trip' }));

        expect(onSubmit).toHaveBeenCalledWith({
            trip_name: 'Machu Picchu',
            kid_friendly: true,
            trip_length: '10',
            destination_id: 3,
            notes: 'Train from Cusco',
        });
    });

    test('narrows the destinations to what was typed', async () => {
        render(<Harness initial={EMPTY_TRIP} onSubmit={vi.fn()} />);

        await userEvent.type(screen.getByRole('combobox', { name: 'Destination' }), 'pe');

        expect(screen.getByRole('option', { name: 'Peru' })).toBeInTheDocument();
        expect(screen.queryByRole('option', { name: 'Japan' })).not.toBeInTheDocument();
    });

    test('clearing the destination leaves it empty', async () => {
        const onSubmit = vi.fn();
        render(<Harness initial={trip()} onSubmit={onSubmit} />);

        await userEvent.clear(screen.getByRole('combobox', { name: 'Destination' }));
        await userEvent.click(screen.getByRole('button', { name: 'Save Trip' }));

        expect(onSubmit).toHaveBeenCalledWith(trip({ destination_id: '' }));
    });

    test('shows the error and the extra actions', () => {
        render(<Harness initial={trip()} onSubmit={vi.fn()} error="Something went wrong" />);

        expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
        expect(screen.getByRole('button', { name: 'Delete Trip' })).toBeInTheDocument();
    });

    test('shows no alert without an error', () => {
        render(<Harness initial={trip()} onSubmit={vi.fn()} />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});

describe('tripFormError', () => {
    const MESSAGE = 'Please fill in all required fields and ensure trip length is a valid number.';

    test('accepts a complete trip, with the length as a number or a numeric string', () => {
        expect(tripFormError(trip())).toBeNull();
        expect(tripFormError(trip({ trip_length: 7 }))).toBeNull();
    });

    test('asks for each missing required field', () => {
        expect(tripFormError(trip({ trip_name: '' }))).toBe(MESSAGE);
        expect(tripFormError(trip({ destination_id: '' }))).toBe(MESSAGE);
        expect(tripFormError(trip({ trip_length: '' }))).toBe(MESSAGE);
    });

    test('refuses a length that is not a number', () => {
        expect(tripFormError(trip({ trip_length: 'a week' }))).toBe(MESSAGE);
    });
});
