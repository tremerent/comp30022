import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect, } from 'react-redux';
import PropTypes from 'prop-types';

import { auth } from '../../redux/actions';
import StyledNavLink from './StyledNavLink';

const loginPath = '/auth/login';
const signupPath = '/auth/signup'
const profilePath = '/profile';
const myArtefactsPath = '/my-artefacts';
const logoutPath = '/';
const landingPage = '/'

class UserNavMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.isLoggedIn) {
            return this.authedView(this.props.user);
        }
        else {
            return this.unauthedView();
        }
    }

    authedView = (user) => {
        return (
            <>
                <StyledNavLink
                    to={profilePath}
                    label="Profile"
                    curPath={this.props.curPath}
                />
                <StyledNavLink
                    to={myArtefactsPath}
                    label="My Artefacts"
                    curPath={this.props.curPath}
                />
                <NavItem>
                    <button onClick={(e) => { e.preventDefault(); this.props.logout("/browse"); }} className="text-dark btn nav-link">
                        Logout
                    </button>
                </NavItem>
            </>
        );
    }

    unauthedView() {
        return (
            <>
                <StyledNavLink
                    to={signupPath}
                    label="Signup"
                    curPath={this.props.curPath}
                    className="af-inactive-nav-link"
                />
                <StyledNavLink
                    to={loginPath}
                    label="Login"
                    curPath={this.props.curPath}
                    className="af-inactive-nav-link"
                />
            </>
        );
    }
}

UserNavMenu.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    user: PropTypes.shape({
            username: PropTypes.string,
    }).isRequired,
    logout: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
    return {
        ...state.auth,
        curPath: state.router.location.pathname,
    }
}

const mapDispatchToProps = (dispatch) => {
    //return bindActionCreators({ logout: auth.logout }, dispatch);
    return {
        logout: redirTo => {
            dispatch(auth.logout(redirTo));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (UserNavMenu)

