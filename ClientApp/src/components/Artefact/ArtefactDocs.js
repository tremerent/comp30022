import React from 'react';
import $ from 'jquery';

import ImageCarousel from '../Shared/ImageCarousel.js';

import './ArtefactDocs.css';

export default class ArtefactDocs extends React.Component {

    constructor(props) {
        super(props);

        this.CAROUSEL_ID = `af-artdoc-carousel-${this.props.id}`;
        this.CAROUSEL_SELECTOR = `#${this.CAROUSEL_ID}`;

        this.onChange = this.props.onChange || (() => {});

        this.updateDocs();

        this.state = {
            activeItemId: this.docs.image.length && this.docs.image[0].id,
        };
    }

    items(type) {
        if (!this.props.value)
            return [];
        return this.props.value.filter(item => item.type === type);
    }

    updateDocs() {
        this.docs = {
            image: this.items('image'),
            file: this.items('file'),
        };
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
        const item = this.docs[items][n];

        let newItems = [ ...this.docs[items] ];
        newItems.splice(n, 1);

        // If item is an image currently displayed on the carousel, need to make
        // the carousel do sexy moves on delete, otherwise it does a super
        // un-sexy flickery thing.
        // We check the length first because currentCarouselItemId() performs
        // a document.querySelector() -- which in Sam's uninformed opinion may
        // be expensive -- thus we want to short-circuit wherever possible.
        if  (
                    item.type === 'image'
                &&  this.docs.image.length > 1
                &&  item.id === this.currentCarouselItemId()
            ) {

            let direction = n === this.docs[items].length - 1 ? 'prev':'next';

            // Loads of exhausting boilerplatey stuff because bootstrap, AFAICT
            // (althought that isn't very far since there don't seem to be any
            // frickin docs further than the single paragraph in their
            // "Javascript" page) doesn't have a way to remove event listeners.
            if (!this.hasSlidListener) {
                this.hasSlidListener = true;
                $(this.CAROUSEL_SELECTOR).on('slid.bs.carousel', e => {
                        if (!this.deleting)
                            return;
                        this.setState({
                            ...this.state,
                            activeItemId: this.docs[this.deleting.from][e.to].id,
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
            this.docs[items] = newItems;
            this.onChange(item, 'delete', newItems);
        }
    }

    addItem(item) {
        let newItems = [ ...this.docs[item.type], item ];
        this.moveCarousel = item.type === 'image';
        this.setState({
            ...this.state,
            activeItemId: item.id,
        });
        this.docs[item.type] = newItems;
        this.onChange(item, 'create', newItems);
    }

    docListItem = (item, n, alt) => {
        const linkCarousel = item.type === 'image' ? {
                'data-target': this.CAROUSEL_SELECTOR,
                'data-slide-to': n,
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
        const items = this.items(type);
        return (
            <>
                {!!items.length &&
                    <h6 className='af-artdoc-list-title'>{title}:</h6>
                }
                <ul className='af-artdoc-list'>
                    {items.map(
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
        if (this.moveCarousel) {
            $(this.CAROUSEL_SELECTOR).carousel(this.docs.image.length - 1);
            this.moveCarousel = false;
        }
        this.updateDocs();
    }

    render() {
        return (
            <>
                <ImageCarousel
                    id={this.CAROUSEL_ID}
                    items={this.items('image')}
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
                    <label className="btn mt-2 btn-outline-info af-artdoc-browse">
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

