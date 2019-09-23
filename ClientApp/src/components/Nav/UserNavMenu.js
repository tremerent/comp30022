import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect, } from 'react-redux';
import { bindActionCreators } from 'react';
import PropTypes from 'prop-types';

import { auth } from '../../redux/actions';

const loginPath = '/auth/login';
const signupPath = '/auth/signup'
const profilePath = '/';
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
            //<NavItem>
            //    <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {user.userName}</NavLink>
            //</NavItem>
            <>
                <NavLink tag={Link} to="/profile">Profile</NavLink>
                <NavLink tag={Link} to="/my-artefacts">My Artefacts</NavLink>
                <NavItem>
                    <button onClick={(e) => { e.preventDefault(); this.props.logout("/browse"); }} className="text-dark btn nav-link">
                        Logout
                    </button>
                </NavItem>
            </>
        );

        //<NavLink tag={Link} className="text-dark" to={landingPage} onClick={this.props.logout}>
        //    Logout
        //            </NavLink>
    }

    unauthedView() {
        return (
            <>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={signupPath}>Signup</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={loginPath}>Login</NavLink>
                </NavItem>
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
        ...state.auth
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

