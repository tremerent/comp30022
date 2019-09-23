
import React from 'react';
import { CreateArtefact } from './CreateArtefact.js';
import ArtefactScroller from './ArtefactScroller.js';
import { getArtefacts } from '../../scripts/requests.js';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

import './MyArtefacts.css';

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
            <div className='af-myart'>
                <div className='af-myart-scroller'>
                    {/*
                        This is a hack. Changing the key forces React to
                        construct a new ArtefactScroller, which it was
                        previously optimising away. We should definitely
                        learn how react actually works instead of just doing
                        this.
                            -- Sam
                    */}
                    <ArtefactScroller key={this.state.artefacts.length} artefacts={this.state.artefacts}/>
                </div>
                <CreateArtefact addArtefact={this.addArtefact} className="col-xs-6" />
            </div>
        );
    }

    addArtefact = (artefact) => {
        let artefacts = [ artefact, ...this.state.artefacts ];

        this.setState({
            ...this.state,
            artefacts,
        });
    }
}

