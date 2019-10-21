import React, { Component } from 'react';
import { Link, } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import ImageCarousel from  '../Shared/ImageCarousel.js';

import './ArtefactPreview.css';

export default class ArtefactPreview extends Component {

    constructor(props) {
        super(props);

        this.state = { descToggle: false };
    }

    render() {
        const a = this.props.artefact;

        const id = `af-artcard-desc-${a.id}`;
        const carouselId = `af-artdoc-carousel-${this.props.artefact.id}`;

        return (
            <div className="af-artcard">
                <ImageCarousel
                    id={carouselId}
                    items={a.images}
                    getId={x => x.id}
                    activeId={
                            a.images
                        &&  a.images[0]
                        &&  a.images[0].id
                    }
                />
                <div className="af-artcard-body">
                    <div className="af-artcard-header">
                        <div className='af-artcard-title-owner'>
                            <h5 className="af-artcard-title">{a.title}</h5>
                            {/*<p className="text-muted af-artcard-text">{a.description}</p>*/}
                            {/*<span className="af-artcard-separator"/>*/}
                            <Link className='af-artcard-owner'
                                to={a.owner && a.owner.username ? `/user/${a.owner.username}` : ``}
                            > {a.owner && a.owner.username ? a.owner.username : ''} </Link>
                        </div>
                        <div className="af-artcard-categories">
                            {this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                                <Link
                                        to={`/browse?category=${c.name}`}
                                        key={c.id}
                                        className="badge badge-decal-text mx-1"
                                >
                                    {c.name}
                                </Link>
                            )}
                        </div>
                        <span className="af-artcard-actions">
                            <p className="af-artcard-action badge badge-decal-text mx-1"> {`${a.questionCount} questions}`} </p>
                            <p className="af-artcard-action badge badge-decal-text mx-1"> {`${a.questionCount} comments}`} </p>
                            <Link className="af-artcard-action" to={`/artefact/${a.id}`}>
                                View Full Page ↗ {/* <- U+2197 */}
                            </Link>
                        </span>
                    </div>
                    <div className="text-muted af-artcard-desc" id={id}>
                        <hr/>
                        <p>{a.description}</p>
                    </div>
                </div>
            </div>
        );
    }

    categoryJoinsToCategories(categoryJoins) {
        return categoryJoins.map((cj) => {
            if (cj.categoryId && cj.category) {
                return {
                    id: cj.categoryId,
                    name: cj.category.name,
                };
            }
            else {
                return null;
            }
        }).filter(cat => cat !== null);
    }
}

export { ArtefactPreview };

