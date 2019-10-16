import React from 'react';

import { Link } from 'react-router-dom';

import './DiscussionCard.css';

export default class Discussion extends React.Component {

    render() {
        const item = this.props.item;
        return (
            <div className='af-discuss-card'>
                <div className='af-discuss-title'>
                    <div className='af-discuss-avatar'/>
                    <div className='af-discuss-author'>{item.author}</div>
                    <div className='text-muted af-discuss-ts'>1970-01-01 00:00:00</div>
                </div>
                <hr/>
                <div className='af-discuss-body'>
                    {item.body}
                </div>
                <hr/>
                <div className='af-discuss-actions'>
                    {
                        this.props.questionId &&
                            <a href='#' className='af-discuss-action'>
                                Mark Answered
                            </a>
                    }
                    <a href='#' className='af-discuss-action'>
                        Reply
                    </a>
                </div>
            </div>
        );
    }

}


