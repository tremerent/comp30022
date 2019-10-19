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

// Set filter for the "detective" persona - a user using Artefactor to share
// their wealth of artefact knowledge.
export const setDetectiveFilter = (setFilter, filterDetails) => {
    setFilter({
        ...filterDetails,
        sortQuery: {
            ...sortOptions.filter(sortOpt => sortOpt.name == 'questionCount')[0],
            order: 'desc',
        },
    });
}

export const setInterestingFilter = (setFilter, filterDetails) => {
    setFilter({
        ...filterDetails,
        sortQuery: {
            ...sortOptions.filter(sortOpt => sortOpt.name == 'commentCount')[0],
            order: 'desc',
        },
    });
}