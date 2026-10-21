import { Traveler } from "../../types";

// Whether a traveler matches the search box: their name, type of travel or a
// preferred destination contains every word typed.
export function matchesSearch(traveler: Traveler, query: string): boolean {
    const haystack = [
        traveler.first_name,
        traveler.last_name,
        traveler.type_of_travel ?? "",
        ...(traveler.preferred_destinations ?? []),
    ].join(" ").toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every((word) => haystack.includes(word));
}
