import React, { Component } from 'react';
import $ from 'jquery';

export class ArtefactPreview extends Component {
    constructor(props) {
        super(props);
        //this.state = { };
    }

    render() {
        let carouselId = `artefact-preview-carousel-${this.props.artefact.id}`;
        // TODO(sam): make the carousel always have a 16:9 ratio and fill the
        // width of its parent element.
        return (
<div class="artefact-preview" style={{width: '18rem'}}>
    <div id={carouselId} class="carousel slide artefact-preview-carousel" data-ride="carousel" data-interval="false">
      <ol class="carousel-indicators">
        <li data-target={`#${carouselId}`} data-slide-to="0" class="active"></li>
        <li data-target={`#${carouselId}`} data-slide-to="1"></li>
        <li data-target={`#${carouselId}`} data-slide-to="2"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
              <img
                    src='https://www.ricefurniture.com.au/content/images/thumbs/0002652_vintage-vase_550.jpeg'
                    class="d-block"
                    style={{ height: '12rem', margin: '0 auto' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
        <div class="carousel-item">
              <img
                    src="https://images.crateandbarrel.com/is/image/Crate/GeoVaseSHS17/?$web_product_hero$&190411135054&wid=625&hei=625"
                    class="d-block"
                    style={{ height: '12rem', margin: '0 auto' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
        <div class="carousel-item">
              <img
                    src="https://images1.novica.net/pictures/4/p298885_2_400.jpg"
                    class="d-block"
                    style={{ height: '12rem', margin: '0 auto' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
      </div>
      <a class="carousel-control-prev" href={`#${carouselId}`} role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href={`#${carouselId}`} role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <div className="card-body">
        <h5 className="card-title">{this.props.artefact.title}</h5>
        <p className="card-text">{this.props.artefact.description}</p>
        <div class='card-text artefact-preview-view-more'>
            <a href={`/artefact/${this.props.artefact.id}`}>
                View full page ▶ {/* <- U+25B6 */}
            </a>
        </div>
    </div>
</div>
       );
   }
}

