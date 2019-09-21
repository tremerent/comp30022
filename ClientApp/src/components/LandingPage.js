
import React from 'react';

import BACKGROUND_IMAGE from '../images/landing-page.jpg';

import './LandingPage.css';

function BgImage(props) {
    return (
        <div
            style={{ backgroundImage: `url(${props.image})` }}
            className='af-lp-background'
        >
            <div className='af-lp-background af-lp-vignette'>
                {props.children}
            </div>
        </div>
    );
}

export default function LandingPage(props) {
    // TODO(sam) if user is logged in, just redirect to profile/family/
    // artefacts/whatever.
    return (
        <BgImage image={BACKGROUND_IMAGE} className='af-billboard'>
            <div className='af-billboard'>
                <h1 className='af-billboard-text'>
                    Discover, record, and share your family's legacy.
                </h1>
                <a
                    className='btn btn-primary mt-1'
                    href='/auth/signup'
                >
                    Get Started
                </a>
            </div>
        </BgImage>
    );
    //
}

