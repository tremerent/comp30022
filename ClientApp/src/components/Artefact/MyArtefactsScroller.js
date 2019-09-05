import React, { Component } from 'react';
import { ArtefactScroller } from './ArtefactScroller.js';

export class MyArtefactsScroller extends Component {

    render() {
        return (
            <div className="card">
                <div className="row my-2">
                    ... search
                </div>
                <div className="row">
                    <ArtefactScroller artefacts={this.props.artefacts} />
                </div>
            </div>
        );
    }
}
