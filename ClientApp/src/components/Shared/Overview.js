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

        const { sizeStatic, sizeScroll } = props;

        if (sizeStatic !== undefined) {
            this.sizeStatic = sizeStatic;
            if (sizeScroll === undefined)
                this.sizeScroll = `calc(100% - ${sizeStatic})`;
            else
                this.sizeScroll = sizeScroll;
        } else if (sizeScroll !== undefined) {
            this.sizeStatic = `calc(100% - ${sizeScroll})`;
            this.sizeScroll = sizeScroll;
        } else {
            this.sizeStatic = '50%';
            this.sizeScroll = '50%';
        }

        console.log(`sizeStatic: ${this.sizeStatic}, sizeScroll: ${this.sizeScroll}`);
    }

    render() {

        return (
            <>
            <div className='af-ov-frame'>
                <div className='container'>
                    <div className='af-ov-static' style={{ width: this.sizeStatic }}>
                        <ScrollBox>
                            <div className='af-ov-navbar-placeholder'/>
                            {this.props.children[0]}
                        </ScrollBox>
                    </div>
                </div>
            </div>
            <div className='af-ov-scroll' style={{ left: `calc(100% - ${this.sizeScroll})`, width: this.sizeScroll }}>
                {this.props.children[1]}
            </div>
            </>
        );
    }
}

