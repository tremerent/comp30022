import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';

import './ArtefactScroller.css';

export default class ArtefactScroller extends Component {
    constructor(props) {
        super(props);
        this.state = { };
    }

    render() {
       return (
            <div className='af-artefact-scroller'>
            </div>
            //<div style={{
            //    height: '500px',
            //    overflowY: 'scroll'
            //}}>
            //   {this.props.artefacts.map(a => {
            //       if (a) {
            //           return (
            //               <div className="my-3">
            //                   <ArtefactPreview key={a.id} artefact={a} className="my-1" />
            //               </div>
            //           );
            //       }
            //       else {
            //           return <div> </div>;
            //       }
            //   })}
            //</div>
        );
   }
}

