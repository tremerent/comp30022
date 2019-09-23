
import React from 'react';

import ArtefactScroller from './Artefact/ArtefactScroller.js';

import './UserProfile.css';

import PLACEHOLDER_IMAGE from '../images/filler/artefact-03.jpg';

function getProfile(userId) {
    return {
        name: 'Granny Bample',
        artefacts_registered: 15,
        bio: `
            My full name is Granny Bample, but you can call me Esmerelda.
            I've been collecting artefacts since 143 CE, and in that time I've
            built up an impressive collection of over 14 items. When I'm not
            scouring auctions, warehouses, or museum gift shops for rare and
            unique artefacts, I enjoy answering others' questions about their
            own artefacts, as well as arguing incessantly with other Artefactor
            users about the market value of dinosaur keychains.
        `,
    };
}


export default class UserProfile extends React.Component {

    render() {
        const user = getProfile('some-id');

        return (

<div className='af-profile-outer'>
    <div className='af-profile-inner-placeholder'></div>
    <div className='af-profile-inner'>
        <div className='af-profile-card-wrapper'>
            <div className='af-profile-card'>
                <div className='af-profile-card-inner'>
                    <img src={PLACEHOLDER_IMAGE} className='af-profile-image' alt={`${user.name}'s profile image`}></img>
                    <div className='af-profile-info'>
                        <h2 className='af-profile-name'>{user.name}</h2>
                        <div className='af-profile-badges'>
                            <span className="badge badge-decal-text mx-1 af-profile-art-badge">
                                {user.artefacts_registered + ' Artefacts'}
                            </span>
                        </div>
                        <hr/>
                        <div className='text-muted'>{user.bio}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className='af-profile-scroller'>
        <hr/>
        <h3>{user.name + "'s Artefacts"}</h3>
        <hr/>
        <ArtefactScroller/>
    </div>
</div>

        );
    }

}

