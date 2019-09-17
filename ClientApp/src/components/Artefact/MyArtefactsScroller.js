import React, { Component } from 'react';
import { ArtefactScroller } from './ArtefactScroller.js';

export class MyArtefactsScroller extends Component {

    render() {
        return (
            <ArtefactScroller artefacts={this.props.artefacts} />
        );
    }
}
