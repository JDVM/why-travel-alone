// Shared domain types matching the why-travel-alone-api contract (main).
//
// The API returns MySQL tinyint booleans as 0/1; the service layer in
// src/api normalizes those to real booleans, so everything above the API
// boundary works with the clean types below.

export interface Account {
    id: number;
    email: string;
    auth_provider?: string;
    created_at?: string;
}

// Response body of POST /auth/login and POST /auth/register.
export interface AuthResponse {
    token: string;
    account: Account;
}

// A person who can be added to trips. GET /travelers includes
// preferred_destinations; the users[] embedded in a trip detail does not.
export interface Traveler {
    user_id: number;
    first_name: string;
    last_name: string;
    has_kids: boolean;
    special_considerations: string | null;
    type_of_travel: string | null;
    preferred_destinations?: string[];
}

// A row from GET /trips (the caller's own trips).
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
}

// GET /trips/:id — a single owned trip plus the travelers on it.
export interface TripDetail {
    trip_id: number;
    trip_name: string;
    kid_friendly: boolean;
    trip_length: number;
    notes: string | null;
    destination_id?: number;
    destination: string | null;
    users: Traveler[];
}

// Request body for POST /trips/new and PUT /trips/:id.
export interface TripInput {
    trip_name: string;
    kid_friendly: boolean;
    trip_length: number | string;
    destination_id: number | string;
    notes: string;
}

export interface Destination {
    id: number;
    place: string;
}
