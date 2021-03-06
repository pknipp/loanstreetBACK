import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = ({ currentUser }) => (
    <>
        loanstreet
        {(currentUser) ?
            <>
                <span>{currentUser.email}</span>
                <NavLink exact to="/" className="nav" activeClassName="active">Home</NavLink>
                <NavLink to="/edituser" activeClassName="active">Account Details</NavLink>
                <NavLink to="/logout" activeClassName="active">Log Out</NavLink>
            </>
        :
            <>
                <NavLink to="/login" activeClassName="active">Log In</NavLink>
                <NavLink to="/signup" activeClassName="active">Sign Up</NavLink>
            </>
        }
    </>
)
export default NavBar;
