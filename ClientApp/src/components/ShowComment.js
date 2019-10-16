import React from 'react';

export function ShowComment(props) {
    var type;
    type = props.comment.type;
    return (
        <div className={type}>
            <p><a>{props.comment.author}</a>: {props.comment.body}</p>
        </div>
    );
}

