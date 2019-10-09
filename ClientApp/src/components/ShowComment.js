import React from 'react';

function ShowComment(props) {
    return (
        <div>
            <p><a>{props.comment.user}</a>: {props.comment.content}</p>
        </div>
    );
}
