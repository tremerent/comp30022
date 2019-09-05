﻿import React, { Component } from 'react';
import Joi from 'joi';

import CategorySelect from '../Category/CategorySelect.js';
import { UploadArtefactDocs } from './UploadArtefactDocs.js';
import {
    postArtefact,
    postArtefactCategories,
    getVisibilityOpts,
} from '../../scripts/requests.js';
import { formIsValid, artefactSchema } from '../../data/validation.js';

import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import 'font-awesome/css/font-awesome.min.css';
                    
export class CreateArtefact extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            artefact: {
                title: "",
                description: "",
                categories: [],
                visibility: null,
            },
            visibilityOpts: [],
        };

        this.visbilityOptLabels = {
            "Private": "Only me",
            "PrivateFamily": "My family",
            "Public": "Anyone",
        };
    }

    componentWillMount() {
        this.populateVisibilityOpts();
    }

    componentDidMount() {
        this.stepper = new Stepper(document.querySelector('#create-artefact-stepper'), {
            linear: false,
            animation: true,
        });
    }

    render() {
        return (
            <div className="card">
                <div id="create-artefact-stepper" className="bs-stepper">
                    <div className="bs-stepper-header px-2">
                        <div className="step" data-target="#create-artefact-first-page">
                            <button className="step-trigger">
                                <span className="bs-stepper-circle">1</span>
                                <span className="bs-stepper-label">Your Artefact</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#create-artefact-second-page">
                            <button className="step-trigger">
                                <span className="bs-stepper-circle">2</span>
                                <span className="bs-stepper-label">Upload</span>
                            </button>
                        </div>
                        <div className="line"></div>
                        <div className="step" data-target="#create-artefact-third-page">
                            <button className="step-trigger">
                                <span className="bs-stepper-circle">3</span>
                                <span className="bs-stepper-label">Share</span>
                            </button>
                        </div>
                    </div>
                    <div className="bs-stepper-content">
                        <form>
                            <div id="create-artefact-first-page" className="content">
                                {this.renderFirstFormPage()}
                                <div className="row justify-content-end px-3">
                                    <button className="btn btn-primary" onClick={(e) => { e.preventDefault(); this.stepper.next() }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div id="create-artefact-second-page" className="content">
                                {this.renderSecondFormPage()}
                                <div className="row justify-content-between px-3">
                                    <button className="btn btn-primary mx-2" onClick={(e) => { e.preventDefault(); this.stepper.previous() }}>
                                        Previous
                                    </button>
                                    <button className="btn btn-primary mx-2" onClick={(e) => { e.preventDefault(); this.stepper.next() }}>
                                        Next
                                    </button>
                                </div>
                            </div>
                            <div id="create-artefact-third-page" className="content">
                                {this.renderThirdFormPage()}
                                <div className="row justify-content-between">
                                    <button className="btn btn-primary mx-2" onClick={(e) => { e.preventDefault(); this.stepper.previous() }}>
                                        Previous
                                    </button>
                                    <button className="btn btn-primary mx-2" type="submit" onClick={this.handleSubmit}>
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
                    <CategorySelect categoryVals={this.state.artefact.categories} setCategories={this.handleFormChange} placeholder={"Pick categories or create a new one"} />
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

        const visibilityOptRadios = this.state.visibilityOpts.map(opt => {
            return (
                <div key={opt.value} className="form-check">
                    <input
                        className="form-check-input"
                        type="radio"
                        name="privacy"
                        id="visibility"
                        value={opt.value}
                        onChange={this.handleFormChange}
                    />
                    <label className="form-check-label">
                        {this.visbilityOptLabels[opt.name]}
                    </label>
                </div>
            );
        });

        return (
            <div className="px-3">
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
                        {this.state.loading
                            ? ""
                            : visibilityOptRadios
                        }
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();

        (async () => {
            const newArtefact = await this.postArtefactAndCategories();

            this.props.addArtefact(newArtefact);
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

    /* Returns the newly created artefact with its attached categories */
    async postArtefactAndCategories() {
        if (formIsValid(this.state.artefact, artefactSchema)) {

            const artefactToPost = { ...this.state.artefact };

            // create a copy and post to a seperate endpoint once we have 
            // id of newly created artefact
            const artefactCategories = [...artefactToPost.categories];
            delete artefactToPost.categories;

            artefactToPost.visibility =
                Number(artefactToPost.visibility);

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
                                    <CategorySelect categoryVals={this.state.artefact.categories} setCategories={this.handleFormChange} />
                                </div>

                                <button type="submit"

                                    className="btn btn-primary"> Submit </button>
                            </form>
                        </div>
                    </div>

                </div>
            );
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

    populateVisibilityOpts = async () => {
        const visOpts = await getVisibilityOpts();

        this.setState({
            ...this.state,
            artefact: {
                ...this.state.artefact,
                visibility: visOpts.find(visOpt => visOpt.name === "PrivateFamily").value,
            },
            visibilityOpts: visOpts,
            loading: false
        });
    }
}