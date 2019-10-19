﻿const SET_REDIR = 'SET_REDIR';
const RES_LOGIN = 'RES_LOGIN';
const REQ_LOGIN = 'REQ_LOGIN';
const REQ_REGISTER = 'REQ_REGISTER';
const RES_REGISTER = 'RES_REGISTER';
const ERR_REGISTER = 'ERR_REGISTER';
const LOGOUT = 'LOGOUT';

const authTypes = {
    SET_REDIR,
    RES_LOGIN,
    REQ_LOGIN,
    REQ_REGISTER,
    RES_REGISTER,
    ERR_REGISTER,
    LOGOUT,
}


const RES_GET_BROWSER_ARTEFACTS = 'RES_GET_BROWSER_ARTEFACTS';
const REQ_GET_BROWSER_ARTEFACTS = 'REQ_GET_BROWSER_ARTEFACTS';
const ERR_GET_BROWSER_ARTEFACTS = 'ERR_GET_BROWSER_ARTEFACTS';

const REQ_GET_MY_ARTEFACTS = 'REQ_GET_MY_ARTEFACTS';
const RES_GET_MY_ARTEFACTS = 'RES_GET_MY_ARTEFACTS';
const ERR_GET_MY_ARTEFACTS = 'ERR_GET_MY_ARTEFACTS';

const REQ_GET_PUBLIC_ARTEFACTS = 'REQ_GET_PUBLIC_ARTEFACTS';
const RES_GET_PUBLIC_ARTEFACTS = 'RES_GET_PUBLIC_ARTEFACTS';
const ERR_GET_PUBLIC_ARTEFACTS = 'ERR_GET_PUBLIC_ARTEFACTS';
const SET_PUBLIC_ARTEFACTS = 'SET_PUBLIC_ARTEFACTS';

const ADD_MY_ARTEFACTS = 'ADD_MY_ARTEFACTS';
const REQ_CREATE_MY_ARTEFACTS = 'REQ_CREATE_MY_ARTEFACTS';
const RES_CREATE_MY_ARTEFACTS = 'RES_CREATE_MY_ARTEFACTS';

const REQ_GET_USER = 'REQ_GET_USER';
const RES_GET_USER = 'RES_GET_USER';
const ERR_GET_USER = 'ERR_GET_USER';

const REQ_PATCH_USER_DETAILS = 'REQ_PATCH_USER_DETAILS';
const RES_PATCH_USER_DETAILS = 'RES_PATCH_USER_DETAILS';
const ERR_PATCH_USER_DETAILS = 'ERR_PATCH_USER_DETAILS';

const REQ_GET_USER_ARTEFACTS = 'REQ_GET_USER_ARTEFACTS';
const RES_GET_USER_ARTEFACTS = 'RES_GET_USER_ARTEFACTS';
const ERR_GET_USER_ARTEFACTS = 'ERR_GET_USER_ARTEFACTS';

const artefactTypes = {
    RES_GET_BROWSER_ARTEFACTS,
    REQ_GET_BROWSER_ARTEFACTS,
    ERR_GET_BROWSER_ARTEFACTS,


    REQ_GET_MY_ARTEFACTS,
    RES_GET_MY_ARTEFACTS,
    ERR_GET_MY_ARTEFACTS,

    ADD_MY_ARTEFACTS,
    RES_CREATE_MY_ARTEFACTS,
    REQ_CREATE_MY_ARTEFACTS,

    SET_PUBLIC_ARTEFACTS,
    REQ_GET_PUBLIC_ARTEFACTS,
    RES_GET_PUBLIC_ARTEFACTS,
    ERR_GET_PUBLIC_ARTEFACTS,

    REQ_GET_USER_ARTEFACTS,
    RES_GET_USER_ARTEFACTS,
    ERR_GET_USER_ARTEFACTS,
}

// artefacts of a specific user
const usersTypes = {
    REQ_GET_USER,
    RES_GET_USER,
    ERR_GET_USER,

    REQ_PATCH_USER_DETAILS,
    RES_PATCH_USER_DETAILS,
    ERR_PATCH_USER_DETAILS,
}

export {
    authTypes,
    artefactTypes,
    usersTypes,
}

