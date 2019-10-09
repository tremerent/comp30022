import React from 'react';

import './FloatingWindow.css';

export default class FloatingWindow extends React.Component {

    render() {
        return this.props.isOpen && (
                <div className='af-floatwindow'>
                    <div className='af-dimbg'/>
                    <div className='af-float'>
                        <button className='af-float-exit' onClick={this.props.onWinClose}>
                        X
                        </button>
                        {this.props.children}
                    </div>
                </div>
        );
    }

}

