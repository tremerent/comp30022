import { discussTypes } from '../actions/types';
import getInitDiscussState from './initArtState';

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
            [action.artefactId]: action.tree,
        };

    case discussTypes.ERR_GET_DISCUSSION:
        return {
            ...state,
            [action.artefactId]: { error: action.error },
        };

    default:
        return state;

    }

}

