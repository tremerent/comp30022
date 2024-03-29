﻿import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { artefacts as artActions } from '../../redux/actions';

import CreateArtefactForm from './CreateArtefactForm';

class CreateMyArtefact extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            createdArtefact: null,
        };
    }

    render() {
        return <CreateArtefactForm
            createArtefact={this.createMyArtefact}
            createdArtefact={this.state.createdArtefact}
            visibilityOpts={this.props.visibilityOpts}
            createArtReset={this.createArtReset}
        />;
    }

    createArtReset = () => {
        this.props.createArtReset();
    }

    createMyArtefact = async (artefact, docs) => {
        const createdArtefact = await this.props.createMyArtefact(artefact, docs);

        this.setState({
            ...this.state,
            createdArtefact,
        }, () => {
            this.props.artCreated();
        });
    }
}

const mapStateToProps = state => ({
    visibilityOpts: state.art.visOpts,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        createMyArtefact: artActions.createMyArtefact,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateMyArtefact);
