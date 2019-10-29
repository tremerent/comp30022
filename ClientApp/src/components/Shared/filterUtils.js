import { format, } from 'date-fns';

// text query types
export const queryTypes = [
    {
        name: "title",
        label: "Title",
    },
    {
        name: "description",
        label: "Description",
    },
    {
        name: "both",
        label: "Title + Description",
    }
];

export const sortOptions = [
    {
        name: "title",
        label: "Title",
    },
    {
        name: "createdAt",
        label: "Upload date",
    },
    {
        name: "imageCount",
        label: "Images"
    },
    {
        name: "questionCount",
        label: "Unanswered questions",
    },
    {
        name: "commentCount",
        label: "Interesting",
    }
];

export const catQueryTypes = [
    {
        name: "matchAll",
        label: "All",
    },
    {
        name: "matchAny",
        label: "Any",
    },
];

/**
 * 'getFilteredArtefacts' expects an object with key-values that can be converted
 * directly to a query string (denoted 'queryDetails'). The following functions 
 * convert between a 'queryDetails' object and a 'Filter.state.filterDetails' 
 * object.
 */ 

function apiFormatDate(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'MM.dd.yyyy');
}

// Converts a 'filterDetails' to key/value query parameters, ready for
// 'getFilteredArtefacts'.
export function getQueryDetails(filterDetails) {
    const newFilterQueryParams = {};
    // nullify 'filterDetails' params. we don't want in q string
    const removedFilterQueryParams = {};  
    
    // search query - can't search for an empty string
    if (filterDetails.searchQuery && filterDetails.searchQuery.text != "") {

        newFilterQueryParams.q = [];
        removedFilterQueryParams.searchQuery = null;

        if (filterDetails.searchQuery.type) {
            if (filterDetails.searchQuery.type.name == "both") {
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:description`);
            } 
            else if (filterDetails.searchQuery.type.name == "title") {
                newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
            }
            else if (filterDetails.searchQuery.type.name == "description") {
                newFilterQueryParams.q.push(`${filterDetails.ssearchQuery.text}:description`);
            }
        }
        else {
            // default to just title 
            newFilterQueryParams.q.push(`${filterDetails.searchQuery.text}:title`);
        }
    }

    // date queries
    if (filterDetails.since) {
        newFilterQueryParams.since = apiFormatDate(filterDetails.since)
    }
    if (filterDetails.until) {
        newFilterQueryParams.until = apiFormatDate(filterDetails.until)
    }

    // sort query
    if (filterDetails.sortQuery != null) {
        newFilterQueryParams.sort = 
            `${filterDetails.sortQuery.name}:${filterDetails.sortQuery.order}`;

        removedFilterQueryParams.sortQuery = null;
    }

    // category queries
    if (filterDetails.catQueryType != null) {
        if (filterDetails.catQueryType.name == "matchAll") {
            newFilterQueryParams.matchAll = "true";
        }
        else if (filterDetails.catQueryType.name == "matchAny") {
            newFilterQueryParams.matchAll = "false";
        }
    }
    if (filterDetails.category && filterDetails.category.length > 0) {
        // query string expects only name of category
        newFilterQueryParams.category = 
            filterDetails.category
                         .map(catOption => catOption.label);
    }

    const queryDetails = {
        ...filterDetails,
        ...newFilterQueryParams,
        ...removedFilterQueryParams
    }

    return queryDetails;
}

// inverse of 'getQueryDetails' - that is, it maps a 'queryDetails' object 
// (formatted for 'submitFilter') to a format for 'this.state.filterDetails'.
export function getFilterDetails(queryDetails) {
    const filterDetails = {};

    // CategorySelect expects a select options list
    const cat = queryDetails.category;

    if (queryDetails.category != null) {
    
        let categories;
        if (!Array.isArray(cat)) {
            categories = [queryDetails.category];
        }
        else {
            categories = queryDetails.category;
        }

        filterDetails.category = categories.map(cat => asSelectOpt(cat));

        function asSelectOpt(val) {
            return {
                label: val,
                name: val,
            };
        }
    }

    return filterDetails;
}