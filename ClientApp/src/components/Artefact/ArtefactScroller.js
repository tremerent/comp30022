import React, { Component } from 'react';
import { ArtefactPreview } from './ArtefactPreview.js';
import CentreLoading from '../CenterLoading.js';
import { getArtefacts } from '../../scripts/requests.js';

import './ArtefactScroller.css';

import PLACEHOLDER_IMAGE_01 from '../../images/filler/artefact-01.jpg';
import PLACEHOLDER_IMAGE_02 from '../../images/filler/artefact-02.jpg';
import PLACEHOLDER_IMAGE_03 from '../../images/filler/artefact-03.jpg';

export default class ArtefactScroller extends Component {
    constructor(props) {
        super(props);

        uet artefacts = this.props.artefacts;
        this.state = {
            artefacts: Array.isArray(artefacts) && artefacts.length ? (
                    artefacts
                ) : (
                    []
                ),
        };
        this.state.loading = !this.state.artefacts.length;
    }

    componentDidMount() {
        if (this.state.loading)
            getArtefacts()
                .then(artefacts => {
                    this.setState({ artefacts, loading: false });
                });
    }

    render() {
        if (this.state.loading)
            return (
                <CentreLoading />
            );
        return (
            //<div className={this.props.className + ' af-artefact-scroller-wrapper'}>
            //    <div className='af-artefact-scroller'>
            //        <div className='af-artefact-scroller-inner'>
                    <div className='af-artefact-srcoller-container'>
                        {this.state.artefacts.map(a => {
                            if (a) {
                                a.images = [
                                    PLACEHOLDER_IMAGE_01,
                                    PLACEHOLDER_IMAGE_02,
                                    PLACEHOLDER_IMAGE_03,
                                ];
                                return <ArtefactPreview key={a.id} artefact={a} />;
                            }
                        })}
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

