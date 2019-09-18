
import React from 'react';
import { CreateArtefact } from './CreateArtefact.js';
import ArtefactScroller from './ArtefactScroller.js';
import { getArtefacts } from '../../scripts/requests.js';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export default class MyArtefacts extends React.Component {

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
            <div className="row mt-5 justify-content-around">
                <ArtefactScroller
                    artefacts={this.state.artefacts}
                    class="col-xs-6"/>

                <CreateArtefact addArtefact={this.addArtefact} className="col-xs-6" />
            </div>
        );
    }

    addArtefact = (artefact) => {
        let artefacts = [...this.state.artefacts];
        // add 'artefact' to head of list
        artefacts.unshift(artefact);

        this.setState({
            ...this.state,
            artefacts,
        });
    }
}

