
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CreateArtefact } from './CreateArtefact.js';
import CentreLoading from '../CentreLoading.js';
import ArtefactScroller from './ArtefactScroller.js';
import { artefacts as artActions } from '../../redux/actions';

import './MyArtefacts.css';

class MyArtefacts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            artefacts: [],
            loading: true
        };
    }

    componentDidMount() {
        (async () => {
            await this.props.getMyArtefacts();
        })();
    }

    render() {
        const myArtefacts =
            this.props.myArtefacts.length
                ? <ArtefactScroller
                    key={this.props.myArtefacts.length}
                    artefacts={this.props.myArtefacts}
                    loading={this.props.loading}
                    />
                : this.noArtefactsView();

        return (
            <div className='af-myart'>
                <div className='af-myart-scroller'>
                    {myArtefacts}
                </div>
                <CreateArtefact addArtefact={this.addArtefact} className="col-xs-6" />
            </div>
        );
    }

    noArtefactsView = () => {
        return (
            <div className='af-myart-noarts'>
                <h5 className='text-faded'> Oh no! Looks like you haven't registered any artefacts yet! </h5>
            </div>
        );
    }

    addArtefact = (artefact) => {
        this.props.addMyArtefact(artefact);
    }
}

const mapStateToProps = state => ({
    loading: state.art.myArts.loading,
    myArtefacts: state.art.myArts.myArtefacts,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getMyArtefacts: artActions.getMyArtefacts,
        addMyArtefact: artActions.addMyArtefact,
    }, dispatch);
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
) (MyArtefacts);

