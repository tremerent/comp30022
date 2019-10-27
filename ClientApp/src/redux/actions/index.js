import { push } from 'connected-react-router';
import { authTypes, } from './types';
import { setUser, logoutUser, } from '../../scripts/auth';
import * as discuss from './discussActions';
import tute from './tuteActions';
import * as artefacts from './artActions';
import * as users from './userActions';
import { setLogoutTimeout } from 'redux/reducers/initAuthState';

import {
    postRegister,
} from '../../scripts/requests';

function setRedir(to) {
    return {
        type: authTypes.SET_REDIR,
        to,
    }
}

// request login
function reqLogin() {
    return {
        type: authTypes.REQ_LOGIN,
    }
}

// receive login response
function resLogin(authDetails) {
    return {
        type: authTypes.RES_LOGIN,
        authDetails: {
            user: {
                username: authDetails.user.username,
            },
            expiry: authDetails.expiry,
        },
    }
}

function errLogin() {
    return {
        type: authTypes.ERR_LOGIN,
    }
}

function login(loginData) {
    return async function (dispatch) {
        dispatch(reqLogin());

        const authDetails = await setUser(loginData);
        if (authDetails) {
            setLogoutTimeout(authDetails.expiry);

            dispatch(resLogin({
                expiry: authDetails.expiry,
                user: {
                    username: loginData.username,
                },
            }));
        }
        else {
            dispatch(errLogin())
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
//function resRegister() {
//    return {
//        type: authTypes.RES_REGISTER,
//    }
//}

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

        try {
            const responseData = await postRegister(registerData);
            await dispatch(login(registerData));
            return responseData;
        } catch (e) {
            if (e.response)
                dispatch(errRegister(e.response.data.value));
            else
                dispatch(errRegister({ errors: [ 'Unspecified Error' ] }));
            return null;
        }
    }
}

function logoutActionCreator() {
    return {
        type: authTypes.LOGOUT,
    }
}

function logout(redirTo) {
    return async function (dispatch) {
        logoutUser();
        dispatch(logoutActionCreator());
        if (redirTo != null) {
            dispatch(push(redirTo));
        }
    }
}

const auth = {
    login,
    register,
    logout,
    setRedir,
}

export {
    auth,
    artefacts,
    users,
    tute,
    discuss,
};

