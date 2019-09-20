
import React from 'react';
import ArtefactScroller from './ArtefactScroller.js';

export default class ArtefactBrowser extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{ maxWidth: '60%', height: '100%', margin: 'auto' }}>
                <ArtefactScroller/>
            </div>
        );
    }

}

