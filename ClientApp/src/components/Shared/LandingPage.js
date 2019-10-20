
import React from 'react';
import { Link } from 'react-router-dom';

import BACKGROUND_IMAGE from 'images/landing-page.jpg';
import SIGNUP_IMAGE from 'images/red-vase-coloured.png';
import DETECTIVE_IMAGE from 'images/wise-book.png';

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
                        Make discoveries. Record and share your collection.
                    </h1>
                </div>
                <div className="af-lp-actions">
                    {/* <div className="af-lp-action-card">
                        <div className="af-lp-action-card-header-vert">
                            <div className="af-lp-action-card-header-vert-text">
                                <h4 className='af-billboard-text af-billboard-action-text af-billboard-vert-text'>
                                    Share your knowledge
                                </h4>
                            </div>
                            <img src={DETECTIVE_IMAGE} className="af-detective-img"/>
                        </div>
                        <div className='af-lp-action-outer'>
                            triggers a filter option on the 'browse' page
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
                    </div> */}
                    <div className="af-action-card-new">
                        <img src={DETECTIVE_IMAGE} className="af-detective-img"/>
                        <div className="af-lp-action-text-outer">
                            <h4 className="af-lp-action-text af-lp-action-title">
                                Share your knowledge
                            </h4>
                        </div>
                            {/* </div> */}
                        <div>
                            <Link 
                                to={{
                                    pathname: "/browse", 
                                    state: { 
                                        prevPath: props.location.pathname, 
                                        action: "detectiveBrowse",
                                }}}
                            >
                                <button className="btn btn-primary mv-3">
                                    <span className="af-lp-action-button-text">
                                        Become an <br/> artefact detective</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className="af-action-card-new">
                        <img src={SIGNUP_IMAGE} className="af-detective-img"/>

                        <div className="af-lp-action-text-outer">
                            <h4 className="af-lp-action-text af-lp-action-title">
                                Archive your artefacts
                            </h4>
                        </div>
                            {/* </div> */}
                        <div>
                            <Link 
                                to={{
                                    pathname: "/auth/signup", 
                                    state: { 
                                        prevPath: props.location.pathname, 
                                        action: "detectiveBrowse",
                                }}}
                            >
                                <button className="btn btn-primary mv-3">
                                    <span className="af-lp-action-button-text">
                                        Start your repository</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* <div className="af-lp-action-card af-lp-action-card-long">
                        <div className="af-lp-action-card-header af-lp-action-card-header-horiz">
                            <h4 className='af-billboard-text af-billboard-action-text'>
                                Archive your artefacts
                            </h4>
                        </div>
                        <div className='af-lp-action-outer'>
                            <div>

                            </div>
                            <Link to="/auth/signup" className="af-lp-action">
                                <button className="btn btn-primary mv-3">
                                    <span >Start your repository</span>
                                </button>
                            </Link>
                        </div>
                    </div> */}
                    
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

