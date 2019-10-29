import { discussTypes } from '../actions/types';
import getInitDiscussState from './initDiscussState.js';

function addIfNew(array, item) {
    if (!array.find(x => x === item))
        array.unshift(item);
    return array;
}

function addToTree(_discuss, _item) {
    let items = { ..._discuss.items };
    let discuss = { ..._discuss, items };
    let item = { ..._item };

    items[item.id] = item;
    if (item.parent) {
        items[item.parent] = { ...items[item.parent] };
        items[item.parent].replies =
            addIfNew([ ...items[item.parent].replies ], item.id)
    } else {
        discuss.topLevel = addIfNew([ ...discuss.topLevel ], item.id);
    }
    if (item.replies)
        for (const replyId of item.replies) if (items[replyId])
            items[replyId] = { ...items[replyId], parent: item.id };

    return discuss;
}

function removeFromTree(_discuss, itemId) {
    let items = { ..._discuss.items };
    let discuss = { ..._discuss, items };

    const item = items[itemId];

    if (item.parent)
        items[item.parent] = {
            ...items[item.parent],
            replies: items[item.parent].replies.filter(x => x != itemId),
        };
    else
        discuss.topLevel = discuss.topLevel.filter(x => x != itemId);
    if (item.replies)
        for (let replyId of item.replies) if (items[replyId])
            items[replyId] = {
                ...items[replyId], parent: null
            };
    delete items[itemId];
    return discuss;
}

export function discuss(state = getInitDiscussState(), action) {

    switch (action.type) {

    case discussTypes.REQ_GET_DISCUSSION: {
        return {
            ...state,
            [action.artefactId]: { loading: true },
        };
    }

    case discussTypes.RES_GET_DISCUSSION: {

        let items = action.items.reduce(
                        (stateItems, item) => ({
                            ...stateItems, [item.id]: {
                                replies: [], parent: null, ...item,
                            }
                        }), { }
                    );

        for (const item of action.items) {
            if (item.answer)
                items[item.answer].answers = item.id;
        }

        return {
            ...state,
            [action.artefactId]: {
                items,
                topLevel: Object.getOwnPropertyNames(items)
                            .filter(item => !items[item].parent),
            },
        };
    }

    case discussTypes.ERR_GET_DISCUSSION: {
        return {
            ...state,
            [action.artefactId]: { error: action.error },
        };
    }

    case discussTypes.REQ_POST_DISCUSSION: {
        const newState = {
            ...state,
            [action.item.artefact]: addToTree(
                    state[action.item.artefact],
                    { replies: [], ...action.item, loading: true }
                ),
        };
        return newState;
    }

    case discussTypes.RES_POST_DISCUSSION: {
        return {
            ...state,
            [action.item.artefact]: addToTree(
                    removeFromTree(state[action.item.artefact], action.item.id),
                    { ...action.newItem, loading: false }
                ),

        };
    }

    case discussTypes.ERR_POST_DISCUSSION: {
        return {
            ...state,
            [action.item.artefact]: addToTree(
                    state[action.item.artefact],
                    {
                        ...state[action.item.artefact]
                            .items[action.item.id],
                        loading: false,
                        error: `${action.error}`,
                    }
                ),
        };
    }

    case discussTypes.REQ_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: addToTree(
                    addToTree(
                        state[q.artefact],
                        {
                            ...state[q.artefact].items[q.id],
                            answer: a.id,
                        }
                    ),
                    {
                        ...state[a.artefact].items[a.id],
                        answers: q.id,
                        loading: true,
                    }
                ),
        };
    }

    case discussTypes.RES_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: addToTree(
                    addToTree(
                        state[q.artefact],
                        {
                            ...state[q.artefact].items[q.id],
                            answer: a.id,
                        }
                    ),
                    {
                        ...state[a.artefact].items[a.id],
                        answers: q.id,
                        loading: false,
                    }
                ),
        };
    }

    case discussTypes.ERR_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: addToTree(
                    addToTree(
                        state[q.artefact],
                        {
                            ...state[q.artefact].items[q.id],
                            answer: a.id,
                        }
                    ),
                    {
                        ...state[a.artefact].items[a.id],
                        answers: q.id,
                        loading: true,
                        error: `${action.error}`,
                    }
                ),
        };
    }

    default:
        return state;

    }

}

