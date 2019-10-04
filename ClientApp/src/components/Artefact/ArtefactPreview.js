import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import './ArtefactPreview.css';

function ArtefactCarousel(props) {
    const a = props.artefact;
    const id = `af-artcard-carousel-${a.id}`;
    if (!a.images)
        return <p> TODO real sexy broken image thingo </p>;

    return (

<div
    id={id}
    className="carousel slide af-artcard-carousel"
    data-ride="carousel"
    data-interval="false"
>
       <ol className="carousel-indicators">
           {Array.from(a.images.keys()).map(n => (
               <li
                   data-target={`#${id}`}
                   key={n}
                   data-slide-to={n}
                   className={n ? undefined : 'active'}
               >
               </li>
           ))}
       </ol>
       <div className="carousel-inner">
           {Array.from(a.images.keys()).map(n => (
               <div className={n !== 0 ? 'carousel-item' : 'carousel-item active'} key={n}>
                    <img
                        src={a.images[n]}
                        className='d-block af-artcard-image'
                        alt={a.title}
                    />
               </div>
           ))}
       </div>
    <a className="carousel-control-prev" href={`#${id}`} role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="sr-only">Previous</span>
    </a>
    <a className="carousel-control-next" href={`#${id}`} role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="sr-only">Next</span>
    </a>
</div>

    );
}

export class ArtefactPreview extends Component {

    constructor(props) {
        super(props);

        this.state = { descToggle: false };
    }

    render() {
        const a = this.props.artefact;
        const id = `af-artcard-desc-${a.id}`;

        return (
            <div className="af-artcard">
                <ArtefactCarousel artefact={a}/>
                <div className="af-artcard-body">
                    <div className="af-artcard-header">
                        <div className='af-artcard-title-owner'>
                            <h5 className="af-artcard-title">{a.title}</h5>
                            {/*<p className="text-muted af-artcard-text">{a.description}</p>*/}
                            {/*<span className="af-artcard-separator"/>*/}
                                        <a className='af-artcard-owner'
                                            href={a.owner && a.owner.username ? `/user/${a.owner.username}` : ``}
                                        >
                                {a.owner ? a.owner.username : ""}
                            </a>
                        </div>
                        <div className="af-artcard-categories">
                            {this.categoryJoinsToCategories(a.categoryJoin).map(c =>
                                <Link
                                        to={`/browse?category=${c.id}`}
                                        key={c.id} className="badge badge-decal-text mx-1"
                                >
                                    {c.name}
                                </Link>
                            )}
                        </div>
                        <span className="af-artcard-actions">
                            <a
                                href="#null"
                                className="af-artcard-action"
                                data-toggle="collapse"
                                data-target={`#${id}`}
                                onClick={
                                    e => {
                                        e.preventDefault();
                                        this.setState({
                                            descToggle: !this.state.descToggle
                                        })
                                    }
                                }
                            >
                                View Description { this.state.descToggle ?
                                        '▼' /* U+25bc */
                                    :
                                        '▶' /* U+25b6 */
                                }
                            </a>
                            <div className="af-artcard-actions-divider"></div>
                            <Link className="af-artcard-action" to={`/artefact/${a.id}`}>
                                View Full Page ↗ {/* <- U+2197 */}
                            </Link>
                        </span>
                    </div>
                    <div className="text-muted af-artcard-desc collapse" id={id}>
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
                    id: cj.category.id,
                    name: cj.category.name,
                };
            }
            else {
                return null;
            }
        }).filter(cat => cat !== null);
    }
}

