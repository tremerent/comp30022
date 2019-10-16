import React, { Component } from 'react';
import { ShowComment } from './ShowComment.js';
import './Comment.css';

export default class Discussion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments : props.comments,
            comment_count : this.count_comments(props.comments)
        }

     }

     count_comments(comment_list) {
         let count = 0;
         for (let comment in comment_list) {
             count += 1 + this.count_comments(comment.replies);
         }
         return count;
     }

     /*When the comment box is typed in and entered,
     add a comment.*/
     add_comment(e) {
         this.state.comment_count += 1;
     }

     /*Displays the given comment as well as all its descendents */
     display_comments(c) {
         const childrenList = c.replies.map(child => {
         return(
             <li key={child.id}>{this.display_comments(child)}</li>
         )
         })

         return(
             <div>
                 <ShowComment comment = {c}/>
                 <ul>{childrenList}</ul>
             </div>
         );
    }

    render() {
        return(
        <div>
            {this.state.comments.map(c =>
                this.display_comments(c))}
        </div>
        );
    }
}
