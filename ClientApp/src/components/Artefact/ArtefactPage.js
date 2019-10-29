import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    discuss as discussActions,
    artefacts as artActions,
} from '../../redux/actions';

import ArtefactPreviewNew from './ArtefactPreviewNew.js';
import Overview from '../Shared/Overview.js';
import FloatingWindow from '../Shared/FloatingWindow.js';
import ArtefactDocs from './ArtefactDocs.js';

import { getArtefact } from '../../redux/actions/artActions.js';
import { addArtefactImage, removeArtefactImage } from '../../scripts/requests.js';

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

class EditArtefactDocs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            docs: props.artefact.images,
            creates: { },
            deletes: { },
        };
    }

    onChange = (item, action) => {
        switch (action) {
        case 'delete': {
            if (!this.state.docs.find(i => i.id === item.id))
                console.warn(`'${item.id}' deleted but is not tracked`);
            let docs = this.state.docs.filter(i => i.id !== item.id);

            let creates = {...this.state.creates};
            let deletes = {...this.state.deletes};

            if (creates[item.id])
                delete creates[item.id];
            else
                deletes[item.id] = item;

            this.setState({
                    ...this.state,
                    docs,
                    creates,
                    deletes,
                });
            break;
        }
        case 'create': {
            let creates = {...this.state.creates};
            let deletes = {...this.state.deletes};

            if (deletes[item.id])
                delete deletes[item.id];
            else
                creates[item.id] = item;

            this.setState({
                    ...this.state,
                    docs: [
                        ...this.state.docs,
                        item,
                    ],
                    creates,
                    deletes,
                });
            break;
        }
        default:
            console.warn(
                `handleArtefactDocsChange(): unrecognised action '${action}'`
            );
        }
    }

    submit = async () => {
        this.setState({ ...this.state, loading: true });
        for (const item of Object.values(this.state.creates)) {
            console.log(`creating image ${item.id}`);
            await addArtefactImage(this.props.artefact.id, item.blob);
        }
        for (const item of Object.values(this.state.deletes)) {
            console.log(`deleting image ${item.id}`);
            await removeArtefactImage(this.props.artefact.id, item.id);
        }
        getArtefact(this.props.artefact.id, 'bypassCache');
        this.setState({ ...this.state, loading: false });
    }

    render() {
        if (this.state.loading)
            return <CentreLoading/>;
        return (
            <>
            <ArtefactDocs
                id={this.props.artefact.id}
                value={this.state.docs}
                onChange={this.onChange}
            />
            <button className='btn' onClick={this.submit}>Submit</button>
            </>
        );

    }

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

        // For some reason this is momentarily true when navigating away from
        // an artefact's page via a <Link>.
        if (!this.props.artefact)
            return <div>An error occured.</div>;

        const modalId = `af-artcard-modal-${this.props.artefact.id}`;
        return (
            <>
            {/* This cannot be inside the Overview because boostrap modals are
               broken inside positioned components. */}
            <FloatingWindow
                id={modalId}
                title='Upload images and documentation.'
                showHeader={this.state.showCreateArtHeader}
            >
                <EditArtefactDocs
                    artefact={this.props.artefact}
                    onSubmit={this.props.updateArtefact}
                />
            </FloatingWindow>
            <Overview>
                <ArtefactInfo
                    artefact={this.props.artefact}
                    auth={{isOwner: this.props.isViewOfCurUser}}
                    updateArtefact={this.props.updateArtefact}
                />
                {
                    (this.props.discussion.loading) ? (
                        <CentreLoading/>
                    ) : (this.props.discussion.error) ? (
                        <div className='error'>
                            An error occured while fetching comment data from
                            the server. Try reloading the page.
                        </div>
                    ) : (
                        <Discussion discussion={this.props.discussion} artefactId={this.props.artefactId}/>
                    )
                }
            </Overview>
            </>
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
            items: state.discuss[artefactId]
                        && state.discuss[artefactId].items,
            topLevel: state.discuss[artefactId]
                        && state.discuss[artefactId].topLevel,
            loading: !state.discuss[artefactId]
                        || state.discuss[artefactId].loading,
            error: state.discuss[artefactId]
                        && state.discuss[artefactId].error,
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

