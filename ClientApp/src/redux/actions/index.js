import { authTypes } from './types';

import {
    postLogin,
    postRegister,
} from '../../scripts/requests';

// request login
function reqLogin() {
    return {
        type: authTypes.REQ_LOGIN,
    }
}

// receive login response
function resLogin(userData) {
    return {
        type: authTypes.RES_LOGIN,
        userData,
    }
}

function login(loginData) {
    return async function (dispatch) {
        dispatch(reqLogin());

        const resp = await postLogin(loginData);
        const respData = await resp.json();

        dispatch(resLogin(respData.user));

        return respData;
    }
}

// request login
function reqRegister() {
    return {
        type: authTypes.REQ_REGISTER,
    }
}

// receive login response
function resRegister(userData) {
    return {
        type: authTypes.RES_REGISTER,
        userData,
    }
}

function errRegister(errorCode) {
    return {
        type: authTypes.ERR_REGISTER,
        errorCode: errorCode,
    }
}

function register(registerData) {
    return async function (dispatch) {
        dispatch(reqRegister());

        const resp = await postRegister(registerData);
        const respData = await resp.json();

        dispatch(resRegister(respData.user));

        return respData;
    }
}

function logout() {
    return async function (dispatch) {

    }
}

const auth = {
    login,
    register,
    logout,
}

export {
    auth,
}