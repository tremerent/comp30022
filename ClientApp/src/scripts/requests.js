﻿// supply a token
import apiFetch from './apiFetch';
import { getToken } from './auth';

const token = getToken();

const tokenFetch = apiFetch(token);
const noTokenFetch = apiFetch();

/*
 * All request functions assume parameters have already been validated.
 */

async function postLogin(loginDetails) {
    const resp = await noTokenFetch.post(`auth/login`, loginDetails);

    return resp.data;
}

async function postRegister(registerDetails) {
    const resp = await noTokenFetch.post(`auth/register`, registerDetails);

    return resp.data;
}

async function getArtefact(artefactId) {
    const resp = await tokenFetch
        // XXX not sure if this is sanitised -- Sam
        .get(`/Artefacts/${artefactId}`);

    return resp.data;
}

// assumes param. 'artefact' has been validated
async function postArtefact(artefact) {
    // post the artefact
    const resp = await tokenFetch
        .post(`/Artefacts`, artefact);

    return resp.data;
}

// 'category' should already be validated
async function postCategory(category) {
    const resp = await tokenFetch
        .post(`/Categories`, category);

    return resp.data;
}

async function getCategories() {
    const resp = await tokenFetch
        .get(`/Categories`);

    return resp.data;
}

async function postArtefactCategories(artefactId, categories) {
    const artefactCategories = categories
        .map(cat => ({ artefactId, categoryId: cat.id }));

    const resp = await tokenFetch
        .post(`/ArtefactCategories/Many`, artefactCategories);

    return resp.data;
}

async function getVisibilityOpts() {
    const resp = await tokenFetch
        .get(`/Artefacts/VisibilityOpts`);

    return resp.data;
}

/**
 * Get all artefacts owned by user with 'username', 
 * or all artefacts if null.
 */
async function getArtefacts(username, vis) {
    let resp;

    const visQuery = vis ? `?vis=${vis}` : ``;

    if (username == null) {
        resp = await tokenFetch
            .get(`/Artefacts`);
    }
    else {

        resp = await tokenFetch
            .get(`/Artefacts/user/${username}` + visQuery);
    }

    return resp.data;
}

async function getUser(username) {
    const resp = await noTokenFetch
        .get(`/User/${username}`);

    return resp.data;
}

export {
    postArtefact,
    getArtefact,
    getArtefacts,
    getVisibilityOpts,

    postArtefactCategories,
    postCategory,
    getCategories,

    postLogin,
    postRegister,

    getUser,
}
