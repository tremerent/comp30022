import React, { Component } from 'react';
import Joi from 'joi';

import CategorySelect from '../Category/CategorySelect.js';
import { UploadArtefactDocs } from './UploadArtefactDocs.js';
import { postArtefact, postArtefactCategories } from '../../scripts/requests.js';
import { formIsValid, artefactSchema } from '../../data/validation.js';

import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import 'font-awesome/css/font-awesome.min.css'
                    
export class CreateArtefact extends Component {
    constructor(props) {
        super(props);

        const visibilityOpts = [
            "private",
            "private-family",
            "public",
        ];

        this.state = {
            loading: true,
            artefact: {
                title: "",
                description: "",
                id: "",
                categories: [],
                visibility: visibilityOpts[1],
            },
            visibilityOpts: [...visibilityOpts],
        };
    }

    componentDidMount() {
        this.stepper = new Stepper(document.querySelector('#create-artefact-stepper'), {
            linear: false,
            animation: true,
        })
    }

    render() {
        return (
            <div>
                <div id="create-artefact-stepper" class="bs-stepper">
                    <div class="bs-stepper-header">
                        <div class="step" data-target="#create-artefact-first-page">
                            <button class="step-trigger">
                                <span class="bs-stepper-circle">1</span>
                                <span class="bs-stepper-label">Your Artefact</span>
                            </button>
                        </div>
                        <div class="line"></div>
                        <div class="step" data-target="#create-artefact-second-page">
                            <button class="step-trigger">
                                <span class="bs-stepper-circle">2</span>
                                <span class="bs-stepper-label">Upload</span>
                            </button>
                        </div>
                        <div class="line"></div>
                        <div class="step" data-target="#create-artefact-third-page">
                            <button class="step-trigger">
                                <span class="bs-stepper-circle">3</span>
                                <span class="bs-stepper-label">Share</span>
                            </button>
                        </div>
                    </div>
                    <div class="bs-stepper-content">
                        <form onSubmit={this.handleSubmit}>
                            <div id="create-artefact-first-page" class="content">
                                {this.renderFirstFormPage()}
                                <div class="row justify-content-start px-3">
                                    <button class="btn btn-primary" onClick={() => { this.stepper.next() }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div id="create-artefact-second-page" class="content">
                                {this.renderSecondFormPage()}
                                <div class="row justify-content-start px-3">
                                    <button class="btn btn-primary mx-2" onClick={() => { this.stepper.previous() }}>
                                        Previous
                                    </button>
                                    <button class="btn btn-primary mx-2" onClick={() => { this.stepper.next() }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div id="create-artefact-third-page" class="content">
                                {this.renderThirdFormPage()}
                                <div class="row justify-content-between">
                                    <button class="btn btn-primary mx-2" onClick={() => { this.stepper.previous() }}>
                                        Previous
                                    </button>
                                    <button class="btn btn-primary mx-2" type="submit">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    renderFirstFormPage = () => {
        return (
            <div>
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
                <UploadArtefactDocs />
            </div>
        );
    }

    renderThirdFormPage = () => {
        return (
            <div>
                <div className="form-group">
                    <div className="row justify-content-start mb-2">
                        <h5> Questions </h5> <i> </i>
                    </div>
                    <p> questions component </p>
                </div>
                <hr />
                <div>
                    <div className="row justify-content-start mb-2">
                        <h5> Who can see my artefact? </h5>
                    </div>
                    <div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="privacy" id="visibility" value={ this.state.visibilityOpts[0] } checked={ this.state.artefact.visibility == this.state.visibilityOpts[0] } onChange={this.handleFormChange}/>
                            <label className="form-check-label">
                                Only me
                        </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="privacy" id="visibility" value={this.state.visibilityOpts[1]} checked={ this.state.artefact.visibility == this.state.visibilityOpts[1] } onChange={this.handleFormChange}/>
                            <label className="form-check-label">
                                Only family
                            </label>
                        </div>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="privacy" id="visibility" value={this.state.visibilityOpts[2]} disabled checked={ this.state.artefact.visibility == this.state.visibilityOpts[2] } onChange={this.handleFormChange}/>
                            <label className="form-check-label">
                                Anyone
                            </label>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        );
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

    handleFormChange = (e) => {
        this.setState({
            ...this.state,
            artefact: {
                ...this.state.artefact,
                [e.target.id]: e.target.value,
            },
        });
    }
}