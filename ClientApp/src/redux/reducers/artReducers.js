import { authTypes } from '../actions/types';
import getInitArtState from './initArtState'

function art(state = getInitArtState(), action) {
    switch (action.type) {
        case authTypes.REQ_GET_MY_ARTEFACTS:
            return {
                ...state,
                loading: true,
            };
        case authTypes.RES_GET_MY_ARTEFACTS:
            return {
                ...state,
                loading: false,
                myArtefacts: action.myArtefacts,
            };
        default:
            return state
    }
}

export {
    art,
}