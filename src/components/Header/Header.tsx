import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
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

    // Close the menu after following a link.
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = isAuthenticated ? MEMBER_LINKS : GUEST_LINKS;
    const accountName = account?.traveler
        ? `${account.traveler.first_name} ${account.traveler.last_name}`
        : account?.email;

    return (
        <AppBar position="static" elevation={0} sx={{ bgcolor: brand.moonstone, color: brand.textDark }}>
            <Toolbar sx={{ flexWrap: "wrap", gap: 1, py: 1 }}>
                <Link to="/Travelers">
                    <Box component="img" src={logo} alt="Why Travel Alone logo" sx={{ display: "block", width: { xs: 32, md: 48 } }} />
                </Link>
                <Typography component="h1" variant="h6" sx={{ fontWeight: 700 }}>
                    Why Travel Alone
                </Typography>
                {isAuthenticated && (
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="small"
                        aria-expanded={menuOpen}
                        aria-controls="site-nav"
                        onClick={() => setMenuOpen((open) => !open)}
                        sx={{ ml: "auto", display: { md: "none" } }}
                    >
                        {menuOpen ? "Close" : "Menu"}
                    </Button>
                )}
                <Box
                    component="nav"
                    id="site-nav"
                    aria-label="Main"
                    sx={{
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
                    {isAuthenticated && (
                        <>
                            {accountName && (
                                <Typography data-testid="account-name" variant="body2" sx={{ px: 1, fontWeight: 600 }}>
                                    {accountName}
                                </Typography>
                            )}
                            <Button variant="outlined" color="inherit" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
