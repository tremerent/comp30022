import { push } from 'connected-react-router';
import { authTypes, artefactTypes, usersTypes } from './types';
import { setUser, logoutUser, } from '../../scripts/auth';
import { push } from 'connected-react-router';
import * as discuss from './discussActions.js';

import {
    postArtefactAndCategories,
    postRegister,
    getArtefacts,
    getUser as fetchUser,
    patchUserInfo,
    setProfileImage,
    getArtefact as apiGetArtefact,
    addArtefactImage,
} from '../../scripts/requests';
import { sortOptions, getQueryDetails, } from 'components/Shared/filterUtils';

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
            await dispatch(login(registerData));

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

function getBrowserArtefacts(queryKeyValues) {
    return async function(dispatch) {
        dispatch(reqGetBrowserArtefacts(queryKeyValues))

        try {
            const browserArtefacts = await getArtefacts(queryKeyValues);

            dispatch(resGetBrowserArtefacts(browserArtefacts));
        }
        catch(e) {
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

function getMyArtefacts() {
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

function getArtefact(id) {
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

function getPublicArtefacts() {
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
function addMyArtefactSync(newArtefact) {
    return async function (dispatch, getState) {

        dispatch(addMyArtefact(newArtefact));

        if (newArtefact.vis === "public") {

            updatePublicArts();
            updateUserArts();
        }

        function updatePublicArts() {
            const { art:
                { publicArts: { artefacts: publicArtefacts } }
            } = getState();

            dispatch(setPublicArtefacts([newArtefact, ...publicArtefacts]))
        }

        function updateUserArts() {
            const { art: { userArts } } = getState();

            // if the user doesn't already artefacts stored in 'userArts',
            // just let it be fetched from server - REQ_GET_USER_ARTEFACTS
            if (userArts[newArtefact.owner.username]) {
                const userArtefacts =
                    userArts[newArtefact.owner.username].artefacts;

                if (userArtefacts) {
                    dispatch(resUserArtefacts(
                        newArtefact.owner.username,
                        [newArtefact, userArtefacts],
                    ));
                }
            }
        }
    }
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
function createMyArtefact(newArtefact, docs) {
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

function getUserArtefacts(username, vis) {
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
function getUserOrMyArtefacts(username, vis) {
    return async function (dispatch) {
        if (dispatch(isCurUser(username))) {
            return dispatch(getMyArtefacts());
        }
        else {
            return dispatch(getUserArtefacts(username, "public"));
        }
    }
}

const setFilter = (filterDetails) => {
    return {
        type: artefactTypes.SET_FILTER,
        filterDetails,
    };
}

const setCategoriesCache = (categories) => {
    return {
        type: artefactTypes.SET_CATEGORIES_CACHE,
        categories,
    }
}

const artefacts = {
    createMyArtefact,
    getMyArtefacts,
    addMyArtefactSync,
    getPublicArtefacts,
    getUserArtefacts,
    getBrowserArtefacts,
    getUserOrMyArtefacts,
    setFilter,
    setCategoriesCache,
    getArtefact,
};

function reqGetUser(username) {
    return {
        type: usersTypes.REQ_GET_USER,
        username,
    }
}

function resGetUser(user) {
    return {
        type: usersTypes.RES_GET_USER,
        user,
    }
}

function errGetUser(username) {
    return {
        type: usersTypes.ERR_GET_USER,
        username,
    }
}

function getUser(username) {
    return async function(dispatch) {
        dispatch(reqGetUser(username));

        try {
            const user = await fetchUser(username);

            dispatch(resGetUser(user));
        }
        catch (e) {
            // TODO
            dispatch(errGetUser(username));
        }
    }
}

function reqPatchUserDetails(username) {
    return {
        type: usersTypes.REQ_PATCH_USER_DETAILS,
        username,
    }
}

function resPatchUserDetails(username, patchedDetails) {
    return {
        type: usersTypes.RES_PATCH_USER_DETAILS,
        username,
        patchedDetails,
    }
}

function errPatchUserDetails(username) {
    return {
        type: usersTypes.ERR_PATCH_USER_DETAILS,
        username,
    }
}

function updateCurUserDetails(newDetails) {
    return async function(dispatch, getState) {
        const curUserName = getState().auth.user.username;

        dispatch(reqPatchUserDetails(curUserName));

        try {
            await patchUserInfo(curUserName, newDetails);

            dispatch(resPatchUserDetails(curUserName, newDetails));
        }
        catch (e) {
            // unauthed or other?
            dispatch(errPatchUserDetails(curUserName));
        }
    }
}

function updateCurUserProfilePic(file) {
    return async function(dispatch, getState) {
        const curUserName = getState().auth.user.username;

        dispatch(reqPatchUserDetails(curUserName));

        try {
            const respData = await setProfileImage(file);

            dispatch(resPatchUserDetails(curUserName, {
                imageUrl: respData.url,
            }));
        }
        catch (e) {
            // unauthed or other?
            dispatch(errPatchUserDetails(curUserName));
        }
    }
}

const users = {
    reqGetUser,
    resGetUser,
    errGetUser,
    getUser,
    updateCurUserDetails,
    updateCurUserProfilePic,
};

function browserTuteApplyAnswerQEffects() {
    return function(dispatch, getState) {

        const filterDetails = () => getState().art.browserArts.filterDetails;

        // sort by question count
        dispatch(setFilter({
            ...filterDetails(),
            sortQuery: {
                ...sortOptions.filter(sortOpt => sortOpt.name == 'questionCount')[0],
                order: 'desc',
            },
        }));

        // submit filter
        dispatch(getBrowserArtefacts(getQueryDetails(filterDetails())));
    }
}

function browserTuteApplyFilterCatEffects() {
    return function(dispatch, getState) {
        const filterDetails = () => getState().art.browserArts.filterDetails;

        const state = getState();

        const categories = state.art.cache.categories;
        const filterCategories = [];

        // check undefined
        if (categories != null && categories.length) {
            const numCats = randNumMax(2) + 1;  // shouldn't have 0 categories

            for (let i = 0; i < numCats; i++) {
                const randCat = categories[randNumMax(categories.length)];

                // skip duplicates - note we don't use 'includes' since this
                // checks for strict equality (same obj.)
                if (!filterCategories.find(cat => cat.id === randCat.id)) {
                    filterCategories.push(randCat);
                }
            }
        }

        // doesn't include 'n'
        function randNumMax(n) {
            return Math.floor(Math.random() * Math.floor(n));
        }

        // sort by comment count
        dispatch(setFilter({
            ...filterDetails(),
            category: filterCategories.map(
                // filter takes opts with same label/value
                ({ id, name }) => ({ value: name, label: name })
            ),
            sortQuery: {
                ...sortOptions.filter(sortOpt => sortOpt.name == 'commentCount')[0],
                order: 'desc',
            },
        }));

        // submit filter
        dispatch(getBrowserArtefacts(getQueryDetails(filterDetails())));
    }
}

function toggleBrowserTuteApplyAnswerQ() {
    return function (dispatch, getState) {
        const browserTute = () => getState().tute.browserTute;

        // if user just completed the lesson's action, just run the tute
        // and return early
        const answerQTtOpen = browserTute().answerQuestion.toolTipOpen;
        if (answerQTtOpen) {
            dispatch(browserTuteRunState());
            return;
        }

        const findInterLessonActive = browserTute().findInter.lessonActive;
        // toggle other lesson type off
        if (findInterLessonActive) {
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
        }

        // toggle this lesson type on and apply effects
        dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        if (browserTute().answerQuestion.lessonActive) {
            dispatch(browserTuteApplyAnswerQEffects());
        }
    }
}

function toggleBrowserTuteApplyFindInter() {
    return function (dispatch, getState) {
        const browserTute = () => getState().tute.browserTute;

        // if user just completed the lesson's action, just run the tute
        // and return early
        const findInterTtOpen = browserTute().findInter.toolTipOpen;
        if (findInterTtOpen) {
            dispatch(browserTuteRunState());
            return;
        }

        const answerQLessonActive = browserTute().answerQuestion.lessonActive;
        // toggle other lesson type off
        if (answerQLessonActive) {
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        }


        // toggle this lesson type on and apply effects
        dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
        if (browserTute().findInter.lessonActive) {
            dispatch(browserTuteApplyFilterCatEffects());
        }
    }
}

function browserTuteRunState() {
    return function(dispatch, getState) {
        const bTuteState = getState().tute.browserTute;

        const tuteAtInitState =
            !bTuteState.answerQuestion.toolTipOpen &&
            !bTuteState.sortArts.toolTipOpen &&
            !bTuteState.findInter.toolTipOpen &&
            !bTuteState.filterCats.toolTipOpen &&
            !bTuteState.search.toolTipOpen;

        // open current tooltip, close previous

        if (tuteAtInitState && !bTuteState.complete) {
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_TT });
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        }
        else if (bTuteState.answerQuestion.toolTipOpen) {
            dispatch(browserTuteApplyAnswerQEffects());

            // tooltips
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_TT });
            dispatch({ type: tuteTypes.TOGGLE_SORT_ARTS_TT });
        }
        else if (bTuteState.sortArts.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_SORT_ARTS_TT });
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_ARTS_TT });
        }
        else if (bTuteState.findInter.toolTipOpen) {

            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
            dispatch(browserTuteApplyFilterCatEffects());

            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_ARTS_TT });
            dispatch({ type: tuteTypes.TOGGLE_FILTER_CATS_TT });
        }
        else if (bTuteState.filterCats.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_FILTER_CATS_TT });
            dispatch({ type: tuteTypes.TOGGLE_SEARCH_TT });
        }
        else if (bTuteState.search.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_SEARCH_TT });
            // flag so tuteAtInitState not satisfied
            dispatch({ type: tuteTypes.BROWSER_TUTE_COMPLETE });
        }
    }
}

const tute = {
    browserTuteRunState,
    toggleBrowserTuteApplyAnswerQ,
    toggleBrowserTuteApplyFindInter,
};

export {
    auth,
    artefacts,
    users,
    tute,
};

