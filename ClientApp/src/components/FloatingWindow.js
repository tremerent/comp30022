import React from 'react';

import './FloatingWindow.css';

export default class FloatingWindow extends React.Component {

    render() {
        return (
            <div
                    className={`modal fade ${this.props.className}`}
                    id={this.props.id}
                    role="dialog"
                    aria-hidden="true"
            >
                <div className="modal-dialog container" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{this.props.title}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}

