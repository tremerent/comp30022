import React from 'react';

import ArtefactScroller from '../Artefact/ArtefactScroller.js';
import { editableTextArea } from 'components/Shared/editableTextArea';
import ProfilePicture from './ProfilePicture';

import './UserProfile.css';
import './UserProfileEditing.css';

//function getProfile(userId) {
//    return {
//        username: 'Granny Bample',
//        artefacts_registered: 15,
//        bio: `
//            My full name is Granny Bample, but you can call me Esmerelda.
//            I've been collecting artefacts since 143 CE, and in that time I've
//            built up an impressive collection of over 14 items. When I'm not
//            scouring auctions, warehouses, or museum gift shops for rare and
//            unique artefacts, I enjoy answering others' questions about their
//            own artefacts, as well as arguing incessantly with other Artefactor
//            users about the market value of dinosaur keychains.
//        `,
//    };
//}

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

        const EditableBio = editableTextArea(BioText);

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
                                />
                                {/* <div class="profile-pic">

                                    <img
                                        src={ this.props.user.image_url ?
                                                this.props.user.image_url
                                            :
                                                '/img/profile-placeholder.png'
                                        }
                                        className='af-profile-image'
                                        alt={`${this.props.user.username}'s profile image`}
                                    />
                                </div> */}
                                

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

                                    <EditableBio
                                        value={this.props.user.bio}
                                        onValueSubmit={this.changeBio}
                                    />
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

