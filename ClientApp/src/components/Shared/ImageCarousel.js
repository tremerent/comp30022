import React from 'react';

import Carousel from './Carousel.js';

import './ImageCarousel.css';

function renderFrame(image, n) {
    return (
        <img 
            src={image.url}
            className='d-block af-imgcar-image'
            alt={image.filename}
            rotation={90}
        />
    );
}

export default function ImageCarousel(props) {
    if (!props.items || !props.items.length)
        return null;
    return (
        <div className='af-carousel'>
            <Carousel getId={i => i.id} renderFrame={renderFrame} {...props}/>
        </div>
    );
}

