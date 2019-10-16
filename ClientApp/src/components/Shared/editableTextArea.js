import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, } from '@fortawesome/free-solid-svg-icons';

import './editableTextArea.css';

function editableTextArea(TextArea) {
    return class extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                editing: this.props.editing ? this.props.editing : false,
            }
        }
    
        render() {
            const {
                value,
                onValueSubmit,
                ...otherProps } = this.props;
    
            let content;

            if (!this.state.editing) {
                content = (
                    <div className="editable-text-area-content">
                        <TextArea value={value}/>
                    </div>
                );
            }
            else {
                content = (
                    <div className="editable-text-area-content">
                        <SubmitTextArea 
                            onSubmit={this.onTextAreaSubmit}
                            value={value}
                            />
                    </div>
                );
            }

            return (
                <div className="editable-text-area">
                    {content}
                    <button 
                        onClick={() => this.toggleEditor(true)}
                        className="btn"
                    >
                        <FontAwesomeIcon icon={faPen} />
                    </button>
                </div>
                
            )
    
        }

        toggleEditor = () => {
            this.setState({
                ...this.state,
                editing: !this.state.editing,
            });
        }

        onTextAreaSubmit = (textAreaValue) => {
            this.props.onValueSubmit(textAreaValue);
            this.toggleEditor(false);
        }
    };
}

class SubmitTextArea extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || '',
            name: this.props.name || 'textarea',
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        this.setState({
            value: e.target.value,
        });
    }

    getValue() {
        return this.state.value;
    }

    submit = () => {
        this.props.onSubmit(this.state.value);
    }

    render() {
        return (
            <div className="submit-text-area-box">
                {this.props.label && this.props.id &&
                    <label htmlFor={this.props.id}>
                        {this.props.label}
                    </label>}
                {this.props.id ?
                    <textarea
                        name={this.props.name}
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                            id={this.props.id}
                        />
                    :
                    <textarea
                            name={this.props.name}
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                        />}
                <div className="submit-text-area-submit-box">
                    <button class='btn btn-primary' onClick={this.submit}>{
                        this.props.buttonText ?
                            this.props.buttonText
                        :
                            'Submit'
                    }</button>
                </div>
            </div>
        );
    }
}

export { editableTextArea };