
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

export {
    convertToSelectOptsStr,
    formToJson,
};