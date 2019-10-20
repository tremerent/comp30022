import React from 'react';

class SignupForm extends React.Component {

    constructor(props) {
        super(props);

        this.noUNameEnteredText = "You'll need a username to signup.";
        this.duplicateUsernameText = "Sorry! This username is already taken.";

        // initialise form state to "", unless parent passes 'formVals'
        this.state = {
            username: this.props.formVals ? this.props.formVals.username : "",
            password: this.props.formVals ? this.props.formVals.password : "",
            confirmpassword: this.props.formVals
                    ? this.props.formVals.confirmpassword
                    : "",
        }
    }

    componentDidMount() {
        this.formUsername =
            document.querySelector('#username');
        this.formPw =
            document.querySelector('#password');
        this.formConfPw =
            document.querySelector('#confirmpassword');
    }

    render() {
        const dupUsernameClass = this.props.duplicateUsername
                ? "is-invalid"
                : "";

        return (
            <div>
                <h5>Signup</h5>
                <h6> Connect with family and register your artefacts. </h6>
                <hr />
                <form onSubmit={this.handleSubmit}>
                    <div className="text-danger"></div>
                    <div className="form-group">
                        <label htmlFor='username' >Username</label>
                        <input id='username'
                            onChange={this.handleChange}
                            value={this.state.username}
                            name='username'
                            className={"form-control " + dupUsernameClass}
                        />
                        <div className="invalid-feedback">
                            {this.props.duplicateUsername
                                ? this.duplicateUsernameText
                                : this.noUNameEnteredText}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor='password'>Password</label>
                        <input id='password'
                            onChange={this.handleChange}
                            value={this.state.password}
                            name='password'
                            text='password'
                            className="form-control"
                            type='password'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor='confirmpassword'>Confirm password</label>
                        <input id='confirmpassword'
                            onChange={this.handleChange}
                            value={this.state.confirmpassword}
                            name='confirmpassword'
                            className="form-control"
                            type='password'
                        />
                        <span className="text-danger"></span>
                        <div className="invalid-feedback">
                            Sorry! Passwords did not match.
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign up</button>
                </form>
            </div>
        );
    }

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.formValidate()) {
            const signupData = {
                username: this.state.username,
                password: this.state.password,
                confirmpassword: this.state.confirmpassword,
            };

            this.props.signup(signupData);
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }

    // validation - TODO: it would really be better to be using state for this

    formValidate = () => {

        // validators set styling as side effect

        function passwordValid() {
            if (this.state.password.length === 0) {
                this.noPasswordEntered();
                return false;
            }
            else if (this.state.password !== this.state.confirmpassword) {
                this.nonSamePassword();
                return false;
            }
            else {
                this.samePassword();
            }

            return true;
        }

        function userNameValid() {
            if (this.state.username.length === 0) {
                this.noUsernameEntered();
                return false;
            }
            else {
                this.usernameEntered();
            }

            return true;
        }

        // avoid the short circuit

        const pwValid = passwordValid.bind(this)();
        const unameValid = userNameValid.bind(this)();

        return pwValid && unameValid;
    }

    noUsernameEntered = () => {
        /* eslint react/no-direct-mutation-state:0 */
        this.state.usernameInvalidText = this.noUNameEnteredText;

        this.formUsername.classList.add("is-invalid");
        this.formUsername.classList.remove("is-valid");
    }

    usernameEntered = () => {
        this.formUsername.classList.remove("is-invalid");
        this.formUsername.classList.add("is-valid");
    }

    usernameTaken = () => {
        this.state.usernameInvalidText = this.unameTakenText;

        this.formUsername.classList.add("is-invalid");
        this.formUsername.classList.remove("is-invalid");
    }

    noPasswordEntered = () => {
        this.formPw.classList.add("is-invalid");
        this.formPw.classList.remove("is-valid");
    }

    passwordEntered = () => {
        this.formPw.classList.remove("is-invalid");
        this.formPw.classList.add("is-valid");
    }

    nonSamePassword = () => {
        this.formConfPw.classList.add("is-invalid");
        this.formConfPw.classList.remove("is-valid");

        this.formPw.classList.add("is-invalid");
        this.formPw.classList.remove("is-valid");
    }

    samePassword = () => {
        this.formConfPw.classList.remove("is-invalid");
        this.formConfPw.classList.add("is-valid");

        this.formPw.classList.remove("is-invalid");
        this.formPw.classList.add("is-valid");
    }
}

export default SignupForm;
