import React from 'react';
import FloatingWindow from '../Shared/FloatingWindow.js';
import CreateArtefacts from '../Artefact/CreateMyArtefact.js';

import ArtefactScroller from '../Artefact/ArtefactScroller.js';
import { editableTextArea } from 'components/Shared/editableTextArea';
import ProfilePicture from './ProfilePicture';

import './UserProfile.css';
import './UserProfileEditing.css';


export default class UserProfile extends React.Component {

    changeBio = (newBio) => {
        this.props.updateUserDetails({
            bio: newBio
        });
    }

    createArtefacts = () => {
        this.setState({ ...this.state, creating: true });
    }

    closeCreateArtefacts = () => {
        this.setState({ ...this.state, creating: false });
    }

    render() {

        const BioText = (props) => {
            const bioPlaceholderStr =
                this.props.isCurUser
                    ? `Oh no! You haven't provided a bio!`
                    : `Oh no! ${this.props.user.username} is yet to provide a bio.`;

            return <div className='text-muted'>
                    {
                        props.value != null && props.value.length
                        ? props.value
                        : bioPlaceholderStr
                    }
                   </div>;
        }

        let EditableBio;
        let addArtefact;
        let addArtefactModal;
        if (this.props.editable) {
            EditableBio = editableTextArea(BioText);

            const addArtefactModal = 
                <FloatingWindow id="addart" className='af-register-modal' title='Register An Artefact'>
                    <CreateArtefacts/>
                </FloatingWindow>

            addArtefact = (
                <button className='btn btn-primary af-profile-addbutton' data-target='#addart' data-toggle='modal'>
                    Add
                </button>
            );
        }

        return (
            <div className='af-profile-outer'>
                {addArtefactModal}
                <div className='af-profile-inner-placeholder'></div>
                <div className='af-profile-inner'>
                    <div className='af-profile-card-wrapper'>
                        <div className='af-profile-card'>
                            <div className='af-profile-card-inner'>
                                <ProfilePicture
                                    imageUrl={this.props.user.imageUrl}
                                    updateProfilePic={this.props.
                                        updateUserProfilePic
                                    }
                                    editable={this.props.editable}
                                />
                                <div className='af-profile-info'>
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
                                        <BioText value={this.props.user.bio}/>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='af-profile-scroller'>
                    <hr/>
                    <div className='af-profile-scroller-title'>
                        <h3 style={{ display: 'inline' }}>{this.props.user.username + "'s Artefacts"}</h3>
                        {
                            this.props.editable
                            ? addArtefact
                            : null
                        }
                    </div>
                    <hr/>
                    <ArtefactScroller
                        artefacts={this.props.userArtefacts}
                        placeholder={
                            this.props.isCurUser
                            ?
                            `Oh no! You don't have any artefacts yet. 
                            Click the "Add" button to register an artefact.`
                            :
                            "Oh no! This user hasn't registered any artefacts"
                        }
                    />
                </div>
            </div>
        );
    }
}

