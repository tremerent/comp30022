import { discussTypes } from '../actions/types';
import getInitDiscussState from './initDiscussState.js';

//// Starting at a (new) leaf item, iterate backwards to construct a new tree
//// matching the old one, except with the new item added.
//// This is pretty inefficient, but if we wanted efficiency we wouldn't be using
//// redux :P
//// -- Sam
//function addInTree(tree, item) {
//    let newTree = item;
//    // TODO(sam): sort order of replies.
//    while (newTree.parent)
//        newTree = {
//            ...newTree.parent,
//            replies: [
//                newTree,
//                ...newTree.parent.replies
//            ],
//        };
//    return [ ...tree.filter(x => x.id !== newTree.id), newTree ];
//}


function replaceInTree(tree, oldItem, newItem) {

    if (!oldItem.parent) {
        let newTreeTop = [];
        for (const item of tree) {
            if (item.id === oldItem.id) {
                newTreeTop.push(newItem);
            } else
                newTreeTop.push(item);
        }
        return newTreeTop;
    }

    let newTree = { ...newItem };

    while (newTree.parent) {
        newTree = { ...newTree.parent };
        let newReplies = [];
        for (const reply of newTree.replies)
            newReplies.push(reply.id === oldItem.id ? newItem : reply);
        newTree.replies = newReplies;
    }

    return newTree;
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
        // Yes, we are modifying the redux store in-place. I contest that this
        // is acceptable because the discussion tree is not really something
        // we'd ever want to do redux's "time travel" thing on, and because
        // the alternative is extremely inefficient and convoluted (see the
        // commented code above, which is as far as I got before giving up).
        let item = action.item;
        item.loading = true;
        if (!item.replies)
            item.replies = [];
        if (item.parent) {
            item.parent.replies = [ item, ...item.parent.replies ];
            return state;
        }
        return {
            ...state,
            [item.artefact]: {
                ...state[item.artefact],
                tree: [
                    item,
                    ...state[item.artefact].tree
                ],
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
                tree:   replaceInTree(
                            state[action.item.artefact].tree,
                            action.item,
                            newItem
                        ),
            },
        };

    case discussTypes.ERR_POST_DISCUSSION:
        return {
            ...state,
            [action.item.artefact]: {
                tree:   replaceInTree(
                            state[action.item.artefact].tree,
                            action.item,
                            {
                                ...action.item,
                                loading: undefined,
                                error: `${action.error}`
                            }
                        ),
            },
        };

    default:
        return state;

    }

}

