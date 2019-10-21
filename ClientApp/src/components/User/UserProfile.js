import React from 'react';
import FloatingWindow from '../Shared/FloatingWindow.js';
import CreateArtefacts from '../Artefact/CreateMyArtefact.js';
import Overview from '../Shared/Overview.js';

import ArtefactScroller from '../Artefact/ArtefactScroller.js';
import { editableTextArea } from 'components/Shared/editableTextArea';
import ProfilePicture from './ProfilePicture';

import './UserProfile.css';
import './UserProfileEditing.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

class UserInfo extends React.Component {

    changeBio = (newBio) => {
        this.props.updateUserDetails({
            bio: newBio
        });
    }

    render() {
        const BioText = (props) => {
            let bioPlaceholderStr;

            if (this.props.isCurUser) {
                bioPlaceholderStr = 
                    `Oh no! Looks like you haven't set a bio yet.`;
            }
            else {
                bioPlaceholderStr = 
                    `Oh no! ${this.props.user.username} is yet to provide a bio.`;
            }
                
            return <div className='text-muted'>
                    {
                        props.value != null && props.value.length
                        ? props.value
                        : bioPlaceholderStr
                    }
                </div>;
        }

        let EditableBio;
        if (this.props.editable) {

            EditableBio = editableTextArea(BioText);
        }

        return (
            <div className='af-profile-info'>
                <ProfilePicture
                    imageUrl={this.props.user.imageUrl}
                    username={this.props.user.username}
                    updateProfilePic={this.props.updateUserProfilePic}
                    editable={this.props.editable}
                />
                <h2 className='af-profile-name'>{this.props.user.username}</h2>
                <div className='af-profile-badges'>
                    <span className="badge badge-decal-text mx-1 af-profile-art-badge">
                        {(this.props.numArtefactsReg
                            ? this.props.numArtefactsReg
                            : 0) + ' Artefacts'}
                    </span>
                </div>
                <hr/>
                {
                    this.props.editable
                    ?
                    <EditableBio
                        value={this.props.user.bio}
                        onValueSubmit={this.changeBio}
                    />
                    :
                    <BioText />
                }
            </div>
        );
    }
}

class UserScroller extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showCreateArtHeader: true,
        };
    }

    render() {
        const scrollerTitle = 
            this.props.isCurUser
            ? `Your Artefacts`
            : `${this.props.user.username}'s Artefacts`;

        const addArtButton = 
            this.props.isCurUser
            ? <button className='btn btn-primary btn-circle btn-circle-lg' data-target='#addart' data-toggle='modal'>
                 <FontAwesomeIcon icon={faPlus}/>
              </button>
            : null
            // Add
        return (
            <>
            <FloatingWindow 
                id="addart" 
                className='af-register-modal' 
                title='Register An Artefact'
                showHeader={this.state.showCreateArtHeader}
            >
                <CreateArtefacts 
                    artCreated={() => 
                        this.setState({
                            ...this.state,
                            showCreateArtHeader: false,
                        })}
                    createArtReset={() =>
                        this.setState({
                            ...this.state,
                            showCreateArtHeader: true,
                        })
                    }
                />
            </FloatingWindow>
            <div className='af-profile-scroller'>
                <hr/>
                <div className='af-profile-scroller-title'>
                    <h3>
                        {scrollerTitle}
                    </h3>
                    {addArtButton}
                </div>
                <hr/>
                <ArtefactScroller
                    artefacts={this.props.userArtefacts}
                    placeholder={"Oh no! This user hasn't registered any artefacts yet."}
                />
            </div>
            </>
        );
    }

}

export default class UserProfile extends React.Component {
    render() {
        return (
            <Overview sizeStatic='50%' sizeScroll='46%'>
                <UserInfo {...this.props}/>
                <UserScroller {...this.props}/>
            </Overview>
        );
    }
}

