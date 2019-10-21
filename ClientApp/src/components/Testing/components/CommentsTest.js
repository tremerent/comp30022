import React from 'react';
import  { Link } from 'react-router-dom';

import { getComment } from 'scripts/requests';
import './CommentsTest.css';

const testCommentId = "b887acf3-3d58-4e70-8fe9-2f6df44bd57b"

export default class CommentsTest extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            testComment: null,
        };
    }
 
    componentWillMount() {
        getComment(`${testCommentId}`)
            .then((comment) => {
                this.setState({
                    ...this.state,
                    testComment: comment,
                })
            });
    }

    render() {
        if (this.state.testComment == null) {
            return <h4> No comment </h4>
        }
        else {
            return createCommentElement(this.state.testComment)
        }

        // recurse over children
        function createCommentElement(comment) {
            const commentContent =
                <div className="af-comment-inner af-comment-content">
                    <h6 className="af-comment-text"> {comment.body} </h6>
                    <hr />
                    <Link to={`/users/${comment.author.userName}`}> 
                        <h6 className="af-comment-text"> 
                            <small className="af-comment-subtext"> 
                                {comment.author.userName} 
                            </small>
                        </h6>
                    </Link>
                </div>;

            return (
                <div className="af-comment-box">
                    {commentContent}
                    {
                        comment.childComments
                            ? 
                            <div className={"af-comment-inner " +
                                            "af-comment-children-box"}>
                                { 
                                    comment.childComments
                                            .map(child => 
                                                 createCommentElement(child)) 
                                }
                            </div>
                            : 
                            <> </>

                    }
                </div>
            );
        }
    }

    handleNewComment(comment) {
        console.log(comment.text);
    }
}