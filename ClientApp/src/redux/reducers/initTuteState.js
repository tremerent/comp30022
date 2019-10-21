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
                lessonActive: false,
            },
            sortArts: {
                toolTipOpen: false,
                id: 'sortArtsTuteTt',

            },
            answerQuestion: {
                toolTipOpen: false,
                id: 'answerQuestionTuteTt',
                lessonActive: false,
            },
            search: {
                toolTipOpen: false,
                id: 'searchTuteTt',
            },
        },
    }

    return initTuteState;
}