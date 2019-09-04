import React, { Component } from 'react';
import Joi from 'joi';

import CategorySelect from '../Category/CategorySelect.js'
import { postArtefact, postArtefactCategories } from '../../scripts/requests.js';
import { formIsValid, artefactSchema } from '../../data/validation.js';

export class CreateArtefact extends Component {
    /*
     * Component for artefact creation.
     */

    static displayName = CreateArtefact.name;

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            artefact: {
                name: "",
                id: "",
                categories: []
            },
            touched: {
                name: false,
                id: false,
                category: false,
            },
            errors: {
                name: false,
                id: false,
                category: false,
            },
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

        console.log(e.target.value)
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
            try {
                const newArtefact = await this.createArtefact();

                this.props.addArtefact(newArtefact);
            }
            catch (e) {

            }

            try {
                const artefactCategories =
                    await postArtefactCategories(this.state.artefact.categories);
            }
            catch (e) {

            }
        })();

        this.setState({
            ...this.state,
            artefact: {
                name: "",
                id: "",
                categories: []
            },
        });
    }

    render() {
        const errs = Joi.validate(
            this.state.artefact,
            artefactSchema,

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
                                <input type="text" id="id" value={this.state.artefact.id}
                                       onChange={this.handleFormChange} onBlur={this.handleBlur('id')}
                                       className={"form-control " + (this.state.errors.id ? "error" : "")}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="name"> Artefact </label>
                                <input type="text" id="name" value={this.state.artefact.name}
                                    onChange={this.handleFormChange} onBlur={this.handleBlur('name')}
                                    className={"form-control " + (this.state.errors.name ? "error" : "")}
                                />
                            </div>

                            <div className="form-group">
                                <CategorySelect categoryVals={this.state.artefact.categories} setCategories={this.handleFormChange}/>
                            </div>

                            <button type="submit"

                                className="btn btn-primary"> Submit </button>
                        </form>
                    </div>
                </div>

            </div>
        );
    }

    async createArtefact() {
        if (formIsValid(this.state.artefact, artefactSchema)) {

            try {
                const newArtefact = await postArtefact(this.state.artefact);

                return newArtefact;
            }
            catch (e) {

            }
        }
        else {
            throw new Error('Invalid artefact creation form.');
        }
    }
}

