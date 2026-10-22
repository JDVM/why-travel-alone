import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import { picForIndex } from "../../data/profilePics";
import { Traveler } from "../../types";

// The traveler directory, as a grid of cards linking to each profile.
function TravelerCard({ travelers }: { travelers: Traveler[] }) {
    return (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
            {travelers.map((t) => {
                const preferredDestinations = t.preferred_destinations ?? [];
                return (
                    <Card component="li" key={t.user_id} variant="outlined">
                        <CardActionArea
                            component={RouterLink}
                            to={`/Travelers/${t.user_id}`}
                            sx={{ height: "100%", alignItems: "stretch" }}
                        >
                            <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                                <Avatar src={picForIndex(t.user_id)} alt="" sx={{ width: 64, height: 64 }} />
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography component="h2" variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                                        {`${t.first_name} ${t.last_name}`}
                                    </Typography>
                                    {t.type_of_travel && (
                                        <Typography variant="body2" color="text.secondary">{t.type_of_travel}</Typography>
                                    )}
                                    {preferredDestinations.length > 0 && (
                                        <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", rowGap: 0.5, mt: 1 }}>
                                            {preferredDestinations.map((destination) => (
                                                <Chip key={destination} label={destination} size="small" />
                                            ))}
                                        </Stack>
                                    )}
                                    {/* Private fields: the API only sends them when you may see them. */}
                                    {"has_kids" in t && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>Kids: {t.has_kids ? "Yes" : "No"}</Typography>
                                    )}
                                    {"special_considerations" in t && (
                                        <Typography variant="body2">
                                            Special Considerations: {t.special_considerations || "None"}
                                        </Typography>
                                    )}
                                </Box>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                );
            })}
        </Box>
    );
}

export default TravelerCard;
