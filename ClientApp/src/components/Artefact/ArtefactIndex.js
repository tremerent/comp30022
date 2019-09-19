import React, { Component } from 'react';
import { CreateArtefact } from './CreateArtefact.js';
import { ArtefactScroller } from './ArtefactScroller.js';
import { getArtefacts } from '../../scripts/requests.js';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export class ArtefactIndex extends Component {
    static displayName = ArtefactIndex.name;

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

                artefacts = artefacts.slice(artefacts.length - 3, artefacts.length)

                this.setState({ artefacts, loading: false });
            });
    }

    static renderArtefactsTable(artefacts) {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Genre</th>
                    </tr>
                </thead>
                <tbody>
                    {artefacts.map(artefact =>
                        <tr key={artefact.id}>
                            <td>{artefact.id}</td>
                            <td>{artefact.name}</td>
                            <td>{artefact.genre}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div className="row mt-5 justify-content-around">
                <ArtefactScroller
                    artefacts={[
                        {
                            id:     '2fdf0cd8-733f-40fe-b00f-9d25730efe73',
                            title:  'Qing Dynasty Vase',
                            description: `
                                Stolen from Cassie.
                                We plan to ransom it in exchange for H1s all round.`,
                            images: [
                                PLACEHOLDER_IMAGE_01,
                                PLACEHOLDER_IMAGE_02,
                                PLACEHOLDER_IMAGE_03,
                            ],
                            visibility: 0,
                            categoryJoin: [],
                        },
                        {
                            id:     'd5fcd605-a5d7-4de9-bfcc-4c0373b00e46',
                            title:  'Zevulon the Great',
                            description: `
                                He's teriyaki style.
                                (Futurama reference)`,
                            images: [
                                PLACEHOLDER_IMAGE_01,
                                PLACEHOLDER_IMAGE_02,
                                PLACEHOLDER_IMAGE_03,
                            ],
                            visibility: 0,
                            categoryJoin: [],
                        },
                        {
                            id:     'b43e9584-9ad6-4c77-bb84-dee40670ea71',
                            title:  'Hot Rock',
                            description: `
                                Discovered by the AutoMail delivery bot in 1988.
                                Unfortunately it was not enough to save the bot from dying in lava.`,
                            images: [
                                PLACEHOLDER_IMAGE_01,
                                PLACEHOLDER_IMAGE_02,
                                PLACEHOLDER_IMAGE_03,
                            ],
                            visibility: 0,
                            categoryJoin: [],
                        },
                    ]}
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

