import React, { Component } from 'react';
import { CreateArtefact } from './CreateArtefact.js';
import { MyArtefactsScroller } from './MyArtefactsScroller.js';
import { getArtefacts } from '../../scripts/requests.js';

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
                <MyArtefactsScroller artefacts={this.state.artefacts} className="col-xs-6"/>
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

