import { artefactTypes } from '../actions/types';
import getInitArtState from './initArtState'

function art(state = getInitArtState(), action) {
    switch (action.type) {
        case artefactTypes.REQ_GET_MY_ARTEFACTS:
            return {
                ...state,
                loading: true,
            };
        case artefactTypes.RES_GET_MY_ARTEFACTS:
            return {
                ...state,
                loading: false,
                myArtefacts: action.myArtefacts,
            };
        case artefactTypes.ADD_MY_ARTEFACTS:
            console.log('state in reducer');
            console.log(state);
            const updatedMyArtefacts =
                [action.newArtefact, ...state.myArtefacts];
            const obj = {
                ...state,
                myArtefacts: updatedMyArtefacts,
            }
            console.log(obj);
            return obj;
        default:
            return state
    }
}

export {
    art,
}