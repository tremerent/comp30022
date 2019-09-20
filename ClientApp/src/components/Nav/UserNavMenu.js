import React from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const loginPath = '/auth/login';
const signupPath = '/auth/signup'
const profilePath = '/';
const logoutPath = '/';

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

    authedView(user) {
        return (
            <>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={profilePath}>Hello {user.userName}</NavLink>
                </NavItem>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={logoutPath}>Logout</NavLink>
                </NavItem>
            </>
        );
    }

    unauthedView() {
        return (
            <>
                <NavItem>
                    <NavLink tag={Link} className="text-dark" to={signupPath}>Register</NavLink>
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
    user: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            username: PropTypes.string,
        }),
    ]).isRequired,
}

function mapStateToProps(state) {
    return {
        ...state.auth,
    }
}

export default connect(mapStateToProps) (UserNavMenu)