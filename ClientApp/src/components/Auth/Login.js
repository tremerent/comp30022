import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PropTypes } from 'prop-types';

import { auth } from '../../redux/actions';
import { formToJson } from '../../scripts/utilityService';

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
        return (
            <>
                <h3>Log in to your Artefactor account</h3>
                <div className="row">
                    <div className="col-md-4">
                        <form onSubmit={this.handleSubmit}>
                            <hr />
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input name="username" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input name="password" className="form-control" type="password" />
                            </div>
                            <div className="form-group form-check">
                                <input name="rememberMe" type="checkbox" value="" className="form-check-input" />
                                <label htmlFor="rememberMe" className="form-check-label">
                                    Remember me
                                </label>
                            </div>

                            <div className="form-row justify-content-start my-3">
                                <div className="col-xs-3 mx-1">
                                    <a className="btn btn-outline-secondary" to="/auth/signup">Signup</a>
                                </div>
                                <div className="col-xs-3">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </div>
               
                        </form>
                    </div>
                </div>
            </>
        );

        //<div class="form-group">
        //    <p>
        //        <a disabled>Forgot your password?</a>
        //    </p>
        //</div>


        //return (
        //    <div>
        //        <h3>Log in to your Artefactor account</h3>
        //        <form onSubmit={this.handleSubmit}>
        //            <div className="form-group">
        //                <Input
        //                    name='username'
        //                    id='login-username'
        //                    label='Username'
        //                    checks={[[ /\W+/, 'Username may only contain letters, numbers, and underscores ("_").' ]]}
        //                >
        //                </Input>
        //                <Input name='password' id='login-password' type='password' label='Password'></Input>

        //                <button className="form-submit" type="submit">Log In</button>
        //            </div>
        //        </form>
        //    </div>
        //);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const loginData = formToJson(e.target);

        this.props.login(loginData)
            .then((t) => {
                console.log(t);
            });
    }
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ login: auth.login }, dispatch);
};

export default connect(
    null,
    mapDispatchToProps
) (Login);

