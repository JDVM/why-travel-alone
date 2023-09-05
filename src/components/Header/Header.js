import "./Header.scss";
import logo from "../../assets/Logo/plain-logo.svg"
import { Link, NavLink } from "react-router-dom";
function Header() {
    return (
        <header className="header">
            <div className="header__container">
                <div className="header__title-container">
                    <Link to={"/Travelers"}><img className="header__logo" src={logo} alt="Logo for Instock Company" /></Link>
                    <h1 className="header__title">Why Travel Alone</h1>
                </div>
                <nav className="header__nav">
                    <NavLink className={`header__links ${({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "header__link"}`}
                        to={"/Travelers"}>
                        <p className="header__text">Travelers</p>
                    </NavLink>
                    <NavLink
                        className={`header__links ${({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "header__link"}`}
                        to={"/Trips"}
                    >
                        <p className="header__text">Trips</p>
                    </NavLink>
                    <NavLink
                        className={`header__links ${({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "header__link"}`}
                        to={"/new"}
                    >
                        <p className="header__text">New Trip</p>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
export default Header

