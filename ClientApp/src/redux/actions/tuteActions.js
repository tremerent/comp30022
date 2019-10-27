import { tuteTypes } from './types';
import { setFilter, getBrowserArtefacts } from './artActions';
import { updateCurUserDetails } from './userActions';
import jsCookie from 'js-cookie';

import { sortOptions, getQueryDetails, } from 'components/Shared/filterUtils';

function browserTuteApplyAnswerQEffects() {
    return function(dispatch, getState) {

        const filterDetails = () => getState().art.browserArts.filterDetails;

        // sort by question count
        dispatch(setFilter({
            ...filterDetails(),
            sortQuery: {
                ...sortOptions.filter(sortOpt => sortOpt.name == 'questionCount')[0],
                order: 'desc',
            },
        }));

        // submit filter
        dispatch(getBrowserArtefacts(getQueryDetails(filterDetails())));
    }
}

function browserTuteApplyFilterCatEffects() {
    return function(dispatch, getState) {
        const filterDetails = () => getState().art.browserArts.filterDetails;

        const state = getState();

        const categories = state.art.cache.categories;
        const filterCategories = [];

        // check undefined
        if (categories != null && categories.length) {
            const numCats = randNumMax(2) + 1;  // shouldn't have 0 categories

            for (let i = 0; i < numCats; i++) {
                const randCat = categories[randNumMax(categories.length)];

                // skip duplicates - note we don't use 'includes' since this
                // checks for strict equality (same obj.)
                if (!filterCategories.find(cat => cat.id === randCat.id)) {
                    filterCategories.push(randCat);
                }
            }
        }

        // doesn't include 'n'
        function randNumMax(n) {
            return Math.floor(Math.random() * Math.floor(n));
        }

        // sort by comment count
        dispatch(setFilter({
            ...filterDetails(),
            category: filterCategories.map(
                // filter takes opts with same label/value
                ({ id, name }) => ({ value: name, label: name })
            ),
            sortQuery: {
                ...sortOptions.filter(sortOpt => sortOpt.name == 'commentCount')[0],
                order: 'desc',
            },
        }));

        // submit filter
        dispatch(getBrowserArtefacts(getQueryDetails(filterDetails())));
    }
}

function toggleBrowserTuteApplyAnswerQ() {
    return function (dispatch, getState) {
        const browserTute = () => getState().tute.browserTute;

        // if user just completed the lesson's action, just run the tute
        // and return early
        const answerQTtOpen = browserTute().answerQuestion.toolTipOpen;
        if (answerQTtOpen) {
            dispatch(browserTuteRunState());
            return;
        }

        const findInterLessonActive = browserTute().findInter.lessonActive;
        // toggle other lesson type off
        if (findInterLessonActive) {
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
        }

        // toggle this lesson type on and apply effects
        dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        if (browserTute().answerQuestion.lessonActive) {
            dispatch(browserTuteApplyAnswerQEffects());
        }
    }
}

function toggleBrowserTuteApplyFindInter() {
    return function (dispatch, getState) {
        const browserTute = () => getState().tute.browserTute;

        // if user just completed the lesson's action, just run the tute
        // and return early
        const findInterTtOpen = browserTute().findInter.toolTipOpen;
        if (findInterTtOpen) {
            dispatch(browserTuteRunState());
            return;
        }

        const answerQLessonActive = browserTute().answerQuestion.lessonActive;
        // toggle other lesson type off
        if (answerQLessonActive) {
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        }


        // toggle this lesson type on and apply effects
        dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
        if (browserTute().findInter.lessonActive) {
            dispatch(browserTuteApplyFilterCatEffects());
        }
    }
}

function browserTuteRunState() {
    return function(dispatch, getState) {
        const bTuteState = getState().tute.browserTute;

        const tuteAtInitState =
            !bTuteState.answerQuestion.toolTipOpen &&
            !bTuteState.sortArts.toolTipOpen &&
            !bTuteState.findInter.toolTipOpen &&
            !bTuteState.filterCats.toolTipOpen &&
            !bTuteState.search.toolTipOpen;

        // open current tooltip, close previous

        if (tuteAtInitState && !bTuteState.complete) {
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_TT });
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
        }
        else if (bTuteState.answerQuestion.toolTipOpen) {
            dispatch(browserTuteApplyAnswerQEffects());

            // tooltips
            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_TT });
            dispatch({ type: tuteTypes.TOGGLE_SORT_ARTS_TT });
        }
        else if (bTuteState.sortArts.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_SORT_ARTS_TT });
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_ARTS_TT });
        }
        else if (bTuteState.findInter.toolTipOpen) {

            dispatch({ type: tuteTypes.TOGGLE_ANSWER_Q_LESSON_ACTIVE});
            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_LESSON_ACTIVE});
            dispatch(browserTuteApplyFilterCatEffects());

            dispatch({ type: tuteTypes.TOGGLE_FIND_INTER_ARTS_TT });
            dispatch({ type: tuteTypes.TOGGLE_FILTER_CATS_TT });
        }
        else if (bTuteState.filterCats.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_FILTER_CATS_TT });
            dispatch({ type: tuteTypes.TOGGLE_SEARCH_TT });
        }
        else if (bTuteState.search.toolTipOpen) {
            dispatch({ type: tuteTypes.TOGGLE_SEARCH_TT });
            // flag so tuteAtInitState not satisfied
            dispatch({ type: tuteTypes.BROWSER_TUTE_COMPLETE });
            jsCookie.set('browserTuteComplete', 'true', 
                { expires: 10 * 365 }  // expires in 10 years
            );
        }
    }
}

// if user logged in, then check if user.newUser
// If user not logged in, check if tute.browserTute.complete
function browserPageExited() {
    return function(dispatch, getState) {
        const state = getState();

        const curUserName = state.auth.user.username;

        // user logged in and has seen the tutorial - no need to harass them
        // again - doesn't check to see if tutorial complete
        if (state.auth.isLoggedIn &&
            state.users.users[curUserName] && 
            state.users.users[curUserName].newUser) {

            dispatch(updateCurUserDetails({
                ...state.users.users[curUserName],
                newUser: false,
            }));
            return;
        }

        // user not logged in, only stop showing tutorial if they have completed
        if (!state.auth.user.isLoggedIn &&
            state.tute.browserTute.complete) {
            dispatch({ type: tuteTypes.BROWSER_TUTE_COMPLETE });
        }
    }
}

const tute = {
    browserTuteRunState,
    toggleBrowserTuteApplyAnswerQ,
    toggleBrowserTuteApplyFindInter,
    browserPageExited,
};

export default tute;