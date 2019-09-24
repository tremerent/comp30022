
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { CreateArtefact } from './CreateArtefact.js';
import ArtefactScroller from './ArtefactScroller.js';
import { artefacts as artActions } from '../../redux/actions';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

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


        //getArtefacts()
        //    .then(artefacts => {
        //        for (let a of artefacts)
        //            a.images = [
        //                        PLACEHOLDER_IMAGE_01,
        //                        PLACEHOLDER_IMAGE_02,
        //                        PLACEHOLDER_IMAGE_03,
        //                    ];
        //        this.setState({ artefacts, loading: false });
        //    });
    }

    render() {
        const myArtefacts =
            this.props.myArtefacts.length
                ? <ArtefactScroller key={this.state.artefacts.length} artefacts={this.props.myArtefacts} />
                : this.noArtefactsView();
                    /* Key hac ^^^
                        This is a hack. Changing the key forces React to
                        construct a new ArtefactScroller, which it was
                        previously optimising away. We should definitely
                        learn how react actually works instead of just doing
                        this.
                            -- Sam
                    */
                    // <ArtefactScroller key={this.state.artefacts.length} artefacts={this.state.artefacts}/>

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
    loading: state.art.loading,
    myArtefacts: state.art.myArtefacts,
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

