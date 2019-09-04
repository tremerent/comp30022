﻿import React, { Component } from 'react';
import { CreateArtefact } from './CreateArtefact';
import authService from '../api-authorization/AuthorizeService';

import { ArtefactPreview } from './ArtefactPreview.js';

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
        //this.populateArtefactData();
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
        //let contents = this.state.loading
        //    ? <p><em>Loading...</em></p>
        //    : ArtefactIndex.renderArtefactsTable(this.state.artefacts);
        let contents = <ArtefactPreview artefact={{
                            id: 'someId',
                            title: "MY FUCKIN VASE",
                            description: "AN ANCIENT VASE FROM THE RAVINE."
                        }}/>;

        return (
            <div>
                <h2> My artefacts </h2>
                {contents}
                <hr />
            </div>
        );
                //<CreateArtefact addArtefact={this.addArtefact}/>
    }

    addArtefact = (artefact) => {
        let artefacts = [...this.state.artefacts];
        artefacts.push(artefact);

        this.setState({
            ...this.state,
            artefacts,
        });
    }

    async populateArtefactData() {
        const token = await authService.getAccessToken();
        const response = await fetch('api/Artefacts', {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ artefacts: data, loading: false });
    }
}

