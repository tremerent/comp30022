import React from 'react';

import ArtefactScroller from './Artefact/ArtefactScroller.js';

import './UserProfile.css';
import PLACEHOLDER_IMAGE from '../images/filler/artefact-03.jpg';

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

    constructor(props) {
        super(props);

        this.EMPTY_BIO_PLACEHOLDER = `Oh no! ${props.user.username} is yet to provide a bio.`;
    }

    render() {
        return (
            <div className='af-profile-outer'>
                <div className='af-profile-inner-placeholder'></div>
                <div className='af-profile-inner'>
                    <div className='af-profile-card-wrapper'>
                        <div className='af-profile-card'>
                            <div className='af-profile-card-inner'>
                                <img src={PLACEHOLDER_IMAGE} className='af-profile-image' alt={`${this.props.user.username}'s profile image`}></img>
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
                                                <div className='text-muted text-center'>{
                                                    this.props.user.bio != null && this.props.user.bio.length != 0
                                                        ? this.props.user.bio
                                                        : this.EMPTY_BIO_PLACEHOLDER
                                                        }</div>
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

