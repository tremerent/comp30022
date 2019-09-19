import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';

export default class ArtefactScroller extends Component {
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
                           <div className="my-3" style={{ height: '500px', overflowY: 'scroll' }}>
                               <ArtefactPreview key={a.id} artefact={a} className="my-1" />
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

