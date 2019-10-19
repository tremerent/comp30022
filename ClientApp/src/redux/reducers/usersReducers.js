import { usersTypes } from '../actions/types';
import getInitUsersState from './initUsersState'

function users(state = getInitUsersState(), action) {
    let stateUsers = {};  // copy of state.users to return

    function ensureObjHasAttrib(attrib, obj) {
        if (!obj[attrib]) {
            obj[attrib] = {};
        }
    }

    switch (action.type) {
        case usersTypes.REQ_GET_USER:
            stateUsers = state.users;
            ensureObjHasAttrib(action.username, stateUsers);


            stateUsers[action.username].loading = true;

            return {
                // TODO
                ...state,
                users: stateUsers,
            }
        case usersTypes.RES_GET_USER:
            stateUsers = state.users;

            stateUsers[action.user.username] = {
                ...action.user,
                loading: false,
            }

            return {
                // TODO
                ...state,
                users: stateUsers,
            }
        case usersTypes.ERR_GET_USER:
            // TODO

            stateUsers = state.users;
            ensureObjHasAttrib(action.username, stateUsers);

            stateUsers[action.username].error = true;

            return {
                ...state,
                users: stateUsers, 
            }
        case usersTypes.REQ_PATCH_USER_DETAILS:
            stateUsers = state.users;
            ensureObjHasAttrib(action.username, stateUsers);

            stateUsers[action.username] = {
                ...stateUsers[action.username],
                loading: true,
            }

            return {
                ...state,
                users: stateUsers,
            }
        case usersTypes.RES_PATCH_USER_DETAILS:
            
            stateUsers = state.users;
            ensureObjHasAttrib(action.username, stateUsers);

            stateUsers[action.username] = {
                ...stateUsers[action.username],
                ...action.patchedDetails,
                loading: false,
            }

            return {
                ...state,
                users: stateUsers,
            }
        case usersTypes.ERR_PATCH_USER_DETAILS:

            stateUsers = state.users;
            ensureObjHasAttrib(action.username, stateUsers);

            stateUsers[action.username].error = true;

            return {
                ...state,
                users: stateUsers, 
            }
        default:
            return state
    }
}

export {
    users,
}