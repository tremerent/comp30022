import { authTypes } from '../actions/types';

const initAuthState = {
    user: "guest",
    isLoggedIn: false,
    loading: false,
};

function auth(state = initAuthState, action) {
    switch (action.type) {
        case authTypes.RES_LOGIN:
            return {
                ...state,
                auth: {
                    ...state.auth,
                    user: action.userData,
                    isLoggedIn: true,
                }
            };
        case authTypes.REQ_LOGIN:
            return {
                ...state,
                loading: true,
            };
        case authTypes.REGISTER:
            return state;
        case authTypes.LOGOUT:
            return {
                ...state,
                auth: {
                    ...auth,
                    user: "guest",
                    isLoggedIn: false,
                }
            }
        default:
            return state
    }
}

export {
    auth,
}