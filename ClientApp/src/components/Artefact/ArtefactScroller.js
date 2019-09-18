import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';

export default class ArtefactScroller extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
        return (
            <div style={{ height: '500px', overflowY: 'scroll' }}>
                {this.props.artefacts.map(a => {
                    return (
                        <ArtefactPreview key={a.id} artefact={a} className="my-1" />
                   );
               })}
            </div>
        );
   }
}

