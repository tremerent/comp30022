export default function getInitArtState() {
    const initArtState = {
        myArts: {
            myArtefacts: [],
            loading: true,
        },
        publicArts: {
            publicArtefacts: [],
            loading: true,
        },
        familyArts: {
            familyArtefacts: [],
            loading: true,
        }

    }

    return initArtState;
}