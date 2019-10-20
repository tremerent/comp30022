import React from 'react';

import './ProfilePicture.css';

export default class ProfilePicture extends React.Component {

    render() {
        return (
            <div className="profile-pic">
                <img
                    src={ this.props.imageUrl ?
                          this.props.imageUrl
                        :
                            '/img/profile-placeholder.png'
                    }
                    alt={`${this.props.username}'s profile`}
                    className='profile-pic-img'
                />
                {
                    this.props.editable
                    ?
                    <div className="profile-pic-overlay">
                        <label className="btn btn-primary profile-pic-button">
                                Set profile picture
                                <input type="file" name="file"
                                    style={{ display: "none" }}
                                    onChange={this.handleOnChange}
                                    />
                        </label>
                    </div>
                    :
                    null
                }

            </div>
        );
    }

    handleOnChange = e => {
        e.preventDefault();

        this.props.updateProfilePic(e.target.files[0]);
    }
}
