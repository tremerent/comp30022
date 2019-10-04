// supply a token
import apiFetch from './apiFetch';
import { getToken } from './auth';
import { Store } from 'redux';

/*
 * All request functions assume parameters have already been validated.
 */

async function postLogin(loginDetails) {
    const resp = await apiFetch()
        .post(`auth/login`, loginDetails);

    return resp.data;
}

async function postRegister(registerDetails) {
    const resp = await apiFetch()
        .post(`auth/register`, registerDetails);

    return resp.data;
}

async function getArtefact(artefactId) {
    const resp = await apiFetch(getToken())
        // XXX not sure if this is sanitised -- Sam
        .get(`/Artefacts/${artefactId}`);

    return resp.data;
}

// assumes param. 'artefact' has been validated
async function postArtefact(artefact) {
    // post the artefact
    const resp = await apiFetch(getToken())
        .post(`/Artefacts`, artefact);

    return resp.data;
}

async function postArtefactAndCategories(artefactToPost) {
    const artefactCategories =
        artefactToPost.categories.map(selectOpt => (
            // convert { label, value } categories select opts to
            // category data models { id, name }
            { id: selectOpt.value, name: selectOpt.label })
        );
    delete artefactToPost.categories;

    const createdArtefact = await postArtefact(artefactToPost);

    if (artefactCategories.length) {
        await postArtefactCategories(createdArtefact.id, artefactCategories);
    }

    // fetch artefact again now that it has category relationships
    // (this could also be stored prior to posting the artefact, and then
    // appended to the 'postedArtefact', but fetching now ensures
    // client-server synchronisation
    const newArtefact = await getArtefact(createdArtefact.id);

    return newArtefact;
}

// 'category' should already be validated
async function postCategory(category) {
    const resp = await apiFetch(getToken())
        .post(`/Categories`, category);

    return resp.data;
}

async function getCategories() {
    const resp = await apiFetch(getToken())
        .get(`/Categories`);

    return resp.data;
}

async function postArtefactCategories(artefactId, categories) {
    const artefactCategories = categories
        .map(cat => ({ artefactId, categoryId: cat.id }));

    const resp = await apiFetch(getToken())
        .post(`/ArtefactCategories/Many`, artefactCategories);

    return resp.data;
}

async function getVisibilityOpts() {
    const resp = await apiFetch(getToken())
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
        resp = await apiFetch(getToken())
            .get(`/Artefacts`);
    }
    else {

        resp = await apiFetch(getToken())
            .get(`/Artefacts/user/${username}` + visQuery);
    }

    return resp.data;
}

async function getUser(username) {
    const resp = await apiFetch()
        .get(`/User/${username}`);

    return resp.data;
}

// This is a total hack. Will fix to be proper reduxy given more time.
// -- Sam
async function changeCurUserInfo(user, newInfo) {
    const resp = await apiFetch(getToken())
        .post(`/user/${user.username}`, newInfo);

    return resp.data;
}

export {
    postArtefact,
    postArtefactAndCategories,
    getArtefact,
    getArtefacts,
    getVisibilityOpts,

    postArtefactCategories,
    postCategory,
    getCategories,

    postLogin,
    postRegister,

    getUser,
    changeCurUserInfo,
}
