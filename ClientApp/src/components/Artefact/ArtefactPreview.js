import React, { Component } from 'react';

export class ArtefactPreview extends Component {

    render() {
        let carouselId = `artefact-preview-carousel-${this.props.artefact.id}`;
       return (
<div className="artefact-preview" style={{width: '18rem'}}>
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
        <h5 className="card-title">{this.props.artefact.name}</h5>
        <p className="card-text">{this.props.artefact.description}</p>
        <div className='card-text artefact-preview-view-more'>
            <a href={`/artefact/${this.props.artefact.id}`}>
                View full page ▶ {/* <- U+25B6 */}
            </a>
        </div>
    </div>
</div>
       );
   }
}

