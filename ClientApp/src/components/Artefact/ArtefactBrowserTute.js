import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, } from '@fortawesome/free-solid-svg-icons';
import { tute as tuteActions } from 'redux/actions';
import TuteTooltip from 'components/Shared/TuteTooltip';

import 'components/Shared/Filter.css';

import { Button } from 'reactstrap';


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
            <div className='af-filter-header af-browser-tute'>
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
                                <TuteTooltip         
                                    placement="left"
                                    isOpen={this.props.answerQLesson.toolTipOpen}
                                    target={this.props.answerQLesson.id}
                                    onClick={this.props.browserTuteRunState}
                                    content={<>Click on an artefact &nbsp;&nbsp;<FontAwesomeIcon icon={faTimes} size="xs"/> <br /> to <em>answer</em> a question</>}
                                />
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
                                <TuteTooltip         
                                    placement="bottom"
                                    isOpen={this.props.findInterLesson.toolTipOpen}
                                    target={this.props.findInterLesson.id}
                                    onClick={this.props.browserTuteRunState}
                                    content={<>Looking for more?&nbsp;<FontAwesomeIcon icon={faTimes} size="xs"/></>}
                                />
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
    // console.log(tuteA)
    return bindActionCreators({
        toggleBrowserTuteApplyFindInter: tuteActions.toggleBrowserTuteApplyFindInter,
        toggleBrowserTuteApplyAnswerQ: tuteActions.toggleBrowserTuteApplyAnswerQ,
        browserTuteRunState: tuteActions.browserTuteRunState,
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps) (ArtefactBrowserTute);

