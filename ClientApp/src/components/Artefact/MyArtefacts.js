
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreateMyArtefact from './CreateMyArtefact.js';
import CentreLoading from '../Shared/CentreLoading.js';
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

            return (
<div className='af-profile-outer'>
    <div className='af-profile-inner-placeholder'></div>
    <div className='af-profile-inner'>
        <div className='af-profile-card-wrapper'>
            <div className='af-profile-card'>
                <div className='af-profile-card-inner'>
                    <CreateMyArtefact className="col-xs-6"/>
                </div>
            </div>
        </div>
    </div>
    <div className='af-profile-scroller'>
        <hr/>
        <h3>{this.props.user.username + "'s Artefacts"}</h3>
        <hr/>
        <ArtefactScroller
            artefacts={this.props.userArtefacts}
            placeholder={"Oh no! This user hasn't registered any artefacts yet."}
        />
    </div>
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

