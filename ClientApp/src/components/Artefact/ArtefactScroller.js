import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';
import CentreLoading from '../Shared/CentreLoading.js';

import './ArtefactScroller.css';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export default class ArtefactScroller extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            /*The maximum number of artefacts that are loaded at once*/
            load_limit : 10,
            artefactsToScroll: []
        }
    }
    
    /*Adds new artefacts to artefactsToScroll. i counts how many artefacts have been loaded*/
    update_artefacts_to_scroll() {
        var j = 0;
        for (var i = this.state.artefactsToScroll.length; 
             i < this.props.artefacts.length && j < this.state.load_limit; i++, j++) {
            this.state.artefactsToScroll.push(this.props.artefacts[i])
        }
    }

    componentDidMount() {
    }

    render() {
        if (this.props.loading)
            return (
                <CentreLoading />
            );

        return (
            //<div className={this.props.className + ' af-artefact-scroller-wrapper'}>
            //    <div className='af-artefact-scroller'>
            //        <div className='af-artefact-scroller-inner'>
            <div className='af-artefact-scroller-container'>
                {
                    this.state.artefactsToScroll.length
                        ? this.state.artefactsToScroll.map(a => {
                            if (a) {
                                return <ArtefactPreview key={a.id} artefact={a} />;
                            }
                          })
                        : <div className='text-muted text-center'>
                            {this.props.placeholder
                                ? this.props.placeholder
                                : "Oh no! No artefacts to display."
                            }
                          </div>

        //            //this.props.artefacts
        //            //    ? this.props.artefacts.map(a => {
        //            //        if (a) {
        //            //            a.images = [
        //            //                PLACEHOLDER_IMAGE_01,
        //            //                PLACEHOLDER_IMAGE_02,
        //            //                PLACEHOLDER_IMAGE_03,
        //            //            ];
        //            //            return <ArtefactPreview key={a.id} artefact={a} />;
        //            //        }
        //            //    })
        //            //    : this.state.artefacts.map(a => {
        //            //        if (a) {
        //            //            a.images = [
        //            //                PLACEHOLDER_IMAGE_01,
        //            //                PLACEHOLDER_IMAGE_02,
        //            //                PLACEHOLDER_IMAGE_03,
        //            //            ];
        //            //            return <ArtefactPreview key={a.id} artefact={a} />;
        //            //        }
        //            //    })
                }
            </div>
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

