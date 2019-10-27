import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import { isExpired } from 'scripts/auth';
import { auth as authActions } from 'redux/actions';
import { bindActionCreators } from 'redux';

/**
 * Higher order component that renders 'Component' if
 * store.auth.isLoggedIn, otherwise redirects to 'redir'.
 */
function requireAuth(Component, unauthedRedirTo) {
    class AuthComponent extends React.Component {
        render() {
            // otherwise user gets redir if
            if (this.props.authLoading) {
                return <> </>;
            }
            else if (this.props.isLoggedIn && !this.props.tokenExpired) {
                return <Component />;
            }
            else {
                // store the addr. of 'Component' - component at
                // 'unauthedRedirTo' can intiate redir. to 'Component'
                this.props.setRedir(this.props.goingToAddr);

                return <Redirect to={unauthedRedirTo} />;
            }
        }
    }

    function mapStateToProps(state) {
        return {
            isLoggedIn: state.auth.isLoggedIn,
            authLoading: state.auth.loading,
            goingToAddr: state.router.location.pathname,
            tokenExpired: isExpired(state.auth.expiry),
        };
    }

    function mapDispatchToProps(dispatch) {
        return bindActionCreators({ setRedir: authActions.setRedir }, dispatch);
    }

    return connect(mapStateToProps, mapDispatchToProps)(AuthComponent)
}

export default requireAuth;








