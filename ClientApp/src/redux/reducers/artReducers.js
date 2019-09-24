import { artefactTypes } from '../actions/types';
import getInitArtState from './initArtState'

function art(state = getInitArtState(), action) {
    switch (action.type) {
        case artefactTypes.REQ_GET_MY_ARTEFACTS:
            return {
                ...state,
                myArts: {
                    ...state.myArts,
                    loading: true,
                }
            };
        case artefactTypes.RES_GET_MY_ARTEFACTS:
            return {
                ...state,
                myArts: {
                    loading: false,
                    myArtefacts: action.myArtefacts,
                }
            };
        case artefactTypes.ERR_GET_MY_ARTEFACTS:
            return {
                // TODO
            }
        case artefactTypes.ADD_MY_ARTEFACTS:
            const updatedMyArtefacts =
                [action.newArtefact, ...state.myArtefacts];

            return {
                ...state,
                myArts: {
                    ...state.myArts,
                    myArtefacts: updatedMyArtefacts,
                }
            };
        case artefactTypes.REQ_GET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                publicArts: {
                    ...state.publicArts,
                    loading: true,
                }
            };
        case artefactTypes.RES_GET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                publicArts: {
                    loading: false,
                    publicArts: action.publicArts,
                }
            };
        case artefactTypes.ERR_GET_PUBLIC_ARTEFACTS:
            return {
                // TODO
            }
        default:
            return state
    }
}

export {
    art,
}