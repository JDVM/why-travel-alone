import { Link as RouterLink } from "react-router-dom";
import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import GroupIcon from "@mui/icons-material/Group";
import { TripSummary } from "../../types";

// The trips you own or are on, as a grid of cards linking to each trip.
function TripsCard({ trips }: { trips: TripSummary[] }) {
    return (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
            {trips.map((trip) => (
                <Card key={trip.trip_id} variant="outlined">
                    <CardActionArea
                        className="trips-card__container"
                        component={RouterLink}
                        to={`/Trips/${trip.trip_id}`}
                        sx={{ height: "100%", alignItems: "stretch" }}
                    >
                        <CardContent>
                            <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
                                {trip.trip_name}
                            </Typography>
                            <Typography className="trips-card__role" variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                {trip.is_owner ? "You're the owner" : "You're a traveler"}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1, mb: 1.5 }}>
                                {trip.destination && <Chip icon={<PlaceIcon />} label={trip.destination} size="small" />}
                                <Chip
                                    icon={<GroupIcon />}
                                    label={`${trip.num_travelers} ${trip.num_travelers === 1 ? "traveler" : "travelers"}`}
                                    size="small"
                                />
                                <Chip label={trip.kid_friendly ? "Kid friendly" : "Adults only"} size="small" variant="outlined" />
                            </Stack>
                            {trip.notes && (
                                <Typography variant="body2" sx={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {trip.notes}
                                </Typography>
                            )}
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Box>
    );
}

export default TripsCard
