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
            //<div className={this.props.className + ' af-artefact-scroller-wrapper'}>
            //    <div className='af-artefact-scroller'>
            //        <div className='af-artefact-scroller-inner'>
               <>
                        {this.props.artefacts.map(a => {
                            return a &&
                                <ArtefactPreview key={a.id} artefact={a} />
                        })}
                </>
            //        </div>
            //    </div>
            //</div>
            //<div style={{
            //    height: '500px',
            //    overflowY: 'scroll'
            //}}>
            //</div>
        );
   }
}

