import { useEffect, useState, MouseEvent } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Button, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import logo from "../../assets/Logo/plain-logo.svg";
import { useAuth } from "../../auth/AuthContext";
import { brand } from "../../theme";

const MEMBER_LINKS = [
    { to: "/Travelers", label: "Travelers" },
    { to: "/Trips", label: "Trips" },
    { to: "/new", label: "New Trip" },
    { to: "/invitations", label: "Invitations" },
    { to: "/profile", label: "Profile" },
];

const GUEST_LINKS = [
    { to: "/login", label: "Log In" },
    { to: "/register", label: "Register" },
];

// NavLink marks the current page with the "active" class.
const navButtonSx = {
    color: "inherit",
    justifyContent: { xs: "flex-start", md: "center" },
    "&.active": { bgcolor: brand.fernGreen, color: "#fff" },
} as const;

function Header() {
    const { isAuthenticated, account, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Below the md breakpoint the signed-in links fold into a menu, opened
    // with a button.
    const [menuOpen, setMenuOpen] = useState(false);
    // The account menu (name, profile, log out) hangs off the avatar.
    const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);

    // Close the menus after following a link.
    useEffect(() => {
        setMenuOpen(false);
        setAccountAnchor(null);
    }, [location.pathname]);

    const handleLogout = () => {
        setAccountAnchor(null);
        logout();
        navigate("/login");
    };

    const links = isAuthenticated ? MEMBER_LINKS : GUEST_LINKS;
    const accountName = account?.traveler
        ? `${account.traveler.first_name} ${account.traveler.last_name}`
        : account?.email ?? "";

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: brand.moonstone, color: brand.textDark }}>
            <Toolbar sx={{ flexWrap: "wrap", gap: 1, py: 1 }}>
                <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", gap: 1, color: "inherit", textDecoration: "none" }}>
                    <Box component="img" src={logo} alt="" sx={{ display: "block", width: { xs: 32, md: 44 } }} />
                    <Typography component="h1" variant="h6" sx={{ fontWeight: 800 }}>
                        Why Travel Alone
                    </Typography>
                </Box>
                <Box
                    component="nav"
                    id="site-nav"
                    aria-label="Main"
                    sx={{
                        order: { xs: 3, md: 0 },
                        display: { xs: isAuthenticated && !menuOpen ? "none" : "flex", md: "flex" },
                        flexDirection: { xs: isAuthenticated ? "column" : "row", md: "row" },
                        alignItems: { xs: "stretch", md: "center" },
                        gap: 0.5,
                        width: { xs: isAuthenticated ? "100%" : "auto", md: "auto" },
                        ml: { xs: isAuthenticated ? 0 : "auto", md: "auto" },
                    }}
                >
                    {links.map(({ to, label }) => (
                        <Button key={to} component={NavLink} to={to} sx={navButtonSx}>
                            {label}
                        </Button>
                    ))}
                </Box>
                {isAuthenticated && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: { xs: "auto", md: 1 } }}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            size="small"
                            aria-expanded={menuOpen}
                            aria-controls="site-nav"
                            onClick={() => setMenuOpen((open) => !open)}
                            sx={{ display: { md: "none" } }}
                        >
                            {menuOpen ? "Close" : "Menu"}
                        </Button>
                        <IconButton
                            aria-label="Account"
                            aria-haspopup="true"
                            aria-controls="account-menu"
                            aria-expanded={Boolean(accountAnchor)}
                            onClick={(e: MouseEvent<HTMLElement>) => setAccountAnchor(e.currentTarget)}
                            sx={{ p: 0.5 }}
                        >
                            <Avatar sx={{ bgcolor: brand.bronze, color: "#fff", width: 36, height: 36 }}>
                                <PersonIcon />
                            </Avatar>
                        </IconButton>
                        <Menu
                            id="account-menu"
                            anchorEl={accountAnchor}
                            open={Boolean(accountAnchor)}
                            onClose={() => setAccountAnchor(null)}
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            transformOrigin={{ vertical: "top", horizontal: "right" }}
                            // Kept in the page so the signed-in name can always be read.
                            keepMounted
                        >
                            <Box sx={{ px: 2, py: 1 }}>
                                <Typography data-testid="account-name" sx={{ fontWeight: 700 }}>
                                    {accountName}
                                </Typography>
                                {account?.traveler && (
                                    <Typography variant="body2" color="text.secondary">{account.email}</Typography>
                                )}
                            </Box>
                            <Divider />
                            <MenuItem component={Link} to="/profile">
                                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                                Your profile
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                                Log Out
                            </MenuItem>
                        </Menu>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;
