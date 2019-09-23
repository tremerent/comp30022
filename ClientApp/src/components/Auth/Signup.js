
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { push } from 'connected-react-router';

import { auth } from '../../redux/actions';
import { formToJson } from '../../scripts/utilityService';

import AuthLayout from './AuthLayout';
import './Auth.css';
import { bindActionCreators } from 'redux';

class Signup extends React.Component {

    render() {
        return <AuthLayout component={this.signupForm} loading={this.props.loading} />;
    }

    signupForm = () => {
        return (
            <>
                <h5>Signup</h5>
                <h6> Connect with family and register your artefacts. </h6>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <div className="text-danger"></div>
                    <div className="form-group">
                        <label for='username' >Username</label>
                        <input name='username' className="form-control" />
                    </div>
                    <div className="form-group">
                        <label for='email'>Email</label>
                        <input name='email' className="form-control" />
                    </div>
                    <div className="form-group">
                        <label for='password'>Password</label>
                        <input name='password' text='password' className="form-control" type='password' />
                    </div>
                    <div className="form-group">
                        <label for='confirmpassword'>Confirm password</label>
                        <input name='confirmpassword' className="form-control" type='password' />
                        <span className="text-danger"></span>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
            </>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const regData = formToJson(e.target);

        this.props.register(regData)
            .then(() => {
                // TODO: handle username already taken
                if (this.props.error) {

                }
                else {
                    const nextDir = this.props.redir ? this.props.redir : '/my-artefacts';
                    this.props.push(nextDir);
                }
            });
    }
}

Signup.propTypes = {
    register: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    redir: PropTypes.string,
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    redir: state.auth.redir,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ register: auth.register, push, }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Signup);

