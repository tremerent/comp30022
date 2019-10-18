import React from 'react';

export default function centreLoading() {
    return (
        <div className="vert-horiz-centre">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}
