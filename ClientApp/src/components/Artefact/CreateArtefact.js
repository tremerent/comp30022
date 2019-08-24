import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import $ from 'jquery';

export class CreateArtefact extends Component {
    static displayName = CreateArtefact.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            artefact: {
                name: "",
                artefactId: "",
                genre: ""
            },
            submitted: ""
        };
    }

    handleChange = (e) => {
        this.setState(Object.assign(this.state.artefact, {
            [e.target.id]: e.target.value,
        }));
    }

    handleSubmit = (e) => {
        e.preventDefault();

        (async () => {
            await this.createArtefact();
        })();
    }

    render() {
        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title"> Create an artefact </h4>
                        <hr />
                        <form onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="artefactId"> Artefact Id </label>
                                <input type="text" id="artefactId" onChange={this.handleChange} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name"> Artefact </label>
                                <input type="text" id="name" onChange={this.handleChange} class="form-control" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="genre"> Genre </label>
                                <select id="genre" onChange={this.handleChange} class="form-control">
                                    <option selected> Select a genre..</option>
                                </select>
                            </div>


                            <button type="submit" className="btn btn-primary"> Submit </button>
                        </form>
                    </div>
                </div>
                
            </div>
        );
    }

    componentDidMount() {
        $.get('api/Artefacts/Genres')
            .done(function (data) {
                console.log(data);
                $(genreSelectItems(data)).appendTo('#genre');
            });

        function genreSelectItems(genreData) {

            let genreSelectItems = '';
            let genre;
            for (let i = 0; i < genreData.length; i++) {
                genre = genreData[i];
                genreSelectItems += '<option value=' + genre.value + '>' + genre.name + '</option>';
            }

            return genreSelectItems;
        }
    }

    async createArtefact() {
        const artefact = this.state.artefact;
        const genreEnumVal = parseInt(artefact.genre);

        if (!isNaN(genreEnumVal)) {
            artefact.genre = genreEnumVal;
        }
        else {
            // something gone wrong - 
            // this shouldn't happen since genre values were fetched from server
        }

        console.log('sending');
        console.log(artefact)

        const token = await authService.getAccessToken();
        const response = await fetch('api/Artefacts', {
            method: 'POST',
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artefact),
            
        });

        const data = await response.json();
    }
}

