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
                <FloatingWindow id="addart" className='af-register-modal' title='Register An Artefact'>
                    <CreateArtefacts/>
                </FloatingWindow>
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

                                    {/* <EditableTextArea
                                        Text={bio}
                                        value={this.state.bio}
                                        onValueChange={this.changeBio}
                                    /> */}
                                    {/* <div>
                                        <div className='text-muted'>{this.state.bio}</div>
                                        {
                                            this.props.editable
                                                ? <button onClick={}>
                                                    <FontAwesomeIcon icon={faImages} />
                                                  </button>
                                                :
                                        }
                                    </div>

                                                <SubmitTextArea
                                                    id='af-edit-bio'
                                                    name='edit-bio'
                                                    onSubmit={this.changeBio}
                                                >
                                                    Describe yourself
                                                </SubmitTextArea> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='af-profile-scroller'>
                    <hr/>
                    <div className='af-profile-scroller-title'>
                        <h3 style={{ display: 'inline' }}>{this.props.user.username + "'s Artefacts"}</h3>
                        <button className='btn btn-primary af-profile-addbutton' data-target='#addart' data-toggle='modal'>
                            Add
                        </button>
                    </div>
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

