import React, { Component } from 'react';
import $ from 'jquery';

export class ArtefactPreview extends Component {
    constructor(props) {
        super(props);
        //this.state = { };
    }

    render() {
        let carouselId = `artefact-preview-carousel-${this.props.artefact.id}`;
       return (
<div className="card" style={{width: '18rem'}}>
    <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      </ol>
      <div class="carousel-inner">
        <div class="carousel-item active">
              <img
                    src='https://www.ricefurniture.com.au/content/images/thumbs/0002652_vintage-vase_550.jpeg'
                    class="d-block w-100"
                    style={{ width: '18rem' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
        <div class="carousel-item">
              <img
                    src="https://images.crateandbarrel.com/is/image/Crate/GeoVaseSHS17/?$web_product_hero$&190411135054&wid=625&hei=625"
                    class="d-block w-100"
                    style={{ width: '18rem' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
        <div class="carousel-item">
              <img
                    src="https://images.crateandbarrel.com/is/image/Crate/GeoVaseSHS17/?$web_product_hero$&190411135054&wid=625&hei=625"
                    class="d-block w-100"
                    style={{ width: '18rem' }}
                    alt="THIS IS SOME ALT TEXT"/>
        </div>
      </div>
      <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
    <div className="card-body">
        <h5 className="card-title">{this.props.artefact.title}</h5>
        <p className="card-text">{this.props.artefact.description}</p>
    </div>
</div>
       );
   }
}

