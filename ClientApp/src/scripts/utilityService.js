import { format, } from 'date-fns';

function formToJson(formEle) {
    const formData = new FormData(formEle);

    let jsonData = {};

    for (const [key, value] of formData.entries()) {
        jsonData[key] = value;
    }

    return jsonData;
}

// Function maps 'idNameObjs' to a string of html '<option>'s with value 'id' and label 'name'.
// Param 'idNameObjs' expects a list of objects of form { id, name}.
function convertToSelectOptsStr(idNameObjs) {
    let selectOpts = '';
    for (let i = 0; i < idNameObjs.length; i++) {
        selectOpts += '<option value=' + idNameObjs[i].id + '>' + idNameObjs[i].name + '</option>';
    }

    return selectOpts;
}

// Bind to a React.Component.
// Null check 'this.state[stateProperty]' returning it's
// contents or filling with results of 'awaitGetter'.
async function statefulAwaitGetter(stateProperty, awaitGetter) {
    if (!this.state[stateProperty]) {
        var newState = await awaitGetter();

        this.setState({
            ...this.state,
            newState,
        })
    }

    return this.state[stateProperty];
}

export function formattedArtDate(date) {
    return format(date, 'h:mma, d/M/yy');
}

export {
    convertToSelectOptsStr,
    formToJson,
    statefulAwaitGetter,
};