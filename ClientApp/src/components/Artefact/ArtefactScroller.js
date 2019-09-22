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
        this.state = {
            artefacts: [],
            loading: true
        };
    }

    componentDidMount() {
        getArtefacts()
            .then(artefacts => {
                for (let a of artefacts)
                    a.images = [
                                PLACEHOLDER_IMAGE_01,
                                PLACEHOLDER_IMAGE_02,
                                PLACEHOLDER_IMAGE_03,
                            ];
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
                            return a &&
                                <ArtefactPreview key={a.id} artefact={a} />
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

