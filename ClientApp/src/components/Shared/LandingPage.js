
import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import BACKGROUND_IMAGE from 'images/landing-page.jpg';
import SIGNUP_IMAGE from 'images/red-vase-coloured.png';
import DETECTIVE_IMAGE from 'images/wise-book.png';

import './LandingPage.css';

function BgImage(props) {
    return (
        <div
            style={{ backgroundImage: `url(${props.image})` }}
            className='lp-background'
        >
            {props.children}
        </div>
    );
}


function LandingPage(props) {
    return (
        <BgImage image={BACKGROUND_IMAGE} className='af-billboard'>
            <div className='container lp-container'>
                <div className='lp-copy lp-vignette'>
                    <h1>
                        Discover, record, and share your collection.
                    </h1>
                </div>
                <div className='lp-actions'>
                    <div className='lp-action-alt lp-action-bg'>
                        <img src={SIGNUP_IMAGE} className="lp-action-image"/>
                        <div className="af-lp-action-text-outer">
                            <h4>
                                Record your artefacts.
                            </h4>
                        </div>
                        <div className="af-lp-action-button-div">
                            <Link
                                    to={{
                                        pathname: "/auth/signup",
                                        state: {
                                            prevPath: props.location.pathname,
                                            action: "detectiveBrowse",
                                        },
                                    }}
                                    className='lp-action-link'
                            >
                                <button className='btn btn-primary af-lp-action-button'>
                                    <span className="af-lp-action-button-text">
                                        Start your <br/> <b>collection</b>
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                    {/* <div className="af-action-card-new">
                        <img src={SIGNUP_IMAGE} className="lp-action-image"/>

                        <div className="af-lp-action-text-outer">
                            <h4 className="af-lp-action-text af-lp-action-title">
                                Archive your artefacts
                            </h4>
                        </div>
                        <div className="af-lp-action-button-div">
                            <Link
                                to={{
                                    pathname: "/auth/signup",
                                    state: {
                                        prevPath: props.location.pathname,
                                        action: "detectiveBrowse",
                                }}}
                            >
                                <button className="btn btn-primary mv-3 af-lp-action-button">
                                    <span className="af-lp-action-button-text">
                                        Start your <br/>Collection</span>
                                </button>
                            </Link>
                        </div>
                    </div> */}
                    <div className='lp-action-alt lp-action-bg'>
                        <img src={DETECTIVE_IMAGE} className="lp-action-image"/>
                        <h4>
                            Share your knowledge.
                        </h4>

                        <div className="af-lp-action-button-div">
                            <Link
                                    to={{
                                        pathname: "/browse",
                                        state: {
                                            prevPath: props.location.pathname,
                                            action: "detectiveBrowse",
                                        },
                                    }}
                                    className='lp-action-link'
                            >
                                <button className='btn btn-primary af-lp-action-button'>
                                <span className="af-lp-action-button-text">
                                        Become an <br/><b>artefact detective</b>
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </BgImage>
    );
}

export default withRouter(props => <LandingPage {...props}/>);

/*
<div className='container af-billboard'>
    <div className="af-billboard-header">
        <h1 className='af-billboard-text af-billboard-header-text'>
            Make discoveries. Record and share your collection.
        </h1>
    </div>
    <div className="lp-actions">
        <div className="af-action-card-new">
            <img src={DETECTIVE_IMAGE} className="lp-action-img"/>
            <div className="lp-action-text-outer">
                <h4 className="lp-action-text lp-action-title">
                    Share your knowledge
                </h4>
            </div>
            <div className="lp-action-button-div-div">
                <Link
                    to={{
                        pathname: "/browse",
                        state: {
                            prevPath: props.location.pathname,
                            action: "detectiveBrowse",
                    }}}
                >
                    <button className="btn btn-primary mv-3 lp-action-button">
                        <span className="lp-action-button-text">
                            Become an <b><em>Artefact</em></b> detective
                        </span>
                    </button>
                </Link>
            </div>
        </div>
        <div className="af-action-card-new">
            <img src={SIGNUP_IMAGE} className="lp-action-img"/>

            <div className="lp-action-text-outer">
                <h4 className="lp-action-text lp-action-title">
                    Archive your artefacts
                </h4>
            </div>
            <div className="lp-action-button-div">
                <Link
                    to={{
                        pathname: "/auth/signup",
                        state: {
                            prevPath: props.location.pathname,
                            action: "detectiveBrowse",
                    }}}
                >
                    <button className="btn btn-primary mv-3 lp-action-button">
                        <span className="lp-action-button-text">
                            Start your <br/><b><em>Collection</em></b></span>
                    </button>
                </Link>
            </div>
        </div>
    </div>
</div>
*/
