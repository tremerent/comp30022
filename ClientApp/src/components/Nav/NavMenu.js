import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavLink,
} from 'reactstrap';
import { Link, } from 'react-router-dom';

import UserNavMenu from './UserNavMenu';

export class NavMenu extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            collapsed: true,
            authenticated: false,
        }

        this.toggleNav = this.toggleNav.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    async populateState() {
    }


    toggleNav() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    render() {
        return (
<header>
                <Navbar light className={"navbar-expand-sm ng-white border-bottom box-shadow" + " "}>
        <Container>
            <NavbarBrand tag={Link} to="/">Artefactor</NavbarBrand>
            <NavbarToggler onClick={this.toggleNav}/>
            <Collapse
                className="d-sm-inline-flex flex-sm-row-reverse"
                isOpen={!this.state.collapsed} navbar
            >
                <ul className="navbar-nav">
                    <NavLink tag={Link} to="/browse">Browse</NavLink>
                    {
                        this.state.authenticated ? (
                            <>
                            {/*<NavLink tag={Link} to="/family">My Family</NavLink>*/}
                            {/*<NavLink tag={Link} to="/profile">Profile</NavLink>*/}
                            <NavLink tag={Link} to="/my-artefacts">My Artefacts</NavLink>
                            {/*<NavLink tag={Link} to="/logout">Log Out</NavLink>*/}
                            </>
                        ) : (
                            <>
                            {/*<NavLink tag={Link} to="/login">Log In</NavLink>*/}
                            {/*<NavLink tag={Link} to="/signup">Sign Up</NavLink>*/}
                            </>
                        )
                    }
                    <UserNavMenu></UserNavMenu>
                </ul>
            </Collapse>
        </Container>
    </Navbar>
</header>
        );
    }
}
