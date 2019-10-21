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
                                        (this.props.answerQLesson.lessonActive
                                        ?
                                        'outline-danger'
                                        :
                                        'primary')
                                    }
                                    id={this.props.answerQLesson.id}
                                    onClick={this.handleAnswerQButton}
                                >
                                    Help others
                                </Button>
                                <Tooltip         
                                    placement="left"
                                    isOpen={this.props.answerQLesson.toolTipOpen}
                                    target={this.props.answerQLesson.id}
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
                                        (this.props.findInterLesson.lessonActive
                                        ?
                                        'outline-danger'
                                        :
                                        'primary')
                                    }
                                    id={this.props.findInterLesson.id}
                                    onClick={this.handleFindInterButton}
                                >
                                    Discover incredible artefacts
                                </Button>
                                <Tooltip         
                                    placement="bottom"
                                    isOpen={this.props.findInterLesson.toolTipOpen}
                                    target={this.props.findInterLesson.id}
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

    handleFindInterButton = () => {
        this.props.toggleBrowserTuteApplyFindInter();
    }

    handleAnswerQButton = () => {
        this.props.toggleBrowserTuteApplyAnswerQ();
    }
}

const mapStateToProps = (state) => {
    return {
        findInterLesson: state.tute.browserTute.findInter,
        answerQLesson: state.tute.browserTute.answerQuestion,
    }
};

const mapDispatchToProps = (dispatch) => {

    return bindActionCreators({
        toggleBrowserTuteApplyFindInter: tuteActions.toggleBrowserTuteApplyFindInter,
        toggleBrowserTuteApplyAnswerQ: tuteActions.toggleBrowserTuteApplyAnswerQ,
        browserTuteRunState: tuteActions.browserTuteRunState,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps) (ArtefactBrowserTute);

