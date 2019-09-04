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
                <ArtefactPreview artefact={{
                    artefact: {
                        id: 'someNiceId',
                        title: "MY FUCKIN VASE",
                        description: "AN ANCIENT VASE FROM THE RAVINE."
                    }
                }}/>
            </div>
       );
   }
}

