import React from 'react';

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

    onCancel = () => {
        this.setState({ ...this.state, body: '' });
        this.props.onCancel && this.props.onCancel();
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.onSubmit(this.state.body);
    }

    render() {
        return (
            <form
                    className='af-dh-create'
                    onSubmit={this.onSubmit}
            >
                <textarea
                        value={this.state.body}
                        onChange={this.onChange}
                        className="form-control"
                />
                <div className='af-dh-create-actions'>
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

