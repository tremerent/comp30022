import React, { Component } from 'react';
import { ShowComment } from './ShowComment.js';
import './Comment.css';

export class Discussion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments : props.comments,
            comment_count : count_comments(props.comments)
        }

     }

     count_comments(comment_list) {
         count = 0;
         for (comment in comment_list) {
             count = count + count_comments(comment.children) + 1;
         }
         return count;
     }

     /*When the comment box is typed in and entered,
     add a comment.*/
     add_comment(e) {

         comment_count = comment_count + 1;
     }

     /*Displays the given comment as well as all its descendents */
     display_comments(c) {

         const childrenList = c.children.map(child => {
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
             {this.display_comments(this.state.comments)}
        </div>
        );
    }
}
