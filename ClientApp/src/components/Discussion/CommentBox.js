import React from 'react';

import './CommentBox.css';

export default class CommentBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            body: this.props.value || '',
        };
    }

    onChange = (event)  => {
        this.setState({ ...this.state, body: event.target.value });
    }

    clearInput() {
        this.setState({ ...this.state, body: '' });
    }

    onCancel = e => {
        e.preventDefault();
        this.clearInput();
        this.props.onCancel && this.props.onCancel();
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.onSubmit(this.state.body);
        this.clearInput();
    }

    render() {
        return (
            <form
                    className='af-cbox'
                    onSubmit={this.onSubmit}
            >
                <textarea
                        value={this.state.body}
                        onChange={this.onChange}
                        className="form-control"
                />
                <div className='af-cbox-actions'>
                    <button
                            className='btn btn-secondary'
                            onClick={this.onCancel}
                    >
                        Cancel
                    </button>
                    <input
                            type='submit'
                            className='btn btn-primary'
                            value="Post"
                    />
                </div>
            </form>
        );
    }

}

