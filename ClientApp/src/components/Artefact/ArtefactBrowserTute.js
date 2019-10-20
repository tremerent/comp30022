import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { tute as tuteActions } from 'redux/actions';

import 'components/Shared/Filter.css';

import { Tooltip, Button } from 'reactstrap';


// Tutorial for component 'ArtefactBrowser'
class ArtefactBrowserTute extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = () => {
        this.props.browserTuteRunState();
    }

    render() {
        return (
            <div className='af-filter-header'>
                    <div className='af-filter-header-title'>
                        <h2> What are you  looking for? </h2>
                    </div>
                    <div className='af-filtered-browser-actions'>
                        <div className='af-filtered-browser-action'>
                            <span>
                                <Button 
                                    color={
                                        (true
                                        ?
                                        'outline-danger'
                                        :
                                        'primary')
                                    }
                                    id={"Tooltip-" + this.props.answerQTt.id}
                                >
                                    Help others
                                </Button>
                                <Tooltip         
                                    placement="left"
                                    isOpen={this.props.answerQTt.toolTipOpen}
                                    target={"Tooltip-" + this.props.answerQTt.id}
                                    autohide={false}
                                    className="af-tooltip"
                                    toggle={this.props.browserTuteRunState}
                                >
                                    Click on an artefact <br /> to <em>answer</em> a question
                                </Tooltip>
                            </span>
                        </div>
                        <div className='af-filtered-browser-action'>
                            <span>
                                <Button 
                                    color={
                                        (true
                                        ?
                                        'outline-danger'
                                        :
                                        'primary')
                                    }
                                    id={"Tooltip-" + this.props.findInterTt.id}
                                >
                                    Discover incredible artefacts
                                </Button>
                                <Tooltip         
                                    placement="bottom"
                                    isOpen={this.props.findInterTt.toolTipOpen}
                                    target={"Tooltip-" + this.props.findInterTt.id}
                                    autohide={false}
                                    className="af-tooltip"
                                    toggle={this.props.browserTuteRunState}
                                >
                                    Looking for more?
                                </Tooltip>
                            </span>
                        </div>
                    </div>
                </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        findInterTt: state.tute.browserTute.findInter,
        answerQTt: state.tute.browserTute.answerQuestion,
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        // toggleAnswerQTt: () => ({ type: tuteTypes.TOGGLE_ANSWER_Q_TT }),
        // toggleSortArtsTt: () => ({ type: tuteTypes.TOGGLE_SORT_ARTS_TT }),
        // toggleFindInterTt: () => ({ type: tuteTypes.TOGGLE_FIND_INTER_ARTS_TT }),
        // toggleFilterCatsTt: () => ({ type: tuteTypes.TOGGLE_FILTER_CATS_TT }),
        browserTuteRunState: tuteActions.browserTuteRunState,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps) (ArtefactBrowserTute);

