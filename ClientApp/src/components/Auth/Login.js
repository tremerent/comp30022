
import React from 'react';

import { Login as MsftLogin } from '../api-authorization/Login.js';

import authService from './AuthorizeService.js';

class Input extends React.Component {

    constructor(props) {
        super(props);

        this.type = this.props.type || 'text';

        this.state = {
            value: this.props.children || '',
            name: this.props.name || 'input',
        };

        this.onChange = this.onChange.bind(this);
    }

    onChange(e) {
        const checks = this.props.checks || [ ];
        let errmsg;
        for (const [ pattern, msg ] of checks) {
            if (e.target.value.match(pattern)) {
                errmsg = msg;
                break;
            }
        }
        this.setState({
            value: e.target.value,
            errmsg
        });
    }

    render() {
        return (
            <>
                {this.props.label && this.props.id &&
                    <label htmlFor={this.props.id}>
                        {this.props.label}
                    </label>}
                {this.props.id ?
                        <input
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                            type={this.type}
                            id={this.props.id}
                        />
                    :
                        <input
                            value={this.state.value}
                            onChange={this.onChange}
                            type={this.type}
                            className="form-control"
                        />}
                {this.state.errmsg && <div className='input-error-message'>{this.state.errmsg}</div>}
            </>
        );
    }

}

export default class Login extends React.Component {

    constructor(props) {
        super(props);

        this.state = { };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit() {
        console.log("======================= SUBMITTED ======================");
    }

    render() {
        return (
            <div>
                <h3>Log in to your Artefactor account</h3>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <Input
                            id='login-username'
                            label='Username'
                            checks={[[ /\W+/, 'Username may only contain letters, numbers, and underscores ("_").' ]]}
                        >
                        </Input>
                        <Input id='login-password' type='password' label='Password'></Input>

                        <button className="form-submit" type="submit">Log In</button>
                    </div>
                </form>
            </div>
        );
    }

}

