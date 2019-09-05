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
               {this.props.artefacts.map(a => {
                   return (
                       <ArtefactPreview artefact={a} className="my-1" />
                   );
               })}
            </div>
       );
   }
}

