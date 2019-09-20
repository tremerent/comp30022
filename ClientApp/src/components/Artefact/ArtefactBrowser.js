
import React from 'react';
import ArtefactScroller from './ArtefactScroller.js';
import { getArtefacts } from '../../scripts/requests.js';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export default class ArtefactBrowser extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            artefacts: [],
            loading: true
        };
    }

    componentDidMount() {
        getArtefacts()
            .then(artefacts => {
                for (let a of artefacts)
                    a.images = [
                                PLACEHOLDER_IMAGE_01,
                                PLACEHOLDER_IMAGE_02,
                                PLACEHOLDER_IMAGE_03,
                            ];
                this.setState({ artefacts, loading: false });
            });
    }

    render() {
        return (
            <ArtefactScroller
                artefacts={this.state.artefacts}
            />
        );
    }

}

