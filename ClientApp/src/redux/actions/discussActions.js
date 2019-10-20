import { getDiscussion as apiGetDiscussion, postDiscussion as apiPostDiscussion } from '../../scripts/requests.js';
import { discussTypes } from './types.js';


const reqGetDiscussion = (artefactId) => ({
    type: discussTypes.REQ_GET_DISCUSSION,
    artefactId,
});

const resGetDiscussion = (artefactId, tree) => ({
    type: discussTypes.RES_GET_DISCUSSION,
    artefactId,
    tree,
});

const errGetDiscussion = (artefactId, error) => ({
    type: discussTypes.ERR_GET_DISCUSSION,
    artefactId,
    error,
});

export function getDiscussion(artefactId) {
    return async (dispatch, getState) => {
        const state = getState();

        if (state[artefactId] !== undefined && !state[artefactId].error)
            return;

        dispatch(reqGetDiscussion(artefactId));

        try {
            const tree = await apiGetDiscussion(artefactId);
            dispatch(resGetDiscussion(artefactId, tree));
        } catch (e) {
            dispatch(errGetDiscussion(artefactId, e));
        }
    }
}


const reqPostDiscussion = (item) => ({
    type: discussTypes.REQ_POST_DISCUSSION,
    item,
});

const resPostDiscussion = (item, newItem) => ({
    type: discussTypes.RES_POST_DISCUSSION,
    item,
    newItem,
});

const errPostDiscussion = (item, error) => ({
    type: discussTypes.ERR_POST_DISCUSSION,
    item,
    error,
});

export function postDiscussion(item) {
    return async (dispatch, getState) => {
        dispatch(reqPostDiscussion(item));

        try {
            const response = await apiPostDiscussion(item);
            dispatch(resPostDiscussion(item, response));
        } catch (e) {
            dispatch(errPostDiscussion(item, `${e}`));
        }
    };
}

