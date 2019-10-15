import React from 'react';

import FloatingWindow from '../../FloatingWindow.js';
import CreateArtefacts from '../../Artefact/CreateMyArtefact.js';

export default class FloatingWindowTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = { open: false };
    }

    openWindow = () => {
        this.setState({ open: true });
    }

    closeWindow = () => {
        this.setState({ open: false });
    }

    render() {
        return (
            <>
            {this.state.open &&
                <FloatingWindow onWinClose={this.closeWindow}>
                    <CreateArtefacts/>
                </FloatingWindow>
            }
            <button onClick={this.openWindow}>click me</button>
            {[...Array(200).keys()].map(n => <div>{n}</div>)}
            </>
        );
    };
}

