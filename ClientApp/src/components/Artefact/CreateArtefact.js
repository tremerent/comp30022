import React, { Component } from 'react';
import authService from '../api-authorization/AuthorizeService';
import $ from 'jquery';
import Joi from 'joi';

export class CreateArtefact extends Component {
    static displayName = CreateArtefact.name;

    artefactSchema = Joi.object().keys({
        id: Joi.string().required(),
        name: Joi.string().required(),
        genre: Joi.number().valid(0, 1).required(),
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            artefact: {
                name: "",
                id: "",
                genre: ""
            },
            touched: {
                name: false,
                id: false,
                genre: false,
            },
            errors: {
                name: false,
                id: false,
                genre: false,
            },
            genreSelectOpts: {},
        };
    }

    // record touched when user navigates away from form -
    // for validation purposes
    handleBlur = (field) => (e) => {
        this.setState({
            ...this.state,
            touched: {
                ...this.touched,
                field: true,
            }
        })
    }

    handleFormChange = (e) => {
        this.setState({
            ...this.state,
            artefact: {
                ...this.state.artefact,
                [e.target.id]: e.target.value,
            },
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        (async () => {
            const createdArtefact = await this.createArtefact();
            this.props.addArtefact(createdArtefact);
        })();

        this.setState({
            ...this.state,
            artefact: {
                name: "",
                id: "",
                genre: ""
            },
        });
    }

    render() {
        const errs = Joi.validate(
            this.state.artefact,
            this.artefactSchema,
            { abortEarly: false },
        );

        if (errs.length) {

            // grab invalid joi schema keys
            const formFieldErrors =
                errs.filter(e => e.name == 'ValidationError')
                    .map(e => e.context.key);

            for (let field of formFieldErrors) {
                if (this.touched[field]) {
                    this.setState({
                        ...this.state,
                        errors: {
                            ...this.state.errors,
                            field: true,
                        }
                    })
                }
            }
        }

        return (
            <div>
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title"> Create an artefact </h4>
                        <hr />
                        <form onSubmit={this.handleSubmit}>

                            <div className="form-group">
                                <label htmlFor="artefactId"> Artefact Id </label>
                                <input type="text" id="id" value={this.state.artefact.id} onChange={this.handleFormChange} onBlur={this.handleBlur('id')} className={"form-control " + (this.state.errors.id ? "error" : "")} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name"> Artefact </label>
                                <input type="text" id="name" value={this.state.artefact.name} onChange={this.handleFormChange} onBlur={this.handleBlur('name')} className={"form-control " + (this.state.errors.name ? "error" : "")} />
                            </div>

                            <div className="form-group">
                                <label htmlFor="genre"> Genre </label>
                                <select id="genre" value={this.state.artefact.genre} onChange={this.handleFormChange} onBlur={this.handleBlur('genre')} defaultValue={-1} className={"form-control " + (this.state.errors.email ? "error" : "")}>
                                    <option value={-1}> Select a genre..</option>
                                </select>
                            </div>


                            <button disabled={!this.formIsValid()} type="submit" className="btn btn-primary"> Submit </button>
                        </form>
                    </div>
                </div>
                
            </div>
        );
    }

    componentDidMount = () => {
        $.get('api/Artefacts/Genres')
            .done(function (data) {
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

    formIsValid = () => {
        const res = Joi.validate(this.state.artefact, this.artefactSchema);
        return !res.error;
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

        if (this.formIsValid()) {
            const token = await authService.getAccessToken();
            const headers = {
                'Content-Type': 'application/json'
            };
            const response = await fetch('api/Artefacts', {
                method: 'POST',
                headers: !token ? { ...headers } : {
                    ...headers,
                    'Authorization': `Bearer ${token}`,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(artefact),
            });

            const respData = await response.json();
            return respData;
        }


    }
}

