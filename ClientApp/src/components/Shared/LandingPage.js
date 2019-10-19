
import React from 'react';
import { Link } from 'react-router-dom';

import BACKGROUND_IMAGE from 'images/landing-page.jpg';

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
                <div className="af-billboard-header">
                    <h1 className='af-billboard-text af-billboard-header-text'>
                        Discover, record, and share your family's legacy.
                    </h1>
                </div>
                <div className="af-lp-actions">
                    <div className="af-lp-action-card">
                        <div className="af-lp-action-card-header">
                            <h4 className='af-billboard-text af-billboard-action-text'>
                                Share your knowledge by answering questions
                            </h4>
                        </div>
                        <div className='af-lp-action-outer'>
                            {/* triggers a filter option on the 'browse' page */}
                            <Link 
                                to={{
                                    pathname: "/browse", 
                                    state: { 
                                        prevPath: props.location.pathname, 
                                        action: "detectiveBrowse",
                                }}} 
                                className="af-lp-action">
                                <button className="btn btn-primary mv-3">
                                    <span >Become an <br/> artefact detective</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="af-lp-action-card">
                        <div className="af-lp-action-card-header">
                            <h4 className='af-billboard-text af-billboard-action-text'>
                                Archive your artefacts
                            </h4>
                        </div>
                        <div className='af-lp-action-outer'>
                            <Link to="/auth/signup" className="af-lp-action">
                                <button className="btn btn-primary mv-3">
                                    <span >Start your repository</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* <Link to="/browse" className="af-lp-action">
                        <button className="btn btn-primary mt-3">
                            Browse artefacts
                        </button>
                    </Link>
                    <Link to="/auth/signup" className="af-lp-action">
                        <button className="btn btn-primary mt-3">
                            Signup
                        </button>
                    </Link> */}
                </div>
            </div>
        </BgImage>
    );
}

