
import React from 'react';

import BACKGROUND_IMAGE from '../images/landing-page.jpg';

export default function LandingPage(props) {
    // TODO(sam) if user is logged in, just redirect to profile/family/
    // artefacts/whatever.
    return (
        <div style={{
                backgroundImage: `url(${BACKGROUND_IMAGE})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundSize: 'cover',
                maxHeight: '100%',
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
        }}>
            <div style={{ width: '60%', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1 style={{ textAlign: 'center', color: '#dddddd' }}>Discover, record, and share your family's legacy.</h1>
                <a className='btn btn-primary mt-1' href='/authentication/signup'>Get Started</a>
            </div>
        </div>
    );
    //
}

