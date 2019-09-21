import { authTypes } from './types';
import { setUser, logoutUser, } from '../../scripts/auth';

import {
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

        if (await setUser(loginData)) {
            console.log('user set');

            dispatch(resLogin({
                username: loginData.username,
            }));
        }
        else {
            console.log('user not set');
        }
    }
}

// begin registration
function reqRegister() {
    return {
        type: authTypes.REQ_REGISTER,
    }
}

// registration complete
function resRegister() {
    return {
        type: authTypes.RES_REGISTER,
    }
}

function errRegister(errorCode) {
    return {
        type: authTypes.ERR_REGISTER,
        errorCode: errorCode,
    }
}

// register action makes a register request to api,
// then calls login action (since still need a jwt - 
// in future this could be given by server - see 
// https://identitymodel.readthedocs.io/en/latest/client/token.html)
function register(registerData) {
    return async function (dispatch) {
        dispatch(reqRegister());

        const resp = await postRegister(registerData);
        const respData = await resp.json();

        if (respData.isOk) {
            dispatch(login(registerData));
        }
        else {
            if (respData.errorCode) {
                dispatch(errRegister(respData.errorCode));
            }
            else {
                dispatch(errRegister("NO ERROR CODE"));
            }
        }

        dispatch(resRegister());
    }
}

function logout(redirUrl) {
    logoutUser();

    return {
        type: authTypes.LOGOUT,
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