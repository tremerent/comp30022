﻿import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';
import CentreLoading from '../CentreLoading.js';

import './ArtefactScroller.css';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export default class ArtefactScroller extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //if (this.state.loading)
        //    getArtefacts()
        //        .then(artefacts => {
        //            this.setState({ artefacts, loading: false });
        //        });
    }

    render() {
        if (this.props.loading)
            return (
                <CentreLoading />
            );

        const artefactsToScroll =
            this.props.artefacts != null
                ? this.props.artefacts
                : [];

        return (
            //<div className={this.props.className + ' af-artefact-scroller-wrapper'}>
            //    <div className='af-artefact-scroller'>
            //        <div className='af-artefact-scroller-inner'>
            <div className='af-artefact-scroller-container'>
                {
                    artefactsToScroll.length
                        ? artefactsToScroll.map(a => {
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

