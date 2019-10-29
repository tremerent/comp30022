import {
    getDiscussion as apiGetDiscussion,
    postDiscussion as apiPostDiscussion,
    markAnswer as apiMarkAnswer,
    unmarkAnswer as apiUnmarkAnswer,
} from '../../scripts/requests.js';
import { discussTypes } from './types.js';


const reqGetDiscussion = (artefactId) => ({
    type: discussTypes.REQ_GET_DISCUSSION,
    artefactId,
});

const resGetDiscussion = (artefactId, items) => ({
    type: discussTypes.RES_GET_DISCUSSION,
    artefactId,
    items,
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
            const items = await apiGetDiscussion(artefactId);
            dispatch(resGetDiscussion(artefactId, items));
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

const reqMarkAnswer = (question, answer) => ({
    type: discussTypes.REQ_MARK_ANSWER,
    question,
    answer,
});

const resMarkAnswer = (question, answer, response) => ({
    type: discussTypes.RES_MARK_ANSWER,
    question,
    answer,
    response,
});

const errMarkAnswer = (question, answer, error) => ({
    type: discussTypes.ERR_MARK_ANSWER,
    question,
    answer,
    error,
});

export function markAnswer(question, answer) {
    //const question = { ..._question };
    //const answer = { ..._answer };
    return async (dispatch, getState) => {
        dispatch(reqMarkAnswer(question, answer));

        try {
            const response = await apiMarkAnswer(question, answer);
            dispatch(resMarkAnswer(question, answer, response));
            return;
        } catch (e) {
            dispatch(errMarkAnswer(question, answer, e));
        }
    };
}

const reqUnmarkAnswer = (answer) => ({
    type: discussTypes.REQ_UNMARK_ANSWER,
    answer,
});

const resUnmarkAnswer = (answer, response) => ({
    type: discussTypes.RES_UNMARK_ANSWER,
    answer,
    response,
});

const errUnmarkAnswer = (answer, error) => ({
    type: discussTypes.ERR_UNMARK_ANSWER,
    answer,
    error,
});

export function unmarkAnswer(answer) {
    return async (dispatch, getState) => {
        dispatch(reqUnmarkAnswer(answer));

        try {
            const response = await apiUnmarkAnswer(answer);
            dispatch(resUnmarkAnswer(answer, response));
            return;
        } catch (e) {
            dispatch(errUnmarkAnswer(answer, e));
        }
    };
}


