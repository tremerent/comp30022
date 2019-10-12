import React from 'react';

import './ProfilePicture.css';

export default class ProfilePicture extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="profile-pic">
                <img
                    src={ this.props.imageUrl ?
                          this.props.imageUrl
                        :
                            '/img/profile-placeholder.png'
                    }
                    className='profile-pic-img'
                />
                {
                    this.props.editable
                    ?
                    <div className="profile-pic-overlay">
                        <label className="btn btn-primary">
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