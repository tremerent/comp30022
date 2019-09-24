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

const REQ_GET_MY_ARTEFACTS = 'REQ_GET_MY_ARTEFACTS';
const RES_GET_MY_ARTEFACTS = 'RES_GET_MY_ARTEFACTS';
const ERR_GET_MY_ARTEFACTS = 'ERR_GET_MY_ARTEFACTS';
const REQ_GET_PUBLIC_ARTEFACTS = 'REQ_GET_PUBLIC_ARTEFACTS';
const RES_GET_PUBLIC_ARTEFACTS = 'RES_GET_PUBLIC_ARTEFACTS';
const ERR_GET_PUBLIC_ARTEFACTS = 'ERR_GET_PUBLIC_ARTEFACTS';
const ADD_MY_ARTEFACTS = 'ADD_MY_ARTEFACTS';


const artefactTypes = {
    REQ_GET_MY_ARTEFACTS,
    RES_GET_MY_ARTEFACTS,
    ERR_GET_MY_ARTEFACTS,
    ADD_MY_ARTEFACTS,
    REQ_GET_PUBLIC_ARTEFACTS,
    RES_GET_PUBLIC_ARTEFACTS,
    ERR_GET_PUBLIC_ARTEFACTS,
}

export {
    authTypes,
    artefactTypes,
}

