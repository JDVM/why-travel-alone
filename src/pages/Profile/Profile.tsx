import { useEffect, useState, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { getProfile, updateProfile, getTypesOfTravel } from '../../api/profile';
import { getDestinations } from '../../api/destinations';
import { errorMessage } from '../../api/errors';
import { Destination, Profile as ProfileData, TypeOfTravel } from '../../types';
import './Profile.scss';

// users.special_considerations is a VARCHAR(50).
const SPECIAL_CONSIDERATIONS_MAX = 50;

interface FormState {
    first_name: string;
    last_name: string;
    has_kids: boolean;
    type_of_travel_id: string;
    special_considerations: string;
    preferred_destination_ids: number[];
}

function toForm(profile: ProfileData | null): FormState {
    return {
        first_name: profile?.first_name ?? '',
        last_name: profile?.last_name ?? '',
        has_kids: profile?.has_kids ?? false,
        type_of_travel_id: profile?.type_of_travel_id ? String(profile.type_of_travel_id) : '',
        special_considerations: profile?.special_considerations ?? '',
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
        return <p className="profile__status">{error ?? 'Loading your profile…'}</p>;
    }

    const selectedPlaces = destinations
        .filter((destination) => form.preferred_destination_ids.includes(destination.id))
        .map((destination) => destination.place);

    return (
        <form className="profile" onSubmit={handleSubmit}>
            <h1 className="profile__title">Your traveler profile</h1>
            {welcome && (
                <p className="profile__note">
                    Welcome! Add a few details so other travelers know how you like to travel. You can change them any time.
                </p>
            )}

            <label className="profile__label" htmlFor="first_name">
                First name
                <input
                    id="first_name"
                    className="profile__input"
                    value={form.first_name}
                    onChange={(e) => update({ first_name: e.target.value })}
                    maxLength={255}
                    required
                />
            </label>
            <label className="profile__label" htmlFor="last_name">
                Last name
                <input
                    id="last_name"
                    className="profile__input"
                    value={form.last_name}
                    onChange={(e) => update({ last_name: e.target.value })}
                    maxLength={255}
                    required
                />
            </label>
            <label className="profile__label" htmlFor="type_of_travel">
                Travel style
                <select
                    id="type_of_travel"
                    className="profile__input"
                    value={form.type_of_travel_id}
                    onChange={(e) => update({ type_of_travel_id: e.target.value })}
                >
                    <option value="">Not set</option>
                    {types.map((type) => (
                        <option key={type.id} value={type.id}>{type.type_of_travel}</option>
                    ))}
                </select>
            </label>

            <fieldset className="profile__private">
                <legend className="profile__legend">Private details</legend>
                <p className="profile__hint">
                    Only you, and the owners of trips you join, can see these.
                </p>
                <label className="profile__checkbox" htmlFor="has_kids">
                    <input
                        id="has_kids"
                        type="checkbox"
                        checked={form.has_kids}
                        onChange={(e) => update({ has_kids: e.target.checked })}
                    />
                    I travel with kids
                </label>
                <label className="profile__label" htmlFor="special_considerations">
                    Special considerations
                    <input
                        id="special_considerations"
                        className="profile__input"
                        value={form.special_considerations}
                        onChange={(e) => update({ special_considerations: e.target.value })}
                        maxLength={SPECIAL_CONSIDERATIONS_MAX}
                        placeholder="e.g. vegetarian, step-free access"
                    />
                </label>
            </fieldset>

            <label className="profile__label" htmlFor="destinations">
                Preferred destinations
                <select
                    id="destinations"
                    className="profile__input"
                    multiple
                    size={8}
                    value={form.preferred_destination_ids.map(String)}
                    onChange={(e) =>
                        update({
                            preferred_destination_ids: Array.from(e.target.selectedOptions, (option) => Number(option.value)),
                        })
                    }
                >
                    {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>{destination.place}</option>
                    ))}
                </select>
            </label>
            <p className="profile__hint">
                Hold Ctrl (Cmd on a Mac) to choose several.
                {selectedPlaces.length > 0 && ` Selected: ${selectedPlaces.join(', ')}.`}
            </p>

            {error && <p className="profile__error">{error}</p>}
            {saved && <p className="profile__saved">Profile saved.</p>}
            <button className="profile__button" type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Save profile'}
            </button>
        </form>
    );
}

export default Profile;
