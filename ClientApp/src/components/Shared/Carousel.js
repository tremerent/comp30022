import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft, } from '@fortawesome/free-solid-svg-icons';

export default function Carousel({ id, items, activeFrame, activeId, renderFrame = x => x, getId }) {
    // This doesn't work at the moment, so have to specify activeFrame
    // or activeId.
    if (activeId === null && activeFrame === null)
        activeFrame = 0;

    return (
<div
    id={id}
    className="carousel slide"
    data-ride="carousel"
    data-interval="false"
>
        {items && items.length > 1 && <>
            <ol className="carousel-indicators">
                {items.map((item, n) => {
                    const id = getId ? getId(item) : n;
                    let className = '';
                    if ((getId && activeId && id === activeId) || (activeFrame !== null && n === activeFrame))
                        className = 'active';
                    return (
                        <li
                            data-target={`#${id}`}
                            key={n}
                            data-slide-to={n}
                            className={className}
                        />
                    );
                })}
            </ol>
        </>}
        <div className="carousel-inner">
            {items.map((item, n, array) => {
                const id = getId ? getId(item) : n;
                let className = 'carousel-item';
                if  (
                        (getId && activeId !== null && id === activeId)
                    ||  (activeFrame !== null && n === activeFrame)
                    )
                    className = className + ' active';
                return (
                    <div
                        key={id}
                        className={className}
                    >
                        {renderFrame(item, n, array)}
                    </div>
                );
            })}
        </div>
    {items && items.length > 1 && <>
        <a className="carousel-control-prev" href={`#${id}`} role="button" data-slide="prev">
            {/* <span className="carousel-control-prev-icon" aria-hidden="true"></span> */}
            <FontAwesomeIcon icon={faChevronLeft} />
            <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href={`#${id}`} role="button" data-slide="next">
            {/* <span className="carousel-control-next-icon" aria-hidden="true"></span> */}
            <FontAwesomeIcon icon={faChevronRight} />
            <span className="sr-only">Next</span>
        </a>
    </>}
</div>
    );
}

