export default function getInitArtState() {
    const initArtState = {
        visOpts:[
            "private",
            "family",
            "public"
        ],
        myArts: {
            myArtefacts: [],
            loading: true,
        },
        publicArts: {
            artefacts: [],
            loading: true,
        },
        familyArts: {
            familyArtefacts: [],
            loading: true,
        },
        userArts: {

        },
        artIdCache: { },
        browserArts: {
            browserArtefacts: [],
            loading: true,
            error: null,
            query: {},
        },
    }

    return initArtState;
}
