import React from 'react';
import { Container } from 'reactstrap';

import { NavMenu } from './NavMenu.js';

export class Layout extends React.Component {
    render () {
        return (
            <div>
                <NavMenu />
                {this.props.children}
            </div>
        );
    }
}

