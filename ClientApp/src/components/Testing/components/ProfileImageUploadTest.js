import React from 'react';
import { connect } from 'react-redux';

import { setProfileImage } from '../../../scripts/requests';

class ProfileImageUploadTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
        }
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} method="post" action="profile/setprofileimage" enctype="multipart/form-data">
                    <h5> Upload profile image </h5>

                    <input type="text" name="userId" />

                    <hr class="my-2" />
                    <label for="file" class="mr-2"> <strong> Upload image: </strong> </label>

                    <label class="btn mt-2 btn-outline-info">
                        Browse
                        <input type="file" name="file" style={{ display: "none" }} onChange={this.onChangeHandler}/>

                    </label>

                    <button type="submit" class="btn btn-primary"> Submit </button>
                </form>
            </div>
        );
    }

    onChangeHandler = event => {
        this.setState({
            ...this.state,
            selectedFile: event.target.files[0],
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        setProfileImage(this.state.selectedFile)
            .then((respData) => {
                console.log('profile image set');
                console.log(respData);
            });
    }
}

// mapStateToProps = (state) => {
//     return {
//         // state.auth.
//     }
// }

export default connect(null, null) (ProfileImageUploadTest);
