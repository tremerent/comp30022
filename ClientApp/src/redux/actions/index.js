import { authTypes, artefactTypes } from './types';
import { setUser, logoutUser, } from '../../scripts/auth';
import { push } from 'connected-react-router';

import {
    postRegister,
    getArtefacts,
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
function resLogin(userData) {
    return {
        type: authTypes.RES_LOGIN,
        userData,
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

        if (await setUser(loginData)) {
            dispatch(resLogin({
                username: loginData.username,
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

        const responseData = await postRegister(registerData);

        if (responseData.isOk) {
            dispatch(login(registerData));
            return responseData;
        }
        else {
            if (responseData.errorCode) {
                dispatch(errRegister(responseData.errorCode));
            }
            else {
                dispatch(errRegister("NO ERROR CODE"));
            }
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
        dispatch(push(redirTo));
    }
}

const auth = {
    login,
    register,
    logout,
    setRedir,
}

function reqGetMyArtefacts() {
    return {
        type: artefactTypes.REQ_GET_MY_ARTEFACTS,
    }
}

function resGetMyArtefacts(myArtefacts) {
    return {
        type: artefactTypes.RES_GET_MY_ARTEFACTS,
        myArtefacts,
    }
}

function errGetMyArtefacts() {
    return {
        type: artefactTypes.ERR_GET_MY_ARTEFACTS,
    }
}

function getMyArtefacts() {
    return async function (dispatch, getState) {
        const { user: { username: curUserUsername } } =
            getState().auth;

        dispatch(reqGetMyArtefacts());

        try {
            const myArtefacts = await getArtefacts(curUserUsername);
            dispatch(resGetMyArtefacts(myArtefacts));
        }
        catch (e) {
            // TODO
            dispatch(errGetMyArtefacts());
        }
    }
}

function reqGetPublicArtefacts() {
    return {
        type: artefactTypes.REQ_GET_PUBLIC_ARTEFACTS,
    }
}

function resGetPublicArtefacts(publicArtefacts) {
    return {
        type: artefactTypes.RES_GET_PUBLIC_ARTEFACTS,
        publicArtefacts,
    }
}

function errGetPublicArtefacts() {
    return {
        type: artefactTypes.ERR_GET_PUBLIC_ARTEFACTS,
    }
}

function getPublicArtefacts() {
    return async function (dispatch) {
        dispatch(reqGetPublicArtefacts());

        try {
            const publicArtefacts = await getArtefacts();
            dispatch(resGetPublicArtefacts(publicArtefacts));
        }
        catch (e) {
            // TODO
            console.log('error');
            console.log(e);
            dispatch(errGetPublicArtefacts());
        }
    }
}

function addMyArtefact(newArtefact) {
    return {
        type: artefactTypes.ADD_MY_ARTEFACTS,
        newArtefact,
    }
}

const artefacts = {
    getMyArtefacts,
    addMyArtefact,
    getPublicArtefacts,
}

export {
    auth,
    artefacts,
}
