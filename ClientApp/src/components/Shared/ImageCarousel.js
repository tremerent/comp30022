import React from 'react';
import $ from 'jquery';

import Carousel from './Carousel.js';

import './ImageCarousel.css';

// 60vh was a bit to big I thought.
const CAROUSEL_MAX_HEIGHT_FRACTION = 0.4;

const renderFrame = image => {
    return (
        <img
            src={image.url}
            className='d-block af-imgcar-image'
            alt={image.filename}
        />
    );
}

export default class ImageCarousel extends React.Component {

    componentDidUpdate() {
        const images = document.querySelectorAll(`#${this.props.id} .carousel-inner .carousel-item img`);
        const carousel = document.querySelector(`#${this.props.id}`);

        const carouselWidth = carousel.clientWidth;

        for (let ii = 0; ii < images.length; ++ii) {
            let image = images[ii];

            const [w, h] = [image.naturalWidth, image.naturalHeight];

            const maxWidth = CAROUSEL_MAX_HEIGHT_FRACTION * (w / h) * window.innerHeight;

            const width = Math.min(carouselWidth, maxWidth);

            image.style.width = `${width}px`;
        }
    }

    render() {
        if (!this.props.items || !this.props.items.length)
            return null;
        return <Carousel getId={i => i.id} renderFrame={renderFrame} {...this.props}/>;
    }

}

