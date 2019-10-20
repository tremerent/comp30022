import React from 'react';

import './DiscussionCard.css';

export default class DiscussionCard extends React.Component {

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

    render() {
        const item = this.props.item;

        let style = {
            backgroundColor: '#ffffff',
        };

        if (item.type === 'question')
            style.backgroundColor = '#e0dbf0';
        else if (item.isAnswer)
            style.backgroundColor = '#deffe9';

        if (item.error)
            style.opacity = 0.5;

        return (
            <div className='af-dcard-card' style={style}>
                <div className='af-dcard-title'>
                    <div className='af-dcard-avatar'/>
                    <div className='af-dcard-author'>{item.author}</div>
                    <div className='text-muted af-dcard-ts'>{item.ts /* TODO format */}</div>
                </div>
                <hr/>
                <div className='af-dcard-body'>
                    {item.body}
                </div>
                <hr/>
                <div className='af-dcard-actions'>
                    {
                        (item.loading) ? (
                            <div className="spinner-border text-primary af-dcard-loading" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        ) : (item.error) ? (
                            <span
                                className='error af-dcard-error'
                                title={
                                    "An error occured posting your "
                                        + `${item.type}. Try reloading `
                                        + "the page and submitting again."
                                }
                            >
                                ⚠
                            </span>
                        ) : (
                            // Empty div for that sweet flex space-between.
                            <div></div>
                        )
                    }
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
                    <textarea className='form-control af-dcard-replybox'/>
                    <button className='btn btn-primary af-dcard-replybtn'>Reply</button>
                </div>
            </div>
        );
    }

}


