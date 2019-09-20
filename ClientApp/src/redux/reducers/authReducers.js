﻿import { authTypes } from '../actions/types';

const initAuthState = {
    user: {},
    isLoggedIn: false,
    loading: false,
};

function auth(state = initAuthState, action) {
    switch (action.type) {
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