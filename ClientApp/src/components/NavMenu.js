
import React from 'react';
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavLink,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import { LoginMenu } from './api-authorization/LoginMenu';
import authService from './api-authorization/AuthorizeService';

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
        this.authServiceSubscription = authService.subscribe(() =>
                this.populateState());
        this.populateState();
    }

    componentWillUnmount() {
        authService.unsubscribe(this.authServiceSubscription);
    }

    async populateState() {
        const [isAuthenticated, user] =
            await Promise.all([authService.isAuthenticated(), authService.getUser()])
        this.setState({
            authenticated: isAuthenticated,
            userName: user && user.name
        });
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
                    <LoginMenu></LoginMenu>
                </ul>
            </Collapse>
        </Container>
    </Navbar>
</header>
        );
    }
}

