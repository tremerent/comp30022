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

        let backgroundColor = '#ffffff';
        if (item.type === 'question')
            // Americanised spelling to allow compact object syntax.
            backgroundColor = '#e0dbf0';
        else if (item.isAnswer)
            backgroundColor = '#deffe9';

        return (
            <div className='af-dcard-card' style={{ backgroundColor }}>
                <div className='af-dcard-title'>
                    <div className='af-dcard-avatar'/>
                    <div className='af-dcard-author'>{item.author}</div>
                    <div className='text-muted af-dcard-ts'>1970-01-01 00:00:00</div>
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
                    <textarea className='form-control af-dcard-replybox'/>
                    <button className='btn btn-primary af-dcard-replybtn'>Reply</button>
                </div>
            </div>
        );
    }

}


