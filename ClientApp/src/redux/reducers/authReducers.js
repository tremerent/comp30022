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
                loading: false,
                user: action.userData,
                isLoggedIn: true,
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
                error: {
                    code: action.errorCode,
                }
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