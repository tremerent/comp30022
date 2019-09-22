import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

/**
 * Higher order component that renders 'Component' if
 * store.auth.isLoggedIn, otherwise redirects to 'redir'.
 */
function requireAuth(Component, redir) {
    class AuthComponent extends React.Component {
        render() {
            return this.props.isLoggedIn
                ? <Component />
                : <Redirect to={redir} />;
        }
    }

    function mapStateToProps(state) {
        return {
            isLoggedIn: state.auth.isLoggedIn,
        }
    }

    return connect(mapStateToProps)(AuthComponent)
}

export default requireAuth;





    
    
    
