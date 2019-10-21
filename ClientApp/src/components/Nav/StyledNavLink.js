import React from 'react';
import { NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

import './NavMenu.css';

/**
 * Apply css '.af-active-nav-link' to the NavLink that directs
 * to prop 'curPath'.
 * 
 * Since parent will likely have several <StyledNavLink />, it must pass 'curPath'.
 */

function StyledNavLink(props) {
    const { 
        to, 
        label, 
        curPath, 
        className: navLinkClasses, 
        ...rest 
    } = props;

    return <NavLink
        to={to}
        tag={Link}
        className={
            navLinkClasses + " " +
                (curPath === to
                ? "af-active-nav-link"
                : "af-inactive-nav-link")}
        {...rest}
    >{label}</NavLink>;
}

export default StyledNavLink;