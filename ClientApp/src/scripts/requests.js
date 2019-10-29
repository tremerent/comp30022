// supply a token
import apiFetch from './apiFetch';
import { getToken } from './auth';

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
        .get(`/Artefacts?id=${artefactId}`);

    return resp.data;
}

async function addArtefactImage(artefactId, file) {
    const data = new FormData();
    data.append("file", file);

    const resp = await apiFetch(getToken())
        .post(`/artefacts/image?artefactId=${artefactId}`, data)

    return resp.data;
}

async function removeArtefactImage(artefactId, imageId) {
    const resp = await apiFetch(getToken())
        .delete(`/artefacts/image?imageId=${imageId}&artefactid=${artefactId}`)

    return resp.data;
}

// assumes param. 'artefact' has been validated
async function postArtefact(artefact) {
    // post the artefact
    const resp = await apiFetch(getToken())
        .post(`/Artefacts`, artefact);

    return resp.data;
}

async function patchArtefact(artefact) {
    const resp = await apiFetch(getToken())
        .patch(`/artefacts/${artefact.id}`, artefact);

    return resp.data;
}

async function patchArtefactAndCategories(updatedArt, origArt) {

    if (updatedArt.id !== origArt.id) {
        console.error(`CANNOT UPDATE ART ${origArt.id} SINCE IDS DO NOT MATCH`);
    }

    // patch artefact
    await patchArtefact(updatedArt);

    // if (origArt.categoryJoin && updatedArt.categoryJoin) {

    //     const updatedCj = updatedArt.categoryJoin;
    //     const origCj = origArt.categoryJoin;


    //     const toAdd = updatedCj.filter(cj =>
    //         !origCj.find(ocj => ocj.categoryId === cj.categoryId));

    //     const toRemove = origCj.filter(cj =>
    //         !updatedCj.find(ocj => ocj.categoryId == cj.categoryId));



    //     // add categories
    //     await postArtefactCategories(categoryOptsToDbModel(updatedArt.id, toAdd));

    //     // remove categories
    //     await Promise.all(
    //         categoryOptsToDbModel(updatedArt.id, toRemove)
    //         .map(cjDbModel => deleteArtefactCategory(cjDbModel))
    //     );
    // }

    // fetch artefact again now that it has category relationships
    // (this could also be stored prior to posting the artefact, and then
    // appended to the 'postedArtefact', but fetching now ensures
    // client-server synchronisation
    const newArtefact = await getArtefact(updatedArt.id);

    return newArtefact;
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

const categoryOptsToDbModel = (artefactId, categoryOpts) => {
    return categoryOpts.map(cat => ({ artefactId, categoryId: cat.id }));
}

async function postArtefactCategories(artefactId, categories) {
    const artefactCategories = categoryOptsToDbModel(artefactId, categories);

    const resp = await apiFetch(getToken())
        .post(`/ArtefactCategories/Many`, artefactCategories);

    return resp.data;
}

async function deleteArtefactCategory(artCategory) {
    const resp = await apiFetch(getToken())
        .delete(`/ArtefactCategories`, artCategory);

    return resp.data;
}

async function getVisibilityOpts() {
    const resp = await apiFetch(getToken())
        .get(`/Artefacts/VisibilityOpts`);

    return resp.data;
}

async function getArtefacts(queryDetails) {
    let resp;

    const queries = [];
    Object.keys(queryDetails).map(function(key) {
        const val = queryDetails[key];

        if (val !== null && val !== "" && val.length) {
            queries.push(
                makeQuery(key, val)
            );
        }

        return null;
    });

    let url = `/artefacts`;
    if (queries.length) {
        url += '?' + queries.reduce((acc, cur) => acc + cur);
    }
    resp = await apiFetch(getToken())
            .get(url);

    return resp.data;

    function makeQuery(k, v) {
        if (Array.isArray(v)) {
            return makeQueryFromArray(v, k);
        }

        return `&${k}=${v}`;
    }

    // calls 'makeQuery' on each element then concats the result
    function makeQueryFromArray(queryArray, queryName) {
        return queryArray.map(q => makeQuery(queryName, q))
                         .reduce((acc, cur) => acc + cur);
    }
}

async function getUser(username) {
    const resp = await apiFetch()
        .get(`/user/${username}`);

    return resp.data;
}

async function patchUserInfo(username, newInfo) {
    const resp = await apiFetch(getToken())
        .patch(`/user/${username}`, newInfo);

    return resp.data;
}

async function setProfileImage(file) {

    const data = new FormData();
    data.append("file", file);

    const resp = await apiFetch(getToken())
        .post(`/user/display-picture`, data)

    return resp.data;
}


async function getComment(id) {
    const resp = await apiFetch(getToken())
        .get(`/artefacts/comments/${id}`);

    return resp.data;
}

export async function getDiscussion(artefactId) {
    return (
            await apiFetch(getToken())
                .get(`/artefacts/comments?artefactId=${artefactId}`)
        ).data;
}

export async function postDiscussion(item) {
    let args;
    if (item.parent) {
        args = [
            '/artefacts/comments/reply',
            { Body: item.body, ParentCommentId: item.parent },
        ];
    } else if (item.type === 'question') {
        args = [
            '/artefacts/comments/question',
            { Body: item.body, ArtefactId: item.artefact },
        ];
    } else  {
        args = [
            '/artefacts/comments',
            { Body: item.body, ArtefactId: item.artefact },
        ];
    }

    let data = (
            await apiFetch(getToken())
                .post(...args)
        ).data;
    data.parent = item.parent;
    return data;
}

export async function markAnswer(question, answer) {
    const resp = await apiFetch(getToken())
        .patch(`/artefacts/comments/mark-answer`, { QuestionId: question.id, AnswerId: answer.id });
}

export async function unmarkAnswer(answer) {
    const resp = await apiFetch(getToken())
        .delete(
            `/artefacts/comments/mark-answer?questionId=${answer.answers}&answerId=${answer.id}`
        );
}

export {
    postArtefact,
    patchArtefactAndCategories,
    postArtefactAndCategories,
    getArtefact,
    getArtefacts,
    getVisibilityOpts,

    postArtefactCategories,
    postCategory,
    getCategories,

    addArtefactImage,
    removeArtefactImage,

    postLogin,
    postRegister,

    getUser,
    patchUserInfo,
    setProfileImage,

    getComment,
}
