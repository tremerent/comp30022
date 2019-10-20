
import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
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

    componentDidMount() {
        // get color of browse icon
        if (this.browseEle) {
            this.setState({
                ...this.state,
                browseNavItemColor: window.getComputedStyle(this.browseEle).color,
            });
        }
    }

    componentDidUpdate() {
        // get color of browse icon
        const browseNavItemColor = 
            window.getComputedStyle(this.browseEle).color;

        if (this.browseEle && 
            this.state.browseNavItemColor != browseNavItemColor) {
            this.setState({
                ...this.state,
                browseNavItemColor,
            });
        }
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
                <div className='af-navmenu'>
                    <Navbar light className="navbar-expand-lg ng-white box-shadow af-navmenu">
                        <Container>
                            <NavbarBrand tag={Link} to="/">
                                <img src={ARTEFACTOR_BRAND} className='af-navmenu-brand' alt='Artefactor logo'/>
                            </NavbarBrand>
                            <NavbarToggler onClick={this.toggleNav}/>
                            <Collapse
                                className="d-sm-inline-flex flex-sm-row-reverse"
                                isOpen={!this.state.collapsed} navbar
                            >
                                <ul className="navbar-nav af-nav-link">
                                    <StyledNavLink
                                        to="/browse"
                                        label={
                                            <>
                                                <span ref={(browseEle) => this.browseEle = browseEle}
                                                    > Browse </span>&nbsp;
                                                {artefactIcon}
                                            </>
                                        }
                                        curPath={this.props.curPath}
                                        className="af-nav-link-inherit"
                                    />
                                    {
                                        !/*XXX*/this.state.authenticated ? (
                                            <>
                                            {/*<NavLink tag={Link} to="/family">My Family</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/profile">Profile</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/my-artefacts">My Artefacts</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/logout">Log Out</NavLink>*/}
                                            </>
                                        ) : (
                                            <>
                                            {/*<NavLink tag={Link} to="/login">Log In</NavLink>*/}
                                            {/*<NavLink tag={Link} to="/signup">Sign Up</NavLink>*/}
                                            </>
                                        )
                                    }
                                    <UserNavMenu/>
                                </ul>
                            </Collapse>
                        </Container>
                    </Navbar>
                </div>
                <div className='af-navmenu-placeholder'></div>
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

