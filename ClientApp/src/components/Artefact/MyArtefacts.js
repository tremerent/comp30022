
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
                ? <ArtefactScroller artefacts={this.props.myArtefacts} />
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
            <div>
                <h5> Oh no! Looks like you haven't registered any artefacts yet! </h5>
            </div>
        );
    }

    addArtefact = (artefact) => {
        let artefacts = [...this.state.artefacts];
        // add 'artefact' to head of list
        artefacts.unshift(artefact);

        this.setState({
            ...this.state,
            artefacts,
        });
    }
}

const mapStateToProps = state => ({
    loading: state.art.loading,
    myArtefacts: state.art.myArtefacts,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ getMyArtefacts: artActions.getMyArtefacts, }, dispatch);
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
) (MyArtefacts);

