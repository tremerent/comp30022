import React, { Component } from 'react';
import { ArtefactScroller } from './ArtefactScroller.js';

export class MyArtefactsScroller extends Component {

    constructor(props) {
        super(props);

        this.state = {
            myArtefacts: [
            ],
        };
    }

    render() {
        return (
            <div className="card">
                <div className="row">
                    ... search
                </div>
                <div className="row">
                    <ArtefactScroller artefacts={this.state.myArtefacts} />
                </div>
            </div>
        );
    }
}