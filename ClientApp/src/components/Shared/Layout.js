import React from 'react';

import NavMenu from 'components/Nav/NavMenu.js';

import './Layout.css';

export class Layout extends React.Component {
    render () {
        return (
            <div className='af-layout'>
                <NavMenu />
                <div className='af-content'>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

