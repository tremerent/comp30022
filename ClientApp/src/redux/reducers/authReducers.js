import { authTypes } from '../actions/types';
import initAuthState from './initAuthState'

function auth(state = initAuthState(), action) {
    switch (action.type) {
        case authTypes.SET_REDIR:
            return {
                ...state,
                redir: action.to,
            };
        case authTypes.REQ_LOGIN:
            return {
                ...state,
                loading: true,
            };
        case authTypes.RES_LOGIN:
            return {
                ...state,
                loading: false,
                user: action.authDetails.user,
                expiry: action.authDetails.expiry,
                isLoggedIn: true,
            };
        case authTypes.ERR_LOGIN:
            return {
                ...state,
                loading: false,
                isLoggedIn: false,
                loginError: action.errorCode
            };
        case authTypes.REQ_REGISTER:
            return {
                ...state,
                loading: true,
            };
        case authTypes.RES_REGISTER:
            return {
                loading: false,
                user: action.userData,
                isLoggedIn: true,
            };
        case authTypes.ERR_REGISTER:
            return {
                loading: false,
                user: {},
                isLoggedIn: false,
                error: action.errorCode,
            };
        case authTypes.LOGOUT:
            return {
                ...auth,
                user: {},
                isLoggedIn: false,
            };
        default:
            return state
    }
}

export {
    auth,
}
