// Shared domain types matching the why-travel-alone-api contract (main).
//
// The API returns MySQL tinyint booleans as 0/1; the service layer in
// src/api normalizes those to real booleans, so everything above the API
// boundary works with the clean types below.

// The traveler profile an account belongs to.
export interface TravelerSummary {
    user_id: number;
    first_name: string;
    last_name: string;
}

export interface Account {
    id: number;
    email: string;
    auth_provider?: string;
    created_at?: string;
    // null only for older accounts created before every account had a profile.
    traveler: TravelerSummary | null;
}

// Response body of POST /auth/login and POST /auth/register.
export interface AuthResponse {
    token: string;
    account: Account;
}

// A traveler as the API shows them to the current user. has_kids and
// special_considerations are private: present only for your own profile and
// for travelers on trips you own.
export interface Traveler {
    user_id: number;
    first_name: string;
    last_name: string;
    has_kids?: boolean;
    special_considerations?: string | null;
    type_of_travel: string | null;
    preferred_destinations?: string[];
}

// A row from GET /trips: trips you own or are on.
// destination_id is optional until every deployed API returns it.
export interface TripSummary {
    trip_id: number;
    trip_name: string;
    kid_friendly: boolean;
    trip_length: number;
    notes: string | null;
    destination_id?: number;
    destination: string | null;
    num_travelers: number;
    is_owner: boolean;
}

// An invitation as the trip's owner sees it.
export interface TripInvitation {
    user_id: number;
    first_name: string;
    last_name: string;
    status: 'pending' | 'declined';
}

// GET /trips/:id — a trip you own or are on, plus its travelers.
export interface TripDetail {
    trip_id: number;
    trip_name: string;
    kid_friendly: boolean;
    trip_length: number;
    notes: string | null;
    destination_id?: number;
    destination: string | null;
    is_owner: boolean;
    users: Traveler[];
    // Only for the owner.
    invitations?: TripInvitation[];
}

// Request body for POST /trips/new and PUT /trips/:id.
export interface TripInput {
    trip_name: string;
    kid_friendly: boolean;
    trip_length: number | string;
    destination_id: number | string;
    notes: string;
}

// An invitation you've received (GET /invitations).
export interface ReceivedInvitation {
    invitation_id: number;
    trip_id: number;
    trip_name: string;
    trip_length: number;
    kid_friendly: boolean;
    destination: string | null;
    owner_first_name: string | null;
    owner_last_name: string | null;
    created_at: string;
}

export interface Destination {
    id: number;
    place: string;
}

export interface TypeOfTravel {
    id: number;
    type_of_travel: string;
}

// Your own full profile (GET/PUT /profile).
export interface Profile {
    user_id: number;
    first_name: string;
    last_name: string;
    has_kids: boolean;
    special_considerations: string | null;
    // Whether the traveler agreed to us storing special considerations.
    special_considerations_consent: boolean;
    type_of_travel_id: number | null;
    type_of_travel: string | null;
    preferred_destinations: Destination[];
}

export interface ProfileInput {
    first_name: string;
    last_name: string;
    has_kids: boolean;
    type_of_travel_id: number | null;
    special_considerations: string;
    // Required (true) whenever special_considerations isn't empty.
    special_considerations_consent: boolean;
    preferred_destination_ids: number[];
}
