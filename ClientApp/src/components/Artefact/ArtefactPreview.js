import React, { Component } from 'react';

import CategoriesPreview from '../Category/CategoriesPreview.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

import './ArtefactPreview.css';

function ArtefactCarousel(props) {
    const a = props.artefact;
    const id = `af-artefact-preview-carousel-${a.id}`;
    return (

<div
    id={id}
    className="carousel slide artefact-preview-carousel"
    data-ride="carousel"
    data-interval="false"
>
   {a.images &&
       <div>
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
                   <div className={n === 0 ? 'carousel-item' : 'carousel-item active'} key={n}>
                        <img
                            src={a.images[n]}
                            className='d-block af-artefact-preview-image'
                            alt={a.title}
                        />
                   </div>
               ))}
           </div>
        </div>
    }
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

    static categoryJoinsToCategories(categoryJoins) {
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

    render() {
        const a = this.props.artefact;

        return (
            //<div style={{ width: '100%', height: '400px', borderRadius: '10px', backgroundColor: 'grey' }} className='my-3'></div>
<div className="af-artefact-preview">
    <ArtefactCarousel artefact={a}/>
    <div className="card-body">
        <h5 className="text-center card-title">{a.title}</h5>
        <p className="card-text text-muted">{a.description}</p>
        <hr/>
        <CategoriesPreview categories={this.constructor.categoryJoinsToCategories(a.categoryJoin)}>
        </CategoriesPreview>
        <div className="text-right">
            <a className="card-link" href={`/artefact/${a.id}`}>
                <FontAwesomeIcon
                    icon={faExternalLinkSquareAlt}
                    size="2x"
                >
                </FontAwesomeIcon>
           </a>
        </div>
    </div>
</div>
       );
   }
}

