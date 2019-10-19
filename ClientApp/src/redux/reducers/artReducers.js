import { artefactTypes } from '../actions/types';
import getInitArtState from './initArtState'
import { flatCombineReducers } from '../util.js';

function artMain(state = getInitArtState(), action) {
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
        default:
            return state
    }
}

function updateArtIdCache(state = getInitArtState(), action) {
    switch (action.type) {

    case artefactTypes.RES_GET_ARTEFACT:
        return {
            ...state,
            artIdCache: {
                ...state.artIdCache,
                [action.artefact.id]: action.artefact,
            },
        };

    case artefactTypes.RES_GET_MY_ARTEFACTS:
        return {
            ...state,
            artIdCache: {
                ... state.artIdCache,
                ... action.myArtefacts.reduce(
                        (cache, value) => ({ ...cache, [value.id]: value }),
                        { }
                    ),
            }
        };

    case artefactTypes.ADD_MY_ARTEFACTS:
        return {
            ...state,
            artIdCache: {
                ...state.artIdCache,
                [action.newArtefact.id]: action.newArtefact,
            }
        };

    case artefactTypes.RES_GET_PUBLIC_ARTEFACTS:
        return {
            ...state,
            artIdCache: {
                ... state.artIdCache,
                ... action.artefacts.reduce(
                        (cache, value) => ({ ...cache, [value.id]: value }),
                        { }
                    ),
            },
        };

    case artefactTypes.RES_GET_USER_ARTEFACTS:
        return {
            ...state,
            artIdCache: {
                ... state.artIdCache,
                ... action.userArtefacts.reduce(
                        (cache, value) => ({ ...cache, [value.id]: value }),
                        { }
                    ),
            },
        };

    default:
        return state;
    }
}

export const art = flatCombineReducers(artMain, updateArtIdCache);

