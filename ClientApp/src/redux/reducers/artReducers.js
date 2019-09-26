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
                ...state,
            }
        case artefactTypes.ADD_MY_ARTEFACTS:
            const updatedMyArtefacts =
                [action.newArtefact, ...state.myArts.myArtefacts];

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
                artefacts: {
                    ...state.artefacts,
                    loading: true,
                }
            };
        case artefactTypes.RES_GET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                publicArts: {
                    artefacts: action.artefacts,
                    loading: false,
                },
            };
        case artefactTypes.ERR_GET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                // TODO
            }
        case artefactTypes.REQ_GET_USER_ARTEFACTS:
            return {
                ...state,
                userArts: {
                    ...state.userArts,
                    [action.username]: {
                        artefacts: [],
                        loading: true,
                    },
                },
            }
        case artefactTypes.RES_GET_USER_ARTEFACTS:
            return {
                ...state,
                userArts: {
                    ...state.userArtefacts,
                    [action.username]: {
                        artefacts: action.userArtefacts,
                        loading: true,
                    },
                },
            }
        case artefactTypes.ERR_GET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                userArts: {
                    ...state.userArtefacts,
                    [action.username]: {
                        error: true,
                    },
                },
            }
        default:
            return state
    }
}

export {
    art,
}