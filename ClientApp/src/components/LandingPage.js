
import React from 'react';

import BACKGROUND_IMAGE from '../images/landing-page.jpg';

export default function LandingPage(props) {
    // TODO(sam) if user is logged in, just redirect to profile/family/
    // artefacts/whatever.
    return (
        <div style={{ backgroundImage: `url(${BACKGROUND_IMAGE})`, backgroundPosition: 'center', height: '605px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '60%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ textAlign: 'center', color: '#dddddd' }}>Discover, record, and share your family's legacy.</h1>
            <a className='btn btn-primary' href='/authentication/signup'>Get Started</a>
            </div>
        </div>
    );
}

