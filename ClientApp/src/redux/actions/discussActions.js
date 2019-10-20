import { getDiscussion as apiGetDiscussion } from '../../scripts/requests.js';
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
    type: discussTypes.RES_ERR_DISCUSSION,
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

