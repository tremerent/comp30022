export default function getInitArtState() {
    const initArtState = {
        myArts: {
            myArtefacts: [],
            loading: false,
        },
        publicArts: {
            publicArtefacts: [],
            loading: false,
        },
        familyArts: {
            familyArtefacts: [],
            loading: false,
        }

    }

    return initArtState;
}