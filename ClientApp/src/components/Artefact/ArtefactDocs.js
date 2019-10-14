import React from 'react';
import $ from 'jquery';

import ImageCarousel from '../ImageCarousel.js';

import './ArtefactDocs.css';

export default class ArtefactDocs extends React.Component {

    constructor(props) {
        super(props);

        if (!props.artefact.docs)
            props.artefact.docs = [];

        this.CAROUSEL_ID = `af-artdoc-carousel-${this.props.artefact.id}`;
        this.CAROUSEL_SELECTOR = `#${this.CAROUSEL_ID}`;

        this.onChange = this.props.onChange || (() => {});

        this.state = {
            image: props.artefact.docs.filter(x => x.type === 'image'),
            file: props.artefact.docs.filter(x => x.type === 'file'),
        };
        this.state.activeItemId =
            this.state.image.length && this.state.image[0].id;
    }

    currentCarouselItemId() {
        const e = document.querySelector(
                this.CAROUSEL_SELECTOR
                    +   ' .carousel-item.active'
                    +   ' .af-artdoc-image-wrapper'
            );
        return e && e.getAttribute('imageid');
    }

    deleteItem(items, n) {
        const item = this.state[items][n];

        // TODO(sam): Somehow add nice transition on delete last carousel item.

        let newItems = [ ...this.state[items] ];
        newItems.splice(n, 1);

        // If item is an image currently displayed on the carousel, need to make
        // the carousel do sexy moves on delete, otherwise it does a super
        // un-sexy flickery thing.
        // We check the length first because currentCarouselItemId() performs
        // a document.querySelector() -- which in Sam's uninformed opinion may
        // be expensive -- thus we want to short-circuit wherever possible.
        if  (
                    item.type === 'image'
                &&  this.state.image.length > 1
                &&  item.id === this.currentCarouselItemId()
            ) {

            let direction = n === this.state[items].length - 1 ? 'prev':'next';

            // Loads of exhausting boilerplatey stuff because bootstrap, AFAICT
            // (althought that isn't very far since there don't seem to be any
            // frickin docs further than the single paragraph in their
            // "Javascript" page) doesn't have a way to remove event listeners.
            if (!this.hasSlidListener) {
                this.hasSlidListener = true;
                $(this.CAROUSEL_SELECTOR).on('slid.bs.carousel', e => {
                        if (!this.deleting)
                            return;
                        this.state.activeItemId =
                            this.state[this.deleting.from][e.to].id;
                        this.setState({
                            ...this.state,
                            [this.deleting.from]: this.deleting.to,
                        })
                        this.onChange(
                                this.deleting.item, 'delete', this.deleting.to
                            );
                        this.deleting = null;
                    });
            }

            this.deleting = { item, from: items, to: newItems };
            $(this.CAROUSEL_SELECTOR).carousel(direction);
        } else {
            this.setState({ ...this.state, [items]: newItems });
            this.onChange(item, 'delete', newItems);
        }
    }

    addItem(item) {
        let newItems = [ ...this.state[item.type], item ];
        this.setState({
            ...this.state,
            moveCarousel: item.type === 'image',
            activeItemId: item.id,
            [item.type]: newItems,
        });
        this.onChange(item, 'create', newItems);
    }

    docListItem = (item, n, alt) => {
        const linkCarousel = item.type === 'image' ? {
                ['data-target']: this.CAROUSEL_SELECTOR,
                ['data-slide-to']: n,
            } : { };

        const clickable = item.type === 'image' ?
            'af-artdoc-listitem-clickable' : '';

        return (
            <li
                    className={`af-artdoc-listitem ${clickable} ${alt}`}
                    key={item.id}
            >
                <span className='af-artdoc-filename' {...linkCarousel}>
                    {item.title}
                </span>
                <button
                        className='btn btn-secondary af-artdoc-listitem-del'
                        onClick={this.deleteItem.bind(this, item.type, n)}
                >
                    X
                </button>
            </li>
        );
    }

    docList = (type, title) => {
        return (
            <>
                {!!this.state[type].length &&
                    <h6 className='af-artdoc-list-title'>{title}:</h6>
                }
                <ul className='af-artdoc-list'>
                    {this.state[type].map(
                        (item, n) => this.docListItem(
                            item, n, n % 2 ? '' : 'alt')
                    )}
                </ul>
            </>
        );
    }

    addFileHandler = event => {
        this.addItem({
                // V. important that id is stringified.
                // Don't ask.
                // -- Sam
                id: `${Date.now()}`,
                title: event.target.files[0].name,
                url: URL.createObjectURL(event.target.files[0]),
                blob: event.target.files[0],
                type: 'image',
                isNew: true,
            });
    }

    componentDidUpdate() {
        if (this.state.moveCarousel) {
            $(this.CAROUSEL_SELECTOR).carousel(this.state.image.length - 1);
            this.state.moveCarousel = false;
        }
    }

    render() {
        return (
            <>
                <ImageCarousel
                    id={this.CAROUSEL_ID}
                    items={this.state.image}
                    getId={x => x.id}
                    activeId={this.state.activeItemId}
                    renderFrame={(image, n) => (
                        <div
                                className='af-artdoc-image-wrapper'
                                imageid={image.id}
                        >
                            <img
                                    src={image.url}
                                    className='d-block af-artdoc-image'
                                    alt={image.title}
                            />
                            <button
                                    className='btn btn-secondary af-docs-delimg'
                                    onClick={
                                        this.deleteItem.bind(this, 'image', n)
                                    }
                            >
                                Delete
                            </button>
                        </div>
                    )}
                />
                <div className='af-artdoc-upload'>
                    <h6 className='af-artdoc-upload-desc'>
                        Upload images and documentation
                    </h6>
                    <label class="btn mt-2 btn-outline-info af-artdoc-browse">
                        Browse
                        <input
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={this.addFileHandler}
                        />
                    </label>
                </div>
                <div className='af-artdoc-lists'>
                    {this.docList('image', "Images")}
                    {this.docList('file', "Documents")}
                </div>
            </>
        );
    }
}

