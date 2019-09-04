import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';

export class ArtefactScroller extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
       return (
            <div>
                <ArtefactPreview artefact={/*TODO*/}/>
            </div>
       );
   }
}

