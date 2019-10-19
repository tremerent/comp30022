import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './NotFound.css';

export default class NotFound extends Component {
    render() {
        return (
            <div className="af-not-found-outer">
                <div className="af-not-found-inner card text-white bg-danger mb-3">
                    <div className="card-header">404</div>
                    <div className="card-body">
                        <h4 className="card-title">Sorry!<br />Page not found.</h4>
                        <Link to="/">
                            <button className="btn btn-primary my-3">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

