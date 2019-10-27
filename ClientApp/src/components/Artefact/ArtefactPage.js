import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { 
    discuss as discussActions, 
    artefacts as artActions,
} from '../../redux/actions';

import Overview from '../Shared/Overview.js';
import ArtefactPreviewNew from './ArtefactPreviewNew.js';

import CentreLoading from 'components/Shared/CentreLoading';
import ArtefactInfo from './ArtefactInfo.js';
import '../User/UserProfile.css';
import './ArtefactPage.css';

import Discussion from '../Discussion/Discussion.js';

function getArtefactIdFromRoute(route) {
    const matches = route.match(`/artefact/([^/]+)`);

    if (matches !== null)
        return matches[1];
    console.warn("Failed to get artefact ID from route.");
    return null;
}

class ArtefactPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        this.props.getArtefact(this.props.artefactId);
        this.props.getDiscussion(this.props.artefactId);
    }

    render() {
        if (this.props.loading)
            return <CentreLoading/>;
        return (
            <Overview>
                <ArtefactPreviewNew 
                    artefact={this.props.artefact} 
                    editable={this.props.isViewOfCurUser}
                    updateArtefact={this.props.updateArtefact}
                />
                {/* <ArtefactInfo 
                    artefact={this.props.artefact} 
                    auth={{isOwner: this.props.isViewOfCurUser}}/> */}
                {
                    (this.props.discussion.loading) ? (
                        <CentreLoading/>
                    ) : (this.props.discussion.error) ? (
                        <div className='error'>
                            An error occured while fetching comment data from
                            the server. Try reloading the page.
                        </div>
                    ) : (
                        <Discussion items={this.props.discussion.tree} artefactId={this.props.artefactId}/>
                    )
                }
            </Overview>
        );
    }

}


function mapStateToProps(state) {
    const artefactId = getArtefactIdFromRoute(state.router.location.pathname);

    let isViewOfCurUser = false;

    if (state.art.artIdCache[artefactId]) {
        isViewOfCurUser = 
            state.art.artIdCache[artefactId].owner.username === 
                state.auth.user.username;
    }

    return {
        artefactId,
        artefact: state.art.artIdCache[artefactId],
        loading: state.art.artIdCache[artefactId] === undefined,
        discussion: {
            tree: state.discuss[artefactId] && state.discuss[artefactId].tree,
            loading: !state.discuss[artefactId],
            error: state.discuss[artefactId] && state.discuss[artefactId].error,
        },
        isViewOfCurUser,
    };
}

function mapDispatchToProps(dispatch) {

    return bindActionCreators({
        getArtefact: artActions.getArtefact,
        updateArtefact: artActions.updateMyArtefactSync,
        getDiscussion: discussActions.getDiscussion,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtefactPage);

