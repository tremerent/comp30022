import React from 'react';

export default function Carousel({ id, items, activeFrame = 0, renderFrame = x => x, getId }) {
    return (
<div
    id={id}
    className="carousel slide"
    data-ride="carousel"
    data-interval="false"
>
        {items && items.length > 1 && <>
            <ol className="carousel-indicators">
                {Array.from(items.keys()).map(n => (
                   <li
                       data-target={`#${id}`}
                       key={n}
                       data-slide-to={n}
                       className={n ? undefined : 'active'}
                   />
                ))}
            </ol>
        </>}
        <div className="carousel-inner">
            {items.map((i, n, a) => (
                <div
                        key={getId ? getId(i) : n}
                        className={'carousel-item' + (
                                n === activeFrame ? ' active' : ''
                            )}
                        key={n}
                >
                    {renderFrame(i, n, a)}
                </div>
            ))}
        </div>
    {items && items.length > 1 && <>
        <a className="carousel-control-prev" href={`#${id}`} role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href={`#${id}`} role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
        </a>
    </>}
</div>
    );
}

