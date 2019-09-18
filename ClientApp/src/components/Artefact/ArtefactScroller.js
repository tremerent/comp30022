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
                   if (a) {
                       return (
                           <div className="my-3">
                               <ArtefactPreview key={a.id} artefact={a} />
                           </div>
                       );
                   }
                   else {
                       return <div> </div>;
                   }
               })}
            </div>
       );
   }
}

