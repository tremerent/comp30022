import React from 'react';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

import ImageCarousel from  '../Shared/ImageCarousel.js';

import './ArtefactInfo.css';

export default class ArtefactInfo extends React.Component {
    render() {
        const a = this.props.artefact;
        const id = `af-artcard-desc-${a.id}`;
        const carouselId = `af-artdoc-carousel-${this.props.artefact.id}`;

        return (
            <div className='af-ai'>
                <div className='af-ai-carousel'>
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
                </div>
                <div className='af-ai-info'>
                    <h3 className="af-ai-title">{a.title}</h3>
                    <Link
                            className='af-ai-owner'
                            to={
                                a.owner && a.owner.username ?
                                    `/user/${a.owner.username}` : ``
                            }
                    >
                        {a.owner && a.owner.username ? a.owner.username : ''}
                    </Link>

                    <div className="af-ai-categories">
                        {this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                            <Link
                                    to={`/browse?category=${c.name}`}
                                    key={c.id}
                                    className="badge badge-decal-text mx-1 af-ai-badge"
                            >
                                {c.name}
                            </Link>
                        )}
                    </div>
                    <p className='text-muted af-ai-desc'>
                        {a.description}
                    </p>
                    {
                        this.props.auth.isOwner && (
                            <div className='af-ai-vis'>
                                <FontAwesomeIcon icon={faEye}/>{' '}
                                {
                                    (a.visibility === 'public') ? (
                                        'This artefact is visible to everyone.'
                                    ) : (a.visibility === 'private') ? (
                                        'This artefact is only visible to you.'
                                    ) : (
                                        '???'
                                    )
                                }
                            </div>
                        )
                    }
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
