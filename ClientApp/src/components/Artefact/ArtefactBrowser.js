
import React from 'react';
import ArtefactScroller from './ArtefactScroller.js';

import './ArtefactBrowser.css';

export default class ArtefactBrowser extends React.Component {

    render() {
        return (
            <div className='af-artbrowser'>
                <ArtefactScroller/>
            </div>
        );
    }

}

