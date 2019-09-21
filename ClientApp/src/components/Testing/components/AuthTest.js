import React from 'react';

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
    }
}