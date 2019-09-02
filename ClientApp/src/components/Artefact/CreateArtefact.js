import React, { Component } from 'react';
import Joi from 'joi';

import CategorySelect from '../Category/CategorySelect.js'
import { postArtefact, postArtefactCategories } from '../../scripts/requests.js';
import { formIsValid, artefactSchema } from '../../data/validation.js';

import Stepper from 'bs-stepper'
import '../../../../node_modules/bs-stepper/dist/css/bs-stepper.min.css';  // TODO: remove relative dirs - I had a little go at this and was grievous

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
                title: "",
                description: "",
                id: "",
                categories: []
            },
        };
    }

    componentDidMount() {
        new Stepper(document.querySelector('.bs-stepper'))
    }

    renderCreateArtefactStepper = () => {
        return (
            <div className="card">
                <div class="bs-stepper">
                    <div class="bs-stepper-header" role="tablist">

                        <div class="step" data-target="#create-artefact-first-page">
                            <button type="button" class="step-trigger" role="tab" id="logins-part-trigger">
                                <span class="bs-stepper-circle">1</span>
                                <span class="bs-stepper-label">Logins</span>
                            </button>
                        </div>
                        <div class="line"></div>
                        <div class="step" data-target="#create-artefact-second-page">
                            <button type="button" class="step-trigger" role="tab" id="information-part-trigger">
                                <span class="bs-stepper-circle">2</span>
                                <span class="bs-stepper-label">Various information</span>
                            </button>
                        </div>
                    </div>

                    <div class="bs-stepper-content">
                        <div id="create-artefact-first-page" class="content" role="tabpanel" aria-labelledby="logins-part-trigger">
                            <div>
                                {this.renderFirstFormPage()}
                            </div>
                        </div>
                        <div id="create-artefact-second-page" class="content" role="tabpanel" aria-labelledby="logins-part-trigger">
                            <div>
                                {this.renderSecondFormPage()}
                            </div>
                        </div>
                        <div id="create-artefact-third-page" class="content" role="tabpanel" aria-labelledby="logins-part-trigger">
                            <div>
                                {this.renderThirdFormPage()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderFirstFormPage = () => {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="artefactId"> Artefact Id </label>
                    <input type="text" id="id" value={this.state.artefact.id}
                            onChange={this.handleFormChange}
                            className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="title"> Title </label>
                    <input type="text" id="title" value={this.state.artefact.name}
                        onChange={this.handleFormChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description"> Description </label>
                    <textarea id="description" value={this.state.artefact.description}
                        onChange={this.handleFormChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <CategorySelect categoryVals={this.state.artefact.categories} setCategories={this.handleFormChange} placeholder={"Pick categories or create a new one"}/>
                </div>
            </div>
        );
    }

    renderSecondFormPage = () => {
        return (
            <div>
                page 2
            </div>
        );
    }

    renderThirdFormPage = () => {
        return (
            <div>
                page 3
            </div>
        );
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
                {this.renderCreateArtefactStepper()}
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


//<div>
//                            <div className="card">
//                                <div className="card-body">
//                                    <h4 className="card-title"> Create an artefact </h4>
//                                    <hr />
//                                    <form onSubmit={this.handleSubmit}>

//                                        <div className="form-group">
//                                            <label htmlFor="artefactId"> Artefact Id </label>
//                                            <input type="text" id="id" value={this.state.artefact.id}
//                                                   onChange={this.handleFormChange} onBlur={this.handleBlur('id')}
//                                                   className={"form-control " + (this.state.errors.id ? "error" : "")}
//                                            />
//                                        </div>

//                                        <div className="form-group">
//                                            <label htmlFor="name"> Artefact </label>
//                                            <input type="text" id="name" value={this.state.artefact.name}
//                                                onChange={this.handleFormChange} onBlur={this.handleBlur('name')}
//                                                className={"form-control " + (this.state.errors.name ? "error" : "")}
//                                            />
//                                        </div>

//                                        <div className="form-group">
//                                            <CategorySelect categoryVals={this.state.artefact.categories} setCategories={this.handleFormChange}/>
//                                        </div>

//                                        <button type="submit"
                                
//                                            className="btn btn-primary"> Submit </button>
//                                    </form>
//                                </div>
//                            </div>
                
//                        </div>
                    
