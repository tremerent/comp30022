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