import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import './EditTextArea.css';

export default class EditTextArea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            editing: this.props.editing,
            value: this.props.value || this.props.children,
        };

        this.adjustTaHeight = true;
    }

    toggle = () => {
        this.setState({ ...this.state, editing: !this.state.editing });
    }

    cancel = () => {
        this.setState({
            ...this.state,
            value: this.props.value || this.props.children,
            editing: !this.state.editing,
        });
    }

    submit = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.value);
        this.toggle();
    }

    componentDidUpdate() {
        if (this.state.editing) {
            this.textarea.focus();
        }
        if (this.adjustTaHeight)
            this.forceUpdate();
    }

    onChange = (e) => {
        this.setState({ ...this.state, value: e.target.value });
    }

    render() {
        const childProps = {
            ...this.props,
            className: undefined,
            children: undefined,
            editable: undefined,
            onChange: undefined,
        };

        let taHeight;
        if (this.adjustTaHeight) {
            taHeight = this.textarea && this.textarea.scrollHeight + 3 + 'px';
            this.adjustTaHeight = false;
        } else {
            taHeight = 0;
            this.adjustTaHeight = true;
        }

        const active = this.state.editing ? 'active' : '';

        return (
            <div {...childProps} className={'edit-text-area-outer ' + active + ' ' + this.props.className}>
            {
                this.state.editing ? (
                    <textarea
                        ref={t => this.textarea = t}
                        className='edit-text-area'
                        value={this.state.value}
                        onChange={this.onChange}
                        style={{ height: taHeight }}
                    />
                ) : (
                    <p>{this.props.children}</p>
                )
            }
            {
                this.props.editable && (
                    <div className='edit-text-area-button-group-outer'>
                    <div className='edit-text-area-button-group'>
                    {
                        this.state.editing ? (
                            <>
                            <button className='btn edit-text-area-button cancel' onClick={this.cancel}>
                                X
                            </button>
                            <button className='btn edit-text-area-button submit' onClick={this.submit}>
                                <FontAwesomeIcon icon={faCheckCircle} />
                            </button>
                            </>
                        ) : (
                            <button className='btn edit-text-area-button edit' onClick={this.toggle}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                        )
                    }
                    </div>
                    </div>
                )
            }
            </div>
        );

    }

}

