
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { artefacts as artActions } from '../../redux/actions';
import ArtefactScroller from './ArtefactScroller.js';

import './ArtefactBrowser.css';

class ArtefactBrowser extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getPublicArtefacts();
    }

    render() {
        return (
            <div className='af-artbrowser'>
                <ArtefactScroller
                    artefacts={this.props.publicArtefacts}
                    loading={this.props.loading}
                />
            </div>
        );
    }

}

const mapStateToProps = state => ({
    loading: state.art.publicArts.loading,
    publicArtefacts: state.art.publicArts.myArtefacts,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getPublicArtefacts: artActions.getMyArtefacts,
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (ArtefactBrowser);

