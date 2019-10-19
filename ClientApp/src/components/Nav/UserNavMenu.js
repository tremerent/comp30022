import React from 'react';
import { NavItem } from 'reactstrap';
import { connect, } from 'react-redux';
import PropTypes from 'prop-types';

import { auth } from '../../redux/actions';
import StyledNavLink from './StyledNavLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const loginPath = '/auth/login';
const signupPath = '/auth/signup'
const profilePath = '/profile';
const myArtefactsPath = '/my-artefacts';

class UserNavMenu extends React.Component {

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
                    to={`/user/${this.props.user.username}`}
                    label={
                        <>
                            <span> My Repository </span>&nbsp;
                            <FontAwesomeIcon icon={faHome}/> 
                        </>
                    }
                    curPath={this.props.curPath}
                />
                <NavItem>
                    <button onClick={(e) => { e.preventDefault(); this.props.logout("/browse"); }} className="text-dark btn nav-link">
                        <span>Logout </span>&nbsp;
                        <FontAwesomeIcon icon={faSignOutAlt}/> 
                    </button>
                </NavItem>
            </>
        );
    }

    unauthedView() {
        return (
            <>
                <StyledNavLink
                    to={loginPath}
                    label={
                        <>
                            <span> Login </span>
                            <FontAwesomeIcon icon={faSignInAlt}/> 
                        </>
                    }
                    curPath={this.props.curPath}
                    className="af-inactive-nav-link"
                />
                <StyledNavLink
                    to={signupPath}
                    label={
                        <>
                            <span> Signup </span>
                        </>
                    }
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

