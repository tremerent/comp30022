import React, { Component } from 'react';
import { CreateArtefact } from './CreateArtefact';
import authService from '../api-authorization/AuthorizeService';

export class Artefact extends Component {
    static displayName = Artefact.name;

    constructor(props) {
        super(props);
        this.state = { artefacts: [], loading: true };
    }

    componentDidMount() {
        this.populateArtefactData();
    }

    static renderArtefactsTable(artefacts) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Genre</th>
                    </tr>
                </thead>
                <tbody>
                    {artefacts.map(artefact =>
                        <tr key={artefact.id}>
                            <td>{artefact.name}</td>
                            <td>{artefact.genre}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Artefact.renderArtefactsTable(this.state.artefacts);

        return (
            <div>
                <h2> Grandma's vase! </h2>
                {contents}
                <hr />
                <CreateArtefact />
            </div>
        );
    }

    async createArtefact() {

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

