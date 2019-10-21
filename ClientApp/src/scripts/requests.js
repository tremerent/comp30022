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

async function removeArtefactImage(artefactId, imgUrl) {
    const resp = await apiFetch(getToken())
        .delete(`/artefacts/image?img_url=${imgUrl}&artefactid=${artefactId}`)

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

// Adds a reference to each item in a discussion tree pointing to that item's
// parent item (or null at the top level).
// Possibly this causes memory leaks; I don't know anything about JS garbage
// collection.
// -- Sam
function addParentRefsToDiscussionTree(tree) {
    (function recurse(parent, tree, question, answerId) {
        for (let child of tree) {
            let nextQuestion = null;
            let nextAnswerId = null;
            if (!question) {
                if (child.type === 'question' && child.isAnswered) {
                    nextQuestion = child;
                    nextAnswerId = child.answerComment;
                }
            } else if (child.id === answerId) {
                child.isAnswer = true;
            }
            child.parent = parent;
            child.parentId = child.parent && child.parent.id;
            recurse(child, child.replies, nextQuestion, nextAnswerId);
        }
    })(null, tree, null, null);
    return tree;
}

export async function getDiscussion(artefactId) {
    return addParentRefsToDiscussionTree((
            await apiFetch(getToken())
                .get(`/artefacts/comments?artefactId=${artefactId}`)
        ).data);
}

export async function postDiscussion(item) {
    let args;
    if (item.parent) {
        args = [
            '/artefacts/comments/reply',
            { Body: item.body, ParentCommentId: item.parent.id },
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


export {
    postArtefact,
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
