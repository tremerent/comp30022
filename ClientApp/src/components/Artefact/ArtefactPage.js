import React from 'react';

import ArtefactPreview from './ArtefactPreview.js';
import '../User/UserProfile.css';
import './ArtefactPage.css';

import DiscussionTest from '../Testing/components/DiscussionTest.js';


export default class ArtefactPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = { };
    }

    render() {
        return (
            <div className='af-profile-outer'>
                <div className='af-profile-inner-placeholder'></div>
                <div className='af-profile-inner'>
                    <div className='af-profile-card-wrapper'>
                        <div className='af-profile-card'>
                            <div className='af-profile-inner'>
                                <ArtefactPreview artefact={this.props.artefact}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='af-discuss-scroller'>
                    <DiscussionTest/>
                </div>
            </div>
        );
    }

}


