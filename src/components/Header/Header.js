import "./Header.scss";
import { Link, NavLink } from "react-router-dom";
function Header() {
    return (
        <header>
            <div className="header__container">
                <Link to={"/Travelers"}><img className="header__logo" src={logo} alt="Logo for Instock Company" /></Link>
                <nav className="header__nav">
                    <NavLink
                        className={`header__trips ${({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "header__warehouses"}`}
                        to={"/Trips"}
                    >
                        <div className="header__text">Trips</div>
                    </NavLink>
                    <NavLink
                        className={`header__trips ${({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : "header__inventory"}`} to={"/Trips/new"}
                    >
                        <div className="header__text">Create New Trip</div>
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
export default Header

