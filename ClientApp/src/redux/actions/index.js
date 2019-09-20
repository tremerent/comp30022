import { authTypes } from './types';

import { postLogin } from '../../scripts/requests';

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

function register(registerData) {
    
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