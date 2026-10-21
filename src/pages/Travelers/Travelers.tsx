import { useEffect, useMemo, useState } from "react";
import { Alert, Container, InputAdornment, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TravelerCard from "../../components/TravelerCard/TravelerCard";
import PageHeader from "../../components/PageHeader/PageHeader";
import { getTravelers } from "../../api/travelers";
import { Traveler } from "../../types";
import { matchesSearch } from "./matchesSearch";

function Travelers() {
    const [travelers, setTravelers] = useState<Traveler[]>();
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        getTravelers()
            .then(setTravelers)
            .catch((err) => {
                console.error(err);
                setError("Unable to load travelers. Please try again.");
            });
    }, []);

    const shown = useMemo(
        () => (travelers ?? []).filter((traveler) => matchesSearch(traveler, query)),
        [travelers, query]
    );

    let content;
    if (error) {
        content = <Alert severity="error">{error}</Alert>;
    } else if (travelers === undefined) {
        content = <Typography>Loading…</Typography>;
    } else if (shown.length === 0) {
        content = <Typography color="text.secondary">No travelers match "{query}".</Typography>;
    } else {
        content = <TravelerCard travelers={shown} />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <PageHeader title="Travelers" />
            <TextField
                label="Search travelers"
                placeholder="Name, destination or type of travel"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                fullWidth
                sx={{ mb: 3, maxWidth: 480 }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
            />
            {content}
        </Container>
    );
}

export default Travelers
