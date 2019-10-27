import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';
import CentreLoading from '../Shared/CentreLoading.js';

import './ArtefactScroller.css';

export default class ArtefactScroller extends Component {

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
            <div className='af-artefact-scroller-container'>
                {
                    artefactsToScroll.length
                        ? artefactsToScroll.map(a => {
                            if (a)
                                return <ArtefactPreview key={a.id} artefact={a} />;
                            return null;
                          })
                        : <div className='text-muted text-center'>
                            {this.props.placeholder
                                ? this.props.placeholder
                                : "Oh no! No artefacts to display."
                            }
                          </div>
                }
            </div>
        );
    }
}

