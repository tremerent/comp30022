import {
    getUser as fetchUser,
    patchUserInfo,
    setProfileImage,
} from '../../scripts/requests';
import { usersTypes, } from './types';

export function reqGetUser(username) {
    return {
        type: usersTypes.REQ_GET_USER,
        username,
    }
}

export function resGetUser(user) {
    return {
        type: usersTypes.RES_GET_USER,
        user,
    }
}

export function errGetUser(username) {
    return {
        type: usersTypes.ERR_GET_USER,
        username,
    }
}

export function getUser(username) {
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

export function updateCurUserDetails(newDetails) {
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

export function updateCurUserProfilePic(file) {
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

export const users = {
    reqGetUser,
    resGetUser,
    errGetUser,
    getUser,
    updateCurUserDetails,
    updateCurUserProfilePic,
};