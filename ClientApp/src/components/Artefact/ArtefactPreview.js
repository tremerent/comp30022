import React, { Component } from 'react';

import CategoriesPreview from '../Category/CategoriesPreview.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkSquareAlt } from '@fortawesome/free-solid-svg-icons';

export class ArtefactPreview extends Component {

    render() {
        let carouselId = `artefact-preview-carousel-${this.props.artefact.id}`;

        function categoryJoinsToCategories(categoryJoins) {
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

        return (
            <div className="artefact-preview border-light" style={{width: '18rem'}}>
                <div id={carouselId} className="carousel slide artefact-preview-carousel" data-ride="carousel" data-interval="false">
                  <ol className="carousel-indicators">
                    <li data-target={`#${carouselId}`} data-slide-to="0" className="active"></li>
                    <li data-target={`#${carouselId}`} data-slide-to="1"></li>
                    <li data-target={`#${carouselId}`} data-slide-to="2"></li>
                  </ol>
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                          <img
                                src='https://www.ricefurniture.com.au/content/images/thumbs/0002652_vintage-vase_550.jpeg'
                                className="d-block"
                                style={{ height: '12rem', margin: '0 auto' }}
                                alt="THIS IS SOME ALT TEXT"/>
                    </div>
                    <div className="carousel-item">
                          <img
                                src="https://images.crateandbarrel.com/is/image/Crate/GeoVaseSHS17/?$web_product_hero$&190411135054&wid=625&hei=625"
                                className="d-block"
                                style={{ height: '12rem', margin: '0 auto' }}
                                alt="THIS IS SOME ALT TEXT"/>
                    </div>
                    <div className="carousel-item">
                          <img
                                src="https://images1.novica.net/pictures/4/p298885_2_400.jpg"
                                className="d-block"
                                style={{ height: '12rem', margin: '0 auto' }}
                                alt="THIS IS SOME ALT TEXT"/>
                    </div>
                  </div>
                  <a className="carousel-control-prev" href={`#${carouselId}`} role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                  </a>
                  <a className="carousel-control-next" href={`#${carouselId}`} role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                  </a>
                </div>
                <div className="card-body">
                    <div className="text-center">
                    <h5 className="card-title">{this.props.artefact.title}
                        </h5>
                        </div>
                    <p className="card-text text-muted">{this.props.artefact.description}</p>
                    <hr />
                    <CategoriesPreview
                        categories={categoryJoinsToCategories(this.props.artefact.categoryJoin)}
                    > </CategoriesPreview>
            
                    <div className="text-right">
                        <a className="card-link" href={`/artefact/${this.props.artefact.id}`}>
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

