import React, { Component } from 'react';
import { ShowComment } from './ShowComment.js';
import './Question.css';
import './Comment.css';

export class Discussion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            comments : props.comments,
            comment_count : props.comments.length
        }

     }

     /*When the comment box is typed in and entered,
     add a comment.*/
     add_comment(e) {

         comment_count = comment_count + 1;
     }

     /*Displays the given comment as well as all its descendents */
     display_comments(c) {
         var queryType;
         if (c.type == "normal") {
             queryType = "Comment";
         }
         else if (c.type == "question") {
             queryType = "Question";
         }

         const childrenList = c.children.map(child => {
         return(
             <li key={child.id}>{this.display_comments(child)}</li>
         )
         })

         return(
             <div  className = {queryType}>
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
