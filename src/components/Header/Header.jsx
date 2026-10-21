import { useEffect, useState } from "react";
import "./Header.scss";
import logo from "../../assets/Logo/plain-logo.svg"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

// NavLink's className accepts a function of the active state; the previous code
// interpolated that function into a template string, so the active class was
// never applied. This returns the class string directly.
const navClass = ({ isActive }) => (isActive ? "header__links active" : "header__links");

function Header() {
    const { isAuthenticated, account, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // On phones the signed-in links fold into a menu, opened with a button.
    const [menuOpen, setMenuOpen] = useState(false);

    // Close the menu after following a link.
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header__container">
                <div className="header__title-container">
                    <Link to={"/Travelers"}><img className="header__logo" src={logo} alt="Why Travel Alone logo" /></Link>
                    <h1 className="header__title">Why Travel Alone</h1>
                    {isAuthenticated && (
                        <button
                            type="button"
                            className="header__menu-button"
                            aria-expanded={menuOpen}
                            aria-controls="site-nav"
                            onClick={() => setMenuOpen((open) => !open)}
                        >
                            {menuOpen ? "Close" : "Menu"}
                        </button>
                    )}
                </div>
                <nav
                    id="site-nav"
                    aria-label="Main"
                    className={`header__nav${isAuthenticated ? " header__nav--member" : ""}${menuOpen ? " header__nav--open" : ""}`}
                >
                    {isAuthenticated && (
                        <>
                            <NavLink className={navClass} to={"/Travelers"}>
                                <p className="header__text">Travelers</p>
                            </NavLink>
                            <NavLink className={navClass} to={"/Trips"}>
                                <p className="header__text">Trips</p>
                            </NavLink>
                            <NavLink className={navClass} to={"/new"}>
                                <p className="header__text">New Trip</p>
                            </NavLink>
                            <NavLink className={navClass} to={"/invitations"}>
                                <p className="header__text">Invitations</p>
                            </NavLink>
                            <NavLink className={navClass} to={"/profile"}>
                                <p className="header__text">Profile</p>
                            </NavLink>
                        </>
                    )}
                    {isAuthenticated ? (
                        <>
                            {account && (
                                <span className="header__text header__account">
                                    {account.traveler ? `${account.traveler.first_name} ${account.traveler.last_name}` : account.email}
                                </span>
                            )}
                            <button className="header__links header__logout" type="button" onClick={handleLogout}>
                                <p className="header__text">Log Out</p>
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink className={navClass} to={"/login"}>
                                <p className="header__text">Log In</p>
                            </NavLink>
                            <NavLink className={navClass} to={"/register"}>
                                <p className="header__text">Register</p>
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
