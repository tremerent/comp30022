import React from 'react';

import $ from 'jquery';

import ImageCarousel from '../ImageCarousel.js';

import './ArtefactDocs.css';

export default class ArtefactDocs extends React.Component {

    constructor(props) {
        super(props);

        if (!props.artefact.docs)
            props.artefact.docs = [];

        this.state = {
            image: props.artefact.docs.filter(x => x.type === 'image'),
            file: props.artefact.docs.filter(x => x.type === 'file'),
        };
        this.state.active = this.state.image.length && this.state.image[0].id;
    }

    deleteItem(type, n) {
        let newItems = Array(this.state[type]);
        newItems.splice(n, 1);
        if (type === 'image' && n === this.state.active/* TODO: how to get carousel position? */) {
            $(`#af-artdoc-${this.props.artefact.id}`).carousel('prev')
                .on('slid.bs.carousel', e => {
                    console.log(`active <- ${e.to}`);
                    this.setState({ ...this.state, active: e.to, [type]: newItems })
                });
        }
        console.log(JSON.stringify(this.state[type]));
        //this.setState({ ...this.state, [type]: newItems });
    }

    addItem(item) {
        let newActive = this.state.active;
        if (item.type === 'image')
            newActive = item.id;
        this.setState({
            ...this.state,
            active: newActive,
            [item.type]: [ ...this.state[item.type], item ]
        });
    }

    docListItem = (item, n, alt) => {
        const linkCarousel = item.type === 'image' ? {
                ['data-target']: `#af-artdoc-${this.props.artefact.id}`,
                ['data-slide-to']: n,
            } : { };
        return (
            <li
                    className={`af-artdoc-listitem ${alt}`}
                    key={item.id}
                    {...linkCarousel}
            >
                {item.title}
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

    onChangeHandler = event => {
        this.addItem({
                id: Date.now(),
                title: event.target.files[0].name,
                url: URL.createObjectURL(event.target.files[0]),
                type: 'image',
            });
    }

    render() {
        return (
            <>
                <ImageCarousel
                    id={`af-artdoc-${this.props.artefact.id}`}
                    items={this.state.image}
                    getId={x => x.id}
                    activeId={this.state.active}
                    renderFrame={(image, n) => (
                        <>
                            <img
                                    src={image.url}
                                    className='d-block af-artdoc-image'
                                    alt={image.title}
                            />
                            <button
                                    className='btn btn-secondary af-docs-delimg'
                                    onClick={this.deleteItem.bind(this, 'image', n)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                />
                <div className='af-artdoc-upload'>
                    <h6 className='af-artdoc-upload-desc'>Upload images and documentation</h6>
                    <label class="btn mt-2 btn-outline-info af-artdoc-browse">
                        Browse
                        <input type="file" name="file" style={{ display: "none" }} onChange={this.onChangeHandler}/>
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

