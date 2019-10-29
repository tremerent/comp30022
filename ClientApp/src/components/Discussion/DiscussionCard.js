import React from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommentBox from './CommentBox.js';

import './DiscussionCard.css';

import { discuss } from '../../redux/actions/index.js';

class DiscussionCard extends React.Component {

    constructor(props) {
        super(props);

        this.COMMENTBOX_ID = `af-dh-create-${this.props.item.id}`;
        this.COMMENTBOX_SELECTOR = `#${this.COMMENTBOX_ID}`;

        this.state = {
            replying: false,
        };
    }

    closeCommentBox = () => {
        $(this.COMMENTBOX_SELECTOR).collapse('hide');
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
            parent: this.props.item.id,
            body,
        };

        this.closeCommentBox();

        this.props.postItem(item);
    }

    markAnswer = e => {
        e.preventDefault();
        console.assert(this.props.question);

        this.props.markAnswer(this.props.question, this.props.item);
    }

    unmarkAnswer = e => {
        e.preventDefault();

        this.props.unmarkAnswer(this.props.item);
    }

    render() {
        const item = this.props.item;

        let style = {
            backgroundColor: '#ffffff',
        };

        if (item.type === 'question')
            style.backgroundColor = '#f0ecfd';
        else if (item.answers)
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
                    <img
                            src={
                                item.authorImageUrl ?
                                    item.authorImageUrl
                                :
                                    '/img/profile-placeholder.png'
                            }
                            className='af-dcard-avatar'
                    />
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
                        this.props.question && this.props.auth.isOwner &&
                            <a href='#mark-answered' className='af-dcard-action' onClick={this.markAnswer}>
                                Mark Answered
                            </a>
                    }
                    {
                        item.answers && this.props.auth.isOwner &&
                            <a href='#unmark-answered' className='af-dcard-action' onClick={this.unmarkAnswer}>
                                Unmark Answered
                            </a>
                    }
                    {
                        this.props.auth.loggedIn &&
                            <a
                                href='#reply'
                                className='af-dcard-action'
                                data-target={this.COMMENTBOX_SELECTOR}
                                data-toggle='collapse'
                            >
                                {/* TODO: style this 'active' when replying */}
                                Reply
                            </a>
                    }
                </div>
                <div id={this.COMMENTBOX_ID} className='collapse af-dcard-reply'>
                    <CommentBox
                            type={item.type}
                            onSubmit={this.postReply}
                            onCancel={this.closeCommentBox}
                    />
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
        markAnswer: discuss.markAnswer,
        unmarkAnswer: discuss.unmarkAnswer,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionCard);

