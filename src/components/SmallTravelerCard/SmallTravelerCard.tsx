import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Button, Card, CardActionArea, CardActions, CardContent, Typography } from "@mui/material";
import { picForIndex } from "../../data/profilePics";
import { Traveler } from "../../types";

interface SmallTravelerCardProps {
    travelers: Traveler[];
    removableIds?: number[];
    onRemove?: (traveler: Traveler) => void;
}

// The travelers on a trip. Only the trip's owner gets Remove buttons, and
// never for themselves (removableIds excludes them).
function SmallTravelerCard({ travelers, removableIds = [], onRemove }: SmallTravelerCardProps) {
    return (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" } }}>
            {travelers.map((t) => (
                <Card key={t.user_id} variant="outlined" className="small-traveler-card__container" sx={{ display: "flex", flexDirection: "column" }}>
                    <CardActionArea component={RouterLink} to={`/Travelers/${t.user_id}`} sx={{ flexGrow: 1 }}>
                        <CardContent sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                            <Avatar src={picForIndex(t.user_id)} alt="" sx={{ width: 56, height: 56 }} />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700 }}>{`${t.first_name} ${t.last_name}`}</Typography>
                                {t.type_of_travel && (
                                    <Typography variant="body2" color="text.secondary">{t.type_of_travel}</Typography>
                                )}
                                {/* Private fields: the API only sends them when you may see them. */}
                                {"has_kids" in t && (
                                    <Typography variant="body2">Kids: {t.has_kids ? "Yes" : "No"}</Typography>
                                )}
                                {"special_considerations" in t && (
                                    <Typography variant="body2">
                                        Special Considerations: {t.special_considerations || "None"}
                                    </Typography>
                                )}
                            </Box>
                        </CardContent>
                    </CardActionArea>
                    {removableIds.includes(t.user_id) && onRemove && (
                        <CardActions sx={{ justifyContent: "flex-end" }}>
                            <Button className="small-traveler-card__button" color="error" size="small" onClick={() => onRemove(t)}>
                                Remove
                            </Button>
                        </CardActions>
                    )}
                </Card>
            ))}
        </Box>
    );
}

export default SmallTravelerCard;
