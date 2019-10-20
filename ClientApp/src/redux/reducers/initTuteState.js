import { tute } from "./tuteReducers";

export default function getInitTuteState() {

    // things will break if tooltips not closed at start - see
    // https://github.com/reactstrap/reactstrap/issues/773
    const initTuteState = {
        browserTute: {
            complete: false,
            filterCats: {
                toolTipOpen: false,
                id: 'filterCatTuteTt',
            },
            findInter: {
                toolTipOpen: false,
                id: 'findInterTuteTt',
            },
            sortArts: {
                toolTipOpen: false,
                id: 'sortArtsTuteTt',

            },
            answerQuestion: {
                toolTipOpen: false,
                id: 'answerQuestionTuteTt',
            },
        },
    }

    return initTuteState;
}