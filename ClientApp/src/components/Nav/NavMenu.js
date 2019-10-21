
import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    Nav,
    NavLink,
} from 'reactstrap';
import { Link,  } from 'react-router-dom';
import { connect } from 'react-redux';

import StyledNavLink from './StyledNavLink.js';
import UserNavMenu from './UserNavMenu.js';

import './NavMenu.css';
import ARTEFACTOR_BRAND from 'images/artefactor-brand.png';
import { ReactComponent as ArtefactIcon } from 'images/amphora.svg';
class NavMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            authenticated: false,
            browseNavItemColor: "#000000",
        }

        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        const artefactIcon = 
            <ArtefactIcon 
                fill={
                    this.state.browseNavItemColor
                }
                className="af-icon"
            />

        return (
            <header>
                <Navbar light expand="md" className='af-navmenu'>
                    <NavbarBrand tag={Link} to="/">
                        <img src={ARTEFACTOR_BRAND} className='af-navmenu-brand' alt='Artefactor logo'/>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse isOpen={this.state.collapsed} navbar>
                        <ul className="af-nav-link">
                            <Nav className="ml-auto" navbar>
                                <StyledNavLink
                                    to="/browse"
                                    label={
                                        <>
                                            <span 
                                                > Browse </span>&nbsp;
                                            {artefactIcon}
                                        </>
                                    }
                                    curPath={this.props.curPath}
                                    className="af-nav-link-inherit"
                                />
                                <UserNavMenu/>
                            </Nav>
                        </ul>
                    </Collapse>
                </Navbar>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        curPath: state.router.location.pathname,
    }
}

export default connect(mapStateToProps)(NavMenu);

