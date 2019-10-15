import React from 'react';

function ShowComment(props) {
    var type;
    type = props.comment.type;
    return (
        <div className={type}>
            <p><a>{props.comment.user}</a>: {props.comment.content}</p>
        </div>
    );
}
