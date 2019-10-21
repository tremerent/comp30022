import { tuteTypes } from '../actions/types';
import getInitTuteState from './initTuteState'

function tute(state = getInitTuteState(), action) {
    switch (action.type) {
        case tuteTypes.TOGGLE_ANSWER_Q_TT:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    answerQuestion: {
                        ...state.browserTute.answerQuestion,
                        toolTipOpen: 
                            !state.browserTute.answerQuestion.toolTipOpen,
                    },
                },
            };
        case tuteTypes.TOGGLE_SORT_ARTS_TT:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    sortArts: {
                        ...state.browserTute.sortArts,
                        toolTipOpen: 
                            !state.browserTute.sortArts.toolTipOpen,
                    },
                },
            };
        case tuteTypes.TOGGLE_FIND_INTER_ARTS_TT:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    findInter: {
                        ...state.browserTute.findInter,
                        toolTipOpen: 
                            !state.browserTute.findInter.toolTipOpen,
                    },
                },
            };
        case tuteTypes.TOGGLE_FILTER_CATS_TT:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    filterCats: {
                        ...state.browserTute.filterCats,
                        toolTipOpen: 
                            !state.browserTute.filterCats.toolTipOpen,
                    },
                },
            };
        case tuteTypes.TOGGLE_SEARCH_TT:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    search: {
                        ...state.browserTute.search,
                        toolTipOpen: 
                            !state.browserTute.search.toolTipOpen,
                    },
                },
            };
        case tuteTypes.BROWSER_TUTE_COMPLETE:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    complete: true,
                }
            }
        case tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    answerQuestion: {
                        ...state.browserTute.answerQuestion,
                        lessonActive: 
                            !state.browserTute.answerQuestion.lessonActive,
                    },
                }
            }
        case tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE:
            return {
                ...state,
                browserTute: {
                    ...state.browserTute,
                    findInter: {
                        ...state.browserTute.findInter,
                        lessonActive: 
                            !state.browserTute.findInter.lessonActive,
                    },
                }
            }
        
        default:
            return state
    }
}

export {
    tute,
}