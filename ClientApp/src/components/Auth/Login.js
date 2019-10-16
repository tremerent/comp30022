import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { PropTypes } from 'prop-types';


import { auth } from '../../redux/actions';
import { formToJson } from '../../scripts/utilityService';

import AuthLayout from './AuthLayout';
import './Auth.css';
import { bindActionCreators } from 'redux';

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

        const component = this;

        this.props.login(loginData)
            .then(() => {
                if (component.props.isLoggedIn) {
                    const nextDir =
                        component.props.redirAddr
                            ? component.props.redirAddr
                            : '/my-artefacts';

                    this.props.push(nextDir);
                }
                else {
                    // TODO: handle login error
                }
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
    isLoggedIn: state.auth.isLoggedIn,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ login: auth.login, push, }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (Login);

