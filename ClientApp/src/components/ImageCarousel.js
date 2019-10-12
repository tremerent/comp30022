import React from 'react';

import Carousel from './Carousel.js';

import './ImageCarousel.css';

import NO_IMAGES from '../images/no-images.png';

function renderFrame(image, n) {
    return (
        <img
                src={image.url}
                className='d-block af-imgcar-image'
                alt={image.filename}
        />
    );
}

export default function ImageCarousel(props) {
    if (!props.items || !props.items.length) {
        return null;
        //return <img className='af-imgcar-image' src={NO_IMAGES} alt='No images'/>;
    }
    return <Carousel getId={i => i.id} renderFrame={renderFrame} {...props}/>;
}
