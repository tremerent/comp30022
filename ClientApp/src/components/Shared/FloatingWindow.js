import React from 'react';

import './FloatingWindow.css';

export default class FloatingWindow extends React.Component {

    render() {
        return (
            <div
                    className={`modal fade`}
                    id={this.props.id}
                    role="dialog"
                    aria-hidden="true"
            >
                <div className="modal-dialog container modal-vert-center" role="document">
                    <div className="modal-content">
                        {
                            this.props.showHeader
                            ?
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            :
                            null
                        }
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}

