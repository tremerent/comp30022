import React from 'react';
//import authService from '../../../components/api-authorization/AuthorizeService';

export default class AuthTest extends React.Component {
    render() {
        return (
            <>
                <button onClick={this.handleOnClick}> </button>
            </>
        );
    }

    handleOnClick = (e) => {
        e.preventDefault();

        //authService.getAccessToken()
        //    .then((token) => {
        //        console.log(token)
        //        const headers = {
        //            'Authorization': `Bearer ${token}`,
        //            'Content-Type': 'application/json'
        //        };

        //        return fetch('/api/profile', {
        //        })
        //    });
    }
}