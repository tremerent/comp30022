import React from 'react';

import ScrollBox from './ScrollBox.js';

import './Overview.css';

export default class Overview extends React.Component {

    constructor(props) {
        super(props);

        if (this.props.children.length !== 2)
            console.warn(
                'Overview: this component should have exactly 2 children, but '
                +   `has been given ${this.props.children.length}.`
            );

    }

    render() {

        return (
            <div className='af-ov'>
                <div className='af-ov-frame'>
                    <div className='container'>
                        <div className='af-ov-static'>
                            <ScrollBox>
                                <div className='af-ov-navbar-placeholder'/>
                                {this.props.children[0]}
                            </ScrollBox>
                        </div>
                    </div>
                </div>
                <div className='af-ov-static'/>
                <div className='af-ov-scroll'>
                    {this.props.children[1]}
                </div>
            </div>
        );
    }
}

