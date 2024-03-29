import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Stepper from 'bs-stepper';
import 'bs-stepper/dist/css/bs-stepper.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faShareAltSquare, faTrophy } from '@fortawesome/free-solid-svg-icons';

import CategorySelect from '../Category/CategorySelect.js';
import ArtefactDocs from './ArtefactDocs.js';

import './CreateArtefactForm.css';

const visbilityOptLabels = {
    "private": "Only me",
    // "family": "My family",
    "public": "Anyone",
};

export class CreateArtefactForm extends Component {
    constructor(props) {
        super(props);

        this.initialArtefactState = {
            id: `${Date.now()}`,
            title: "",
            description: "",
            categories: [],
            visibility: null,
        };

        // this doesn't participate in
        this.docs = { };

        this.state = {
            artefact: { ...this.initialArtefactState },
            artefactWasCreated: false,
            loading: false,
            createdArtefactId: null,
        };
    }

    componentDidMount() {
        this.stepper = new Stepper(document.querySelector('#create-artefact-stepper'), {
            linear: true,
            animation: true,
        });

        this.createArtefactFirstPage =
            document.querySelector('#create-artefact-first-page');
        this.createArtefactSecondPage =
            document.querySelector('#create-artefact-second-page');
        this.createArtefactThirdPage =
            document.querySelector('#create-artefact-third-page');
        this.createArtefactTitle =
            document.querySelector('#title');
        this.createArtefactDescription =
            document.querySelector('#description');
    }

    render() {
        return (
            <>
            <div className="text-center">
                <div className="spinner-border text-primary" role="status"
                    style={{
                        display:
                            this.state.artefactWasCreated ? "none" :
                                this.state.loading ? null : "none",
                            margin: '5em 5em',
                    }}>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
            <div className="card"
                style={{
                    display: this.state.artefactWasCreated ? "none" :
                                this.state.loading ? "none" : null,
                }}>
                {this.renderArtefactForm()}
            </div>
            <div style={{ display: this.state.artefactWasCreated ? null : "none" }}>
                {this.renderArtefactCreated()}
            </div>
            </>
        );
    }

    renderArtefactCreated = () => {
        return (
            <div className="alert alert-success create-art-succ" role="alert">
                <h4 className="alert-heading">Thanks for registering an artefact!</h4>
                <hr/>
                <div className="row justify-content-start">
                    <Link to={`/artefact/${this.state.createdArtefactId}`}>
                        <button className="btn btn-secondary mx-2" style={{color: "#fff !important"}}>
                            See your artefact
                        </button> 
                    </Link>
                    <button className="btn btn-primary" onClick={this.resetArtefactCreation}> Create another artefact</button>
                </div>
            </div>
        );
    }

    renderArtefactForm = () => {
        return (
            <div id="create-artefact-stepper" className="bs-stepper">
                <div className="bs-stepper-header px-2">
                    <div className="step" data-target="#create-artefact-first-page">
                        <button className="step-trigger">
                            <span className="bs-stepper-circle"><FontAwesomeIcon icon={faTrophy} /></span>
                            <span className="bs-stepper-label">Your Artefact</span>
                        </button>
                    </div>
                    <div className="line"></div>
                    <div className="step" data-target="#create-artefact-second-page">
                        <button className="step-trigger">
                            <span className="bs-stepper-circle"><FontAwesomeIcon icon={faImages} /></span>
                            <span className="bs-stepper-label">Upload</span>
                        </button>
                    </div>
                    <div className="line"></div>
                    <div className="step" data-target="#create-artefact-third-page">
                        <button className="step-trigger">
                            <span className="bs-stepper-circle"><FontAwesomeIcon icon={faShareAltSquare} /></span>
                            <span className="bs-stepper-label">Share</span>
                        </button>
                    </div>
                </div>
                <div className="bs-stepper-content">
                    <form id="create-artefact-form">
                        <div id="create-artefact-first-page" className="content">
                            {this.renderFirstFormPage()}
                            <div className="row justify-content-end px-3">
                                <button className="btn btn-primary" onClick={this.firstFormPageOnNext}>
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
                                <button className="btn btn-primary mx-2" onClick={this.secondFormPageOnNext}>
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
                                <button
                                    className="btn btn-primary mx-2"
                                    type="submit"
                                    onClick={this.finalFormPageOnSubmitPress}
                                >
                                    Register
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    renderFirstFormPage = () => {
        return (
            <div>
                <div className="form-group">
                    <label htmlFor="title"> Title </label>
                    <input type="text" id="title" value={this.state.artefact.title}
                        onChange={this.handleFormChange}
                        className="form-control"
                    />
                    <div className="invalid-feedback">
                        Sorry! Please give your artefact a title.
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="description"> Description </label>
                    <textarea id="description" value={this.state.artefact.description}
                        onChange={this.handleFormChange}
                        className="form-control"
                    > </textarea>
                    <div className="invalid-feedback">
                        Sorry! Please give your artefact a description.
                    </div>
                </div>

                <div className="form-group">
                    <CategorySelect
                        creatable={true}
                        categoryVals={this.state.artefact.categories}
                        setCategoryVals={this.handleSelectValsChange("categories")}
                        blurPlaceholder={"Choose your artefact's categories"}
                        focusPlaceholder={"Type to search for a category or create your own"}
                    />
                </div>
            </div>
        );
    }

    handleArtefactDocsChange = (doc, action) => {
        switch (action) {
        case 'delete':
            if (!this.docs[doc.id])
                console.warn(`'${doc.id}' deleted but is not tracked`);
            delete this.docs[doc.id];
            break;
        case 'create':
            this.docs[doc.id] = doc;
            break;
        default:
            console.warn(
                `handleArtefactDocsChange(): unrecognised action '${action}'`
            );
        }
    }

    renderSecondFormPage = () => {
        return (
            <ArtefactDocs
                artefact={this.state.artefact}
                onChange={this.handleArtefactDocsChange}
            />
        );
    }

    renderThirdFormPage = () => {

        const visibilityOptRadios = this.props.visibilityOpts.map((visOpt, i) => {

            let invalidFeedback;
            if (i === 0) {
                invalidFeedback = <div className="invalid-feedback">
                    Please specify who can see your artefact
                                  </div>;
            }
            else {
                invalidFeedback = <div> </div>;
            }

            return (
                <div key={visOpt} className="form-check">
                    { invalidFeedback }
                    <input
                        className="form-check-input"
                        type="radio"
                        name="visibility"
                        id="visibility"
                        value={visOpt}
                        onChange={this.handleFormChange}
                        required
                    />
                    <label className="form-check-label">
                        {visbilityOptLabels[visOpt]}
                    </label>
                </div>
            );
        });

        return (
            <div className="px-3">
                {/* <div className="form-group">
                    <div className="row justify-content-start mb-2">
                        <h5> Questions </h5> <i> </i>
                    </div>
                    <p> questions component </p>
                </div>
                <hr /> */}
                <div>
                    <div className="row justify-content-start mb-2">
                        <h5> Who can see my artefact? </h5>
                    </div>
                    <div>
                        {this.props.visibilityOpts.length
                            ? visibilityOptRadios
                            : ""
                        }
                    </div>
                </div>
                <hr />
            </div>
        );
    }

    handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
        }

        this.setState({
            ...this.state,
            loading: true,
        });

        // At this point the artefact object has a temporary ID (a timestamp).
        // We need to remove that before the object is sent to the server, or
        // else EF and whoever actually put the temporary id in the database.
        // FIXME is to stop that happening, since it's not great that anyone
        // with an account can insert objects with arbitrary string IDs into
        // our database.
        let artefact = this.state.artefact;
        artefact.id = undefined;
        this.props.createArtefact(artefact, this.docs)
            .then(() => {

                // add created artefacts id so we have a link to it for the success
                // message
                this.setState({
                    ...this.state,
                    loading: false,
                    artefactWasCreated: true,
                    createdArtefactId: this.getCreatedArtefactId(),
                });
            });
    }

    // null check created artefact's id
    getCreatedArtefactId = () => {
        return this.props.createdArtefact
                ? this.props.createdArtefact.id
                : null;
    }

    resetArtefactCreation = () => {
        this.setState({
            ...this.state,
            artefactWasCreated: false,
            loading: true,
        })

        this.resetFormValidation();

        this.setState({
            ...this.state,
            loading: false,
            artefactWasCreated: false,
            createdArtefactId: this.getCreatedArtefactId(),
            artefact: { ...this.initialArtefactState },
        });

        this.props.createArtReset();
    }

    resetFormValidation = () => {
        this.createArtefactTitle.classList.remove('is-valid');
        this.createArtefactTitle.classList.remove('is-invalid');

        this.createArtefactDescription.classList.remove('is-valid');
        this.createArtefactDescription.classList.remove('is-invalid');

        this.createArtefactFirstPage.classList.remove('was-validated');
        this.createArtefactSecondPage.classList.remove('was-validated');
        this.createArtefactThirdPage.classList.remove('was-validated');

        this.stepper.reset();
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

    // selectName refers to name of element, so that 'handleFormChange' has
    // the appropriate element name
    handleSelectValsChange = (selectName) => (vals) => {
        this.handleFormChange({
            target: {
                value: vals,
                id: selectName,
            },
        });
    }

    firstFormPageOnNext = (e) => {
        e.preventDefault();

        const valid = this.firstFormPageValid();

        // adding the classes the hacky way instead of simple
        // "this.createArtefactFirstPage.classList.add('was-validated');"
        // because having 'required' on '#description' added a red border
        // that I was unable to find the css for (this was only for <textarea/>,
        // it was fine with <input/>, but the text area is probably a nice thing
        // to have) - Jonah
        if (valid) {
            this.createArtefactTitle.classList.remove('is-invalid');
            this.createArtefactTitle.classList.add('is-valid');

            this.createArtefactDescription.classList.remove('is-invalid');
            this.createArtefactDescription.classList.add('is-valid');

            this.stepper.next();
        }
        else {
            if (this.state.artefact.title.length === 0) {
                this.createArtefactTitle.classList.add('is-invalid');
            }
            if (this.state.artefact.description.length === 0) {
                this.createArtefactDescription.classList.add('is-invalid');
            }
        }

        return valid;
    }

    secondFormPageOnNext = (e) => {
        e.preventDefault();

        const valid = this.firstFormPageValid();
        if (valid) {
            this.stepper.next();
        }

        return valid;
    }

    finalFormPageOnSubmitPress = (e) => {
        e.preventDefault();

        this.createArtefactThirdPage.classList.add('was-validated');

        if (this.formIsValid()) {
            this.handleSubmit();
        }
    }

    formIsValid = () => {
        return this.firstFormPageValid() &&
            this.secondFormPageValid() &&
            this.thirdFormPageValid()
    }

    firstFormPageValid = () => {
        return (this.state.artefact.title.length !== 0) &&
            (this.state.artefact.description.length !== 0)
    }

    secondFormPageValid = () => {
        return true;
    }

    thirdFormPageValid = () => {
        return this.state.artefact.visibility !== null;
    }
}

CreateArtefactForm.propTypes = {
    createArtefact: PropTypes.func,
    isPreparing: PropTypes.func,
}

export default CreateArtefactForm;



