import {
    postArtefactAndCategories,
    patchArtefactAndCategories,
    getArtefacts,
    getArtefact as apiGetArtefact,
    addArtefactImage,
} from '../../scripts/requests';
import { artefactTypes, } from './types';

function reqGetBrowserArtefacts(queryDetails) {
    return {
        type: artefactTypes.REQ_GET_BROWSER_ARTEFACTS,
        query: queryDetails,
    }
}

function resGetBrowserArtefacts(browserArtefacts) {
    return {
        type: artefactTypes.RES_GET_BROWSER_ARTEFACTS,
        browserArtefacts,
    }
}

function errGetBrowserArtefacts() {
    return {
        type: artefactTypes.ERR_GET_BROWSER_ARTEFACTS,
    }
}

export function getBrowserArtefacts(queryKeyValues) {
    return async function(dispatch) {
        dispatch(reqGetBrowserArtefacts(queryKeyValues))

        try {
            const browserArtefacts = await getArtefacts(queryKeyValues);

            dispatch(resGetBrowserArtefacts(browserArtefacts));
        }
        catch(e) {
            console.log(e);
            dispatch(errGetBrowserArtefacts({ error: e }));
        }
    }
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

export function getMyArtefacts() {
    return async function (dispatch, getState) {
        const { user: { username: curUserUsername } } =
            getState().auth;

        dispatch(reqGetMyArtefacts());

        try {
            const myArtefacts = await getArtefacts({
                user: curUserUsername,
                vis: ["public", "private",], //"family"
            });
            dispatch(resGetMyArtefacts(myArtefacts));

            // this prevents a special case where a user starts logged in
            // and stays on 'UserView', and then is logged out.
            const publicArts = myArtefacts
                .filter(art => art.visibility === 'public');

            dispatch(resUserArtefacts(curUserUsername, publicArts));
        }
        catch (e) {
            // TODO
            dispatch(errGetMyArtefacts());
        }
    }
}

function reqGetArtefact(id) {
    return {
        type: artefactTypes.REQ_GET_ARTEFACT,
        id,
    };
}

function resGetArtefact(artefact) {
    return {
        type: artefactTypes.RES_GET_ARTEFACT,
        artefact,
    };
}

function errGetArtefact(id, error) {
    return {
        type: artefactTypes.ERR_GET_ARTEFACT,
        id,
        error,
    };
}

export function getArtefact(id) {
    return async function (dispatch, getState) {
        dispatch(reqGetArtefact(id));
        const artIdCache = getState().art.artIdCache;

        if (artIdCache[id] !== undefined) {
            dispatch(resGetArtefact(artIdCache[id]));
            return;
        }

        try {
            const art = await apiGetArtefact(id);
            dispatch(resGetArtefact(art));
        } catch (e) {
            dispatch(errGetArtefact(id, e));
        }
    }
}

function setPublicArtefacts(publicArts) {
    return {
        type: artefactTypes.RES_GET_PUBLIC_ARTEFACTS,
        artefacts: publicArts,
    }
}

function reqGetPublicArtefacts() {
    return {
        type: artefactTypes.REQ_GET_PUBLIC_ARTEFACTS,
    }
}

function resGetPublicArtefacts(publicArts) {
    return {
        type: artefactTypes.RES_GET_PUBLIC_ARTEFACTS,
        artefacts: publicArts,
    }
}

function errGetPublicArtefacts() {
    return {
        type: artefactTypes.ERR_GET_PUBLIC_ARTEFACTS,
    }
}

export function getPublicArtefacts() {
    return async function (dispatch) {
        dispatch(reqGetPublicArtefacts());

        try {
            const publicArts = await getArtefacts();
            dispatch(resGetPublicArtefacts(publicArts));
        }
        catch (e) {
            // TODO
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

// addMyArtefact, but synchronise 'state.art.browserArts' and
// 'state.art.userArts' if newArtefact is public
export function addMyArtefactSync(newArtefact) {
    return async function (dispatch, getState) {

        dispatch(addMyArtefact(newArtefact));

        if (newArtefact.vis === "public") {

            const { art:
                { publicArts: { artefacts: publicArtefacts } }
            } = getState();

            updatePublicArts(newArtefact, publicArtefacts, dispatch);

            const { art: { userArts } } = getState();

            // if the user doesn't already artefacts stored in 'userArts',
            // just let it be fetched from server - REQ_GET_USER_ARTEFACTS
            if (userArts[newArtefact.owner.username]) {
                const userArtefacts =
                    userArts[newArtefact.owner.username].artefacts;

                updateUserArts(newArtefact, userArtefacts, dispatch);
            }
        }
    }
}

function updatePublicArts(newArtefact, publicArtefacts, dispatch) {
    const newPubArts = updateOrPush(newArtefact, publicArtefacts);

    dispatch(setPublicArtefacts(newPubArts))
}

function updateUserArts(newArtefact, userArtefacts, dispatch) {
    const newUserArts = 
        updateOrPush(newArtefact, userArtefacts);

    dispatch(resUserArtefacts(
        newArtefact.owner.username, newUserArts,
    ));
}

export function updateOrPush(art, artList) {
    const artIndex = 
        artList.findIndex((a) => a.id == art.id);

    if (artIndex === -1) {
        artList.push(art);
    }
    else {
        artList[artIndex] = art;
    }

    return artList;
}

function reqCreateMyArtefact() {
    return {
        type: artefactTypes.REQ_CREATE_MY_ARTEFACTS,
        loading: true,
    }
}

function resCreateMyArtefact(createdArtefact) {
    return {
        type: artefactTypes.RES_CREATE_MY_ARTEFACTS,
        createdArtefact,
    }
}

// returns the created artefact
export function createMyArtefact(newArtefact, docs) {
    return async function (dispatch, getState) {
        dispatch(reqCreateMyArtefact())

        const postedArtefact = await postArtefactAndCategories(newArtefact);
        const postedDocs = await submitDocs(postedArtefact.id, docs);

        postedArtefact.images = postedDocs;

        dispatch(addMyArtefactSync(postedArtefact));
        dispatch(resCreateMyArtefact(postedArtefact));

        return getState().art.myArts.create.createdArtefact;
    }
}

// function updateCachedArtefact(artefact) {
//     return {
//         type: artefactTypes.UPDATE_MY_ARTEFACTS,
//         artefact,
//     }
// }

function updateMyArtefact(updatedArtefact) {
    return {
        type: artefactTypes.UPDATE_MY_ARTEFACTS,
        artefact: updatedArtefact,
    }
}

export function updateMyArtefactSync(updatedArtefact, docs) {
    return async function (dispatch, getState) {
        console.log('updating sync');
        const patchedArt = await patchArtefactAndCategories(
            updatedArtefact, 
            getState().art.artIdCache[updatedArtefact.id]
        );

        dispatch(updateMyArtefact(patchedArt));

        if (updatedArtefact.vis === "public") {
            const { art:
                { publicArts: { artefacts: publicArtefacts } }
            } = getState();

            updatePublicArts(updatedArtefact, publicArtefacts, dispatch);

            const { art: { userArts } } = getState();

            // if the user doesn't already artefacts stored in 'userArts',
            // just let it be fetched from server - REQ_GET_USER_ARTEFACTS
            if (userArts[updatedArtefact.owner.username]) {
                const userArtefacts =
                    userArts[updatedArtefact.owner.username].artefacts;

                updateUserArts(updatedArtefact, userArtefacts, dispatch);
            }
        }

        // dispatch(updateCachedArtefact(patchedArt));
    }
}

async function submitDocs(artefactId, docs) {
    let promises = [];

    for (let doc of Object.values(docs)) {
        promises.push(addArtefactImage(artefactId, doc.blob));
    }

    return await Promise.all(promises);
}

function reqUserArtefacts(username) {
    return {
        type: artefactTypes.REQ_GET_USER_ARTEFACTS,
        username,
    }
}

function resUserArtefacts(username, userArtefacts) {
    return {
        type: artefactTypes.RES_GET_USER_ARTEFACTS,
        username,
        userArtefacts,
    }
}

function errGetUserArtefacts(username) {
    return {
        type: artefactTypes.ERR_GET_USER_ARTEFACTS,
        username,
    }
}

export function getUserArtefacts(username, vis) {
    return async function (dispatch) {
        dispatch(reqUserArtefacts(username));

        try {
            const userArtefacts = await getArtefacts({ user: username, vis: vis });
            dispatch(resUserArtefacts(username, userArtefacts));
        }
        catch (e) {
            // TODO
            dispatch(errGetUserArtefacts());
        }
    }
}

function isCurUser(username) {
    return function (dispatch, getState) {
        return getState().auth.user.username === username;
    }
}

// gets user artefacts or myartefacts, depending on login state
export function getUserOrMyArtefacts(username, vis) {
    return async function (dispatch) {
        if (dispatch(isCurUser(username))) {
            return dispatch(getMyArtefacts());
        }
        else {
            return dispatch(getUserArtefacts(username, "public"));
        }
    }
}

export const setFilter = (filterDetails) => {
    return {
        type: artefactTypes.SET_FILTER,
        filterDetails,
    };
}

export const setCategoriesCache = (categories) => {
    return {
        type: artefactTypes.SET_CATEGORIES_CACHE,
        categories,
    }
}

