
import React from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';

import { auth } from '../../redux/actions';
import SignupForm from './SignupForm';

import AuthLayout from './AuthLayout';
import './Auth.css';

class Signup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            confirmpassword: "",
        }
    }

    render() {
        return (
            <AuthLayout
                component={SignupForm}
                componentProps={{
                    error: this.props.error,
                    duplicateUsername: this.props.error
                        ? this.props.error.code === "DuplicateUserName"
                        : false,
                    signup: this.signup,
                    formVals: {
                        username: this.state.username,
                        password: this.state.password,
                        confirmpassword: this.state.confirmpassword,
                    },
                    updateFormVals: this.updateFormVals,
                }}
                loading={this.props.loading}
            />
        );
    }

    updateFormVals = (formVals) => {
        this.setState(formVals);
    }

    signup = async (signupData) => {

        await this.props.register(signupData);
        console.log('isLoggedIn');
        console.log(this.props.isLoggedIn);


        if (this.props.isLoggedIn) {
            const nextDir = this.props.redir ?
                    this.props.redir
                :
                    `/user/${this.props.username}`;
            this.props.push(nextDir);
        }
        else if (this.props.error) {
            
        }

        // horrible hackyness so SignupForm doesn't have username etc. equal to ""
        // when initialised - todo: redux when more time
        this.setState(signupData);
    }

}

Signup.propTypes = {
    register: PropTypes.func.isRequired,
    loading: PropTypes.bool,
    redir: PropTypes.string,
}

const mapStateToProps = state => ({
    loading: state.auth.loading,
    username: state.auth.user.username,
    redir: state.auth.redir,
    isLoggedIn: state.auth.isLoggedIn,
    error: state.auth.error,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ register: auth.register, push, }, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Signup);

