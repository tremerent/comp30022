import { getAuthDetails, isExpired, } from '../../scripts/auth';
import { auth as authActions, } from 'redux/actions';
import { store } from 'index.js';

export default function getInitAuthState(authDetails) {
    if (!authDetails) {
        authDetails = getAuthDetails();
    }

    const initAuthState = {
        user: {},
        isLoggedIn: false,
        loading: false,
        redir: null,
        expiry: null,
        loginError: null,
    };

    if (authDetails != null) {
        const loggedInUser = authDetails.user;

        let expiry;
        if (typeof authDetails.expiry === 'string') {
            expiry = Date.parse(authDetails.expiry);
        }

        if (loggedInUser != null && !isExpired(expiry)) {
            initAuthState.user = loggedInUser;
            initAuthState.isLoggedIn = true;
            initAuthState.expiry = expiry;

            setLogoutTimeout(expiry);
        }
    }

    return initAuthState;
}

// TODO: should notify user
export function setLogoutTimeout(expiry) {
    if (typeof expiry === 'string') {
        expiry = Date.parse(expiry);
    }

    const timeUntilAuthExp = (expiry - Date.now()).valueOf();

    setTimeout(() => {
        store.dispatch(authActions.logout());
    }, timeUntilAuthExp);
}


