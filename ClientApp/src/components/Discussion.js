import React, { Component } from 'react';
import { ShowComment } from './ShowComment.js';
import './Comment.css';

export class Discussion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments : props.comments,
            comment_count : this.count_comments(props.comments)
        }

    }

    /*Counts the number of comments in the comment list, including descendents*/
    count_comments(comment_list) {
        var count = 0;
        for (var comment in comment_list) {
              count = count + this.count_comments(comment.children) + 1;
        }
        return count;
    }

    /*When the comment box is typed in and entered,
    add a comment.*/
    add_comment(e) {

        comment_count = comment_count + 1;
    }

    /*Displays the list of comments as well as all its descendents */
    display_comments(c) {
        const childrenList = c.map(child => {
            return(
                <ul key={child.id}>
                     <li><ShowComment comment={child}/></li>
                     <li>{this.display_comments(child.children)}</li>
                </ul>
            )
        })
        return(<div>{childrenList}</div>);
        }

    render() {
        return(
            <div>
                {this.display_comments(this.state.comments)}
            </div>
        );
    }
}
