import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommentBox from './CommentBox.js';

import './DiscussionCard.css';

import { discuss } from '../../redux/actions/index.js';

class DiscussionCard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            replying: false,
        };
    }

    reply = e => {
        e.preventDefault();
        this.setState({ replying: true });
    }

    postReply = (body) => {
        const item = {
            id: `${Date.now()}`,
            artefact: this.props.item.artefact,
            type: this.props.item.type,
            author: this.props.username,
            parent: this.props.item,
            body,
        };

        this.props.postItem(item);
    }


    render() {
        const item = this.props.item;

        let style = {
            backgroundColor: '#ffffff',
        };

        if (item.type === 'question')
            style.backgroundColor = '#e0dbf0';
        else if (item.isAnswer)
            style.backgroundColor = '#deffe9';

        let postStatus;
        if (item.loading) {
            postStatus = (
                <div className='text-muted af-dcard-status'>
                    Posting...
                    <div className="spinner-border text-primary af-dcard-loading" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        } else if (item.error) {
            style.opacity = 0.5;
            postStatus = (
                <span
                    className='error af-dcard-error'
                    title={
                        "An error occured posting your "
                            + `${item.type}. Try reloading `
                            + "the page and submitting again."
                    }
                >
                    ⚠ Error
                </span>
            );
        } else {
            postStatus = (
                <div className='text-muted af-dcard-status'>
                    {new Date(item.ts).toLocaleString()}
                </div>
            );
        }

        return (
            <div className='af-dcard-card' style={style}>
                <div className='af-dcard-title'>
                    <div className='af-dcard-avatar'/>
                    <div className='af-dcard-author'>{item.author}</div>
                    {postStatus}
                </div>
                <hr/>
                <div className='af-dcard-body'>
                    {item.body}
                </div>
                <hr/>
                <div className='af-dcard-actions'>
                    {
                        this.props.questionId &&
                            <a href='#mark-answered' className='af-dcard-action'>
                                Mark Answered
                            </a>
                    }
                    <a
                        href='#reply'
                        className='af-dcard-action'
                        data-target={`#reply-${item.id}`}
                        data-toggle='collapse'
                    >
                        {/* TODO: style this 'active' when replying */}
                        Reply
                    </a>
                </div>
                <div id={`reply-${item.id}`} className='collapse af-dcard-reply'>
                    <CommentBox type={item.type} onSubmit={body => this.postReply(body)}/>
                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        username: state.auth.user.username,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        postItem: discuss.postDiscussion,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionCard);

