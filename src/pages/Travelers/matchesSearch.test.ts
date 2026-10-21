import { matchesSearch } from "./matchesSearch";
import { Traveler } from "../../types";

const ana: Traveler = {
    user_id: 1,
    first_name: "Ana",
    last_name: "Lima",
    type_of_travel: "Backpacking",
    preferred_destinations: ["Portugal", "Peru"],
};

describe("matchesSearch", () => {
    test("an empty search matches everyone", () => {
        expect(matchesSearch(ana, "")).toBe(true);
        expect(matchesSearch(ana, "   ")).toBe(true);
    });

    test("matches names, type of travel and destinations, ignoring case", () => {
        expect(matchesSearch(ana, "ana")).toBe(true);
        expect(matchesSearch(ana, "LIMA")).toBe(true);
        expect(matchesSearch(ana, "backpack")).toBe(true);
        expect(matchesSearch(ana, "peru")).toBe(true);
    });

    test("every word must match", () => {
        expect(matchesSearch(ana, "ana peru")).toBe(true);
        expect(matchesSearch(ana, "ana japan")).toBe(false);
    });

    test("copes with travelers missing optional fields", () => {
        expect(matchesSearch({ user_id: 2, first_name: "Bo", last_name: "Ng", type_of_travel: null }, "bo")).toBe(true);
    });
});
