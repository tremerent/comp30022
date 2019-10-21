import React from 'react';

import './ScrollBox.css';

export default function ScrollBox(props) {
    return (
        <div className='scrollbox'>
            <div className='scrollbox-wrapper'>
                <div className='scrollbox-inner'>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

