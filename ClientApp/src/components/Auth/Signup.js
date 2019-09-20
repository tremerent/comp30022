
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PropTypes } from 'prop-types';

import { auth } from '../../redux/actions';
import { formToJson } from '../../scripts/utilityService';

class Signup extends React.Component {

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <form onSubmit={this.handleSubmit}>
                        <h5>Connect with family and register your artefacts</h5>
                        <hr />
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
                            <input text='password' className="form-control" type='password' />
                        </div>
                        <div className="form-group">
                            <label for='confirmpassword'>Confirm password</label>
                            <input name='confirmpassword' className="form-control" type='password' />
                            <span className="text-danger"></span>
                        </div>
                        <button type="submit" className="btn btn-primary">Sign up</button>
                    </form>
                </div>
            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const regData = formToJson(e.target);

        this.props.register(regData)
            .then(() => {
                // handle username already taken

            });
    }
}

Signup.propTypes = {
    register: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ register: auth.register }, dispatch);
};

export default connect(
    null,
    mapDispatchToProps
)(Signup);

