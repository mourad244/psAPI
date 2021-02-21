import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        PS SOLUTION
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink className="anv-item nav-link " to="/servicescategorie">
            Categorie de services
          </NavLink>
          <NavLink className="anv-item nav-link " to="/services">
            Services
          </NavLink>
          <NavLink className="anv-item nav-link " to="/productscategorie">
            Categorie de produits
          </NavLink>
          <NavLink className="anv-item nav-link " to="/productstype">
            Type de produits
          </NavLink>
          <NavLink className="anv-item nav-link " to="/products">
            Produits
          </NavLink>

          {!user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/login">
                Login
              </NavLink>
              {/* <NavLink className="nav-item nav-link" to="/register">
                Register
              </NavLink> */}
            </React.Fragment>
          )}
          {user && (
            <React.Fragment>
              <NavLink className="nav-item nav-link" to="/profile">
                {user.name}
              </NavLink>
              <NavLink className="nav-item nav-link" to="/logout">
                Logout
              </NavLink>
            </React.Fragment>
          )}
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
