import React from 'react';

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

    render() {

        const BioText = (props) => {
            const bioPlaceholderStr =
                `Oh no! ${this.props.user.username} is yet to provide a bio.`;
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
            <div className='af-profile-outer'>
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
                                        <BioText />
                                    }
                                </div>
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

