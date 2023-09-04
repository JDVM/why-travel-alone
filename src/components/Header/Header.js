import "./Header.scss";
import logo from "../../assets/Logo/plain-logo.svg"
import { Link, NavLink } from "react-router-dom";
function Header() {
    return (
        <header>
            <div className="header__container">
                <Link to={"/Travelers"}><img className="header__logo" src={logo} alt="Logo for Instock Company" /></Link>
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
                        to={"/Trips/new"}
                    >
                        <p className="header__text">Create New Trip</p>
                    </NavLink>
                    <input type="text" placeholder="Search" />
                </nav>
            </div>
        </header>
    )
}
export default Header

