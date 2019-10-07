import React from 'react';

import ImageCarousel from '../ImageCarousel.js';

import './ArtefactDocs.css';

export default class ArtefactDocs extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            images: this.props.images,
            active: 0,
        };
    }

    deleteImage(n) {
        let newImages = this.state.images;
        newImages.splice(n, 1);
        this.setState({ ...this.state, images: newImages });
    }

    render() {
        return (
            <>
                <ImageCarousel
                    id='some-id'
                    items={this.state.images}
                    activeFrame={this.state.active}
                    renderFrame={(image, n) => (
                        <React.Fragment>
                            <img
                                    src={image.url}
                                    className='d-block af-artcard-image'
                                    alt={image.filename}
                            />
                            <button
                                    className='btn btn-secondary af-docs-delimg'
                                    onClick={this.deleteImage.bind(this, n)}
                            >
                                Delete
                            </button>
                        </React.Fragment>
                    )}
                />
                {this.state.images.map((i, n) => <div key={n}>{i.filename}</div>)}
            </>
        );
    }

}

