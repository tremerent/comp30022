import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends React.Component {
    render () {
        return (
            <div style={{ width: "100%", height: "100%" }}>
                <NavMenu />
                {this.props.children}
            </div>
        );
    }
}

