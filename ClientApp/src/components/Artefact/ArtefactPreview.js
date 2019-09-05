import React, { Component } from 'react';

export class ArtefactPreview extends Component {

    render() {
        let a = this.props.artefact;
        let carouselId = `artefact-preview-carousel-${a.id}`;

       return (
<div class="artefact-preview" style={{width: '18rem'}}>
    <div id={carouselId} class="carousel slide artefact-preview-carousel" data-ride="carousel" data-interval="false">
        <ol class="carousel-indicators">
            {Array.from(a.images.keys()).map(n => (
                <li data-target={`#${carouselId}`} key={n} data-slide-to={n} class={n ? undefined : 'active'}></li>
            ))}
        </ol>
        <div class="carousel-inner">
            {Array.from(a.images.keys()).map(n => (
                <div class={n ? 'carousel-item' : 'carousel-item active'}>
                    <img src={a.images[n]} class='d-block' style={{ height: '12rem', margin: '0 auto' }} alt='TODO'/>
                </div>
            ))}
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
        <h5 className="card-title">{a.title}</h5>
        <p className="card-text">{a.description}</p>
        <div className='card-text artefact-preview-view-more'>
            <a href={`/artefact/${a.id}`}>
                View full page ▶ {/* <- U+25B6 */}
            </a>
        </div>
    </div>
</div>
       );
   }
}

