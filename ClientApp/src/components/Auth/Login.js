import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { PropTypes } from 'prop-types';


import { auth } from '../../redux/actions';
import { formToJson } from '../../scripts/utilityService';

import AuthLayout from './AuthLayout';
import './Auth.css';

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
                        name={this.props.name}
                            value={this.state.value}
                            onChange={this.onChange}
                            className="form-control"
                            type={this.type}
                            id={this.props.id}
                        />
                    :
                    <input
                            name={this.props.name}
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

class Login extends React.Component {

    render() {
        return <AuthLayout component={this.loginForm} loading={this.props.loading} />;
    }

    loginForm = () => {
        return (
            <>
                <h3>Log in</h3>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input name="username" className="form-control" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input name="password" className="form-control" type="password" />
                    </div>
                    <div className="form-row justify-content-start my-3">
                        <div className="col-xs-3 mx-1">
                            <Link to="/auth/signup">
                                <button className="btn btn-outline-secondary">
                                    Signup
                                                </button>
                            </Link>
                        </div>
                        <div className="col-xs-3">
                            <button type="submit" className="btn btn-primary">Login</button>
                        </div>
                    </div>
                </form>
            </>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const loginData = formToJson(e.target);

        this.props.login(loginData)
            .then((t) => {
                // TODO: handle e

                const nextDir =
                    this.props.redir
                        ? this.props.redir
                        : '/my-artefacts';
                push(nextDir);
            });
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    redir: PropTypes.string,
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    redir: state.auth.redir,
});

const mapDispatchToProps = dispatch => {
    return {
        login: (details) => {
            dispatch(auth.login(details))
        },
        push: (dir) => {
            dispatch(push(dir));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (Login);

