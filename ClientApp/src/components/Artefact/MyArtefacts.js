
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreateMyArtefact from './CreateMyArtefact.js';
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
        if (this.props.myArtefactsLoading) {
            return <CentreLoading />;
        }
        else {
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
                    <CreateMyArtefact className="col-xs-6" />
                </div>
            );
        }
    }

    noArtefactsView = () => {
        return (
            <div className='af-myart-noarts'>
                <h5 className='text-faded'> Oh no! Looks like you haven't registered any artefacts yet! </h5>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    myArtefactsLoading: state.art.myArts.loading,
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

