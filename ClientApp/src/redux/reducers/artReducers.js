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
                    ...state.myArts,
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
        case artefactTypes.RES_CREATE_MY_ARTEFACTS:
            return {
                ...state,
                myArts: {
                    ...state.myArts,
                    create: {
                        ...state.myArts.create,
                        loading: false,
                        createdArtefact: action.createdArtefact,
                    },
                },
            }
        case artefactTypes.REQ_CREATE_MY_ARTEFACTS:
            return {
                ...state,
                myArts: {
                    ...state.myArts,
                    create: {
                        ...state.myArts.create,
                        createdArtefact: action.createdArtefact,
                        loading: true,
                    },
                },
            }
        case artefactTypes.SET_PUBLIC_ARTEFACTS:
            return {
                ...state,
                publicArts: {
                    artefacts: action.artefacts,
                    ...state.publicArts,
                },
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
                        loading: false,
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
        case artefactTypes.REQ_GET_BROWSER_ARTEFACTS:
            return {
                ...state,
                browserArts: {
                    ...state.browserArts,
                    loading: true,
                    query: action.query
                },
            }
        case artefactTypes.RES_GET_BROWSER_ARTEFACTS:
            return {
                ...state,
                browserArts: {
                    ...state.browserArts,
                    browserArtefacts: action.browserArtefacts,
                    loading: false,
                },
            }
        case artefactTypes.ERR_GET_BROWSER_ARTEFACTS:
            return {
                ...state,
                browserArts: {
                    ...state.browserArts,
                    error: true,
                },
            }
        case artefactTypes.SET_FILTER:
            return {
                ...state,
                browserArts: {
                    ...state.browserArts,
                    filterDetails: action.filterDetails,
                },
            }
        case artefactTypes.SET_CATEGORIES_CACHE:
            return {
                ...state,
                cache: {
                    ...state.cache,
                    categories: action.categories,
                },
            }
        default:
            return state
    }
}

export {
    art,
}