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

    case discussTypes.REQ_GET_DISCUSSION:
        return {
            ...state,
            [action.artefactId]: null,
        };

    case discussTypes.RES_GET_DISCUSSION:
        return {
            ...state,
            [action.artefactId]: { tree: action.tree },
        };

    case discussTypes.ERR_GET_DISCUSSION:
        return {
            ...state,
            [action.artefactId]: { error: action.error },
        };

    case discussTypes.REQ_POST_DISCUSSION:
        action.item.replies = action.item.replies || [];
        action.item.loading = true;
        return {
            ...state,
            [action.item.artefact]: {
                tree:   addInTree(
                            state[action.item.artefact].tree,
                            action.item,
                        ),
            },
        };

    case discussTypes.RES_POST_DISCUSSION:
        let newItem = {
            ...action.newItem,
            loading: undefined,
        };
        return {
            ...state,
            [action.item.artefact]: {
                tree:   placeInTree(
                            state[action.item.artefact].tree,
                            action.item.id,
                            newItem
                        ),
            },
        };

    case discussTypes.ERR_POST_DISCUSSION:
        return {
            ...state,
            [action.item.artefact]: {
                tree:   placeInTree(
                            state[action.item.artefact].tree,
                            action.item.id,
                            {
                                ...action.item,
                                loading: undefined,
                                error: `${action.error}`
                            }
                        ),
            },
        };

    case discussTypes.REQ_MARK_ANSWER:
        console.log(`PARENT: ${action.answer.parent}`);
        console.log(`idh: ${JSON.stringify({ ...action.question, parent: "<parent>", replies: [] })}`);
        const intermediateTree = placeInTree(
                                    state[action.question.artefact].tree,
                                    action.answer.id,
                                    {
                                        ...action.answer,
                                        isAnswer: true,
                                        loading: true,
                                    }
                                );
        action.question.answer = true;
        return {
            ...state,
            [action.question.artefact]: {
                tree:   placeInTree(
                            intermediateTree,
                            action.question.id,
                            action.question
                        ),
            },
        };

    case discussTypes.RES_MARK_ANSWER:
        console.log(`PARENT: ${action.answer.parent}`);
        console.log(`action.question.answer: ${action.question.answer}`);
        return {
            ...state,
            [action.question.artefact]: {
                tree:   placeInTree(
                            state[action.question.artefact].tree,
                            action.answer.id,
                            {
                                ...action.answer,
                                isAnswer: true,
                                loading: undefined,
                            }
                        ),
            }
        };

    case discussTypes.ERR_MARK_ANSWER:
        return {
            ...state,
            [action.question.artefact]: {
                tree:   placeInTree(
                            state[action.question.artefact].tree,
                            action.answer.id,
                            {
                                ...action.answer,
                                isAnswer: false,
                                loading: undefined,
                                error: `${action.error}`
                            },
                        ),
            }
        };

    default:
        return state;

    }

}

