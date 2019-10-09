import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { artefacts as artActions } from '../../redux/actions';

import CreateArtefactForm from './CreateArtefactForm';

class CreateMyArtefact extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            createdArtefact: null,
        }
    }

    render() {
        return <CreateArtefactForm
            createArtefact={this.createMyArtefact}
            createdArtefact={this.state.createdArtefact}
            visibilityOpts={this.props.visibilityOpts}
        />;
    }

    createMyArtefact = async (artefact) => {
        const createdArtefact = await this.props.createMyArtefact(artefact);

        this.setState({
            ...this.state,
            createdArtefact: createdArtefact,
        });

        // 1) another solution would just be to leave this as it was like so -
        // this.setState({
        //     ...this.state,
        //     createdArtefact: this.props.createdArtefact,
        // });
    }
}

// this object is merged into this.props, and lets us access state in the redux 
// store
const mapStateToProps = state => ({
    visibilityOpts: state.art.visOpts,
    // 2) and then add this, to make that the prop gets passed to us from the store
    // createdArtefact: state.art.myArts.create.createdArtefact
});

// 3) In either case, we need to get the created object from the redux store -
// this can be done by having the action return the createdArtefact (as above)
// or by making sure we're passing the prop correctly (as it should have been).
//
// I went with the former so don't have to worry about null accessing the redux
// state - ie. doing a state.myArts.create.... <- "sorry, create is null".
// Also, it's probably good practice to return from redux thunks -
// the action 'createMyArtefact' in 'redux/actions/index.js' is a redux thunk

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        createMyArtefact: artActions.createMyArtefact,
    }, dispatch);
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
)(CreateMyArtefact);