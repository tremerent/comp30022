import React from 'react';
import { NavMenu } from './Nav/NavMenu';

export class Layout extends React.Component {
    render () {
        return (
            <div style={{height: "100%", width: "100%"}}>
                <NavMenu />
                {this.props.children}
            </div>
        );
    }
}

