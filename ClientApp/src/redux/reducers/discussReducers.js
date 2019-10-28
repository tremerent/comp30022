import { discussTypes } from '../actions/types';
import getInitDiscussState from './initDiscussState.js';

function pnode(node) {
    return `[${node.objId}].[${node.body}]`;
}

// Returns a copy of `tree` with any top-level nodes that have id `oldId`
// replaced by `child`.
function placeAtTopLevel(tree, oldId, child) {
    let newTreeTop = [];
    let replaced = false;
    for (const item of tree) {
        if (item.id === oldId) {
            newTreeTop.push(child);
            replaced = true;
        } else {
            newTreeTop.push(item);
        }
    }

    if (!replaced) {
        newTreeTop.unshift(child);
    }

    return newTreeTop;
}

// Returns a copy of `node`, with any child artefacts that have id `oldId`
// replaced by the new `child`.
function placeAtNode(node, oldId, child) {

    let newNode = { ...node, replies: [] };

    let replaced = false;
    for (let reply of node.replies) {
        if (reply.id === oldId) {
            // Mumble mumble garbage collection mumble mumble.
            //reply.parent = null;
            child.parent = newNode;
            newNode.replies.push(child);
            replaced = true;
        } else {
            reply.parent = newNode;
            newNode.replies.push(reply);
        }
    }

    if (!replaced)
        newNode.replies.unshift(child);

    return newNode;
}

// Takes a `newItem` (which should have newItem.parent set appropriately to
// define the item's position in the tree), and rebuilds `tree` with `newItem`
// in the place of any child of `newItem.parent` with id `oldId`.
function placeInTree(tree, oldId, newItem) {
    if (!newItem.parent)
        return placeAtTopLevel(tree, oldId, newItem);

    let newParent = placeAtNode(newItem.parent, oldId, newItem);

    return placeInTree(tree, newParent.id, newParent);
}

function addInTree(tree, item) {
    if (item.parent) {
        const oldParent = item.parent;
        item.parent = { ...oldParent, replies: [ item, ...oldParent.replies ] };
        return placeInTree(
            tree,
            item.parent.id,
            item.parent,
        );
    }
    return [ item, ...tree ];
    return placeInTree(tree, null, item);
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
                            ...stateItems, [item.id]: item
                        }), { }
                    );

        for (const item of action.items) {
            if (item.answer)
                items[item.answer].answers = item.id;
        }

        return {
            ...state,
            [action.artefactId]: { items },
        };
    }

    case discussTypes.ERR_GET_DISCUSSION: {
        return {
            ...state,
            [action.artefactId]: { error: action.error },
        };
    }

    case discussTypes.REQ_POST_DISCUSSION: {
        let newItems = state[action.item.artefact].items;
        newItems[action.item.id] = {
            replies: [],
            ...action.item,
            loading: true,
        };
        if (action.item.parent) {
            if (!newItems[action.item.parent])
                newItems[action.item.parent] = { };
            newItems[action.item.parent] = {
                ...newItems[action.item.parent],
                replies: [
                    ...newItems[action.item.parent].replies,
                    action.item.id,
                ],
            };
        }

        return {
            ...state,
            [action.item.artefact]: {
                items: newItems,
            },
        };
    }

    case discussTypes.RES_POST_DISCUSSION: {
        const oldItem = state[action.item.artefact].items[action.item.id];
        let newItems = state[action.item.artefact].items;
        newItems[action.newItem.id] = {
            ...action.newItem,
            loading: false,
        };
        delete newItems[action.item.id];

        if (oldItem.parent) {
            let parentReplies = [];
            for (const reply of newItems[oldItem.parent])
                if (reply.id !== oldItem.id)
                    parentReplies.push(reply);
            newItems[oldItem.parent].replies = parentReplies;
        }

        return {
            ...state,
            [action.item.artefact]: {
                items: newItems,
            },
        };
    }

    case discussTypes.ERR_POST_DISCUSSION: {
        return {
            ...state,
            [action.item.artefact]: {
                items: {
                    ...state[action.item.artefact].items,
                    [action.item.id]: {
                        ...state[action.item.artefact].items[action.item.id],
                        loading: false,
                        error: `${action.error}`,
                    },
                },
            },
        };
    }

    case discussTypes.REQ_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: {
                items: {
                    ...state[q.artefact].items,
                    [q.id]: {
                        ...state[q.artefact].items[q.id],
                        answer: a.id,
                    },
                    [a.id]: {
                        ...state[a.artefact].items[a.id],
                        answers: q.id,
                        loading: true,
                    },
                },
            },
        };
    }

    case discussTypes.RES_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: {
                items: {
                    ...state[q.artefact].items,
                    [q.id]: {
                        ...state[q.artefact].items[q.id],
                        answer: a.id,
                    },
                    [a.id]: {
                        ...state[a.artefact].items[a.id],
                        answers: q.id,
                        loading: false,
                    },
                },
            },
        };
    }

    case discussTypes.ERR_MARK_ANSWER: {
        const q = action.question;
        const a = action.answer;
        return {
            ...state,
            [q.artefact]: {
                items: {
                    ...state[q.artefact].items,
                    [q.id]: {
                        ...state[q.artefact].items[q.id],
                        answer: null,
                    },
                    [a.id]: {
                        ...state[a.artefact].items[a.id],
                        answers: null,
                        loading: false,
                        error: `${action.error}`,
                    },
                },
            },
        };
    }

    default:
        return state;

    }

}

