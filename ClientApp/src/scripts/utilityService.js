import Joi from 'joi';
import authService from '../components/api-authorization/AuthorizeService';

/*
 * TODO: abstract the headers section going on in all the ajax functions
 */ 

// Function maps 'idNameObjs' to a string of html '<option>'s with value 'id' and label 'name'.
// Param 'idNameObjs' expects a list of objects of form { id, name}.
function convertToSelectOptsStr(idNameObjs) {
    let selectOpts = '';
    for (let i = 0; i < idNameObjs.length; i++) {
        selectOpts += '<option value=' + idNameObjs[i].id + '>' + idNameObjs[i].name + '</option>';
    }

    return selectOpts;
}

export { convertToSelectOptsStr, };