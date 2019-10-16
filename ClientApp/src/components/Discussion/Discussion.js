import React from 'react';

import './Discussion.css';

import DiscussionCard from './DiscussionCard.js';

export default class Discussion extends React.Component {

    constructor(props) {
        super(props);
    }

    renderItem = (item, qid) => {
        const childqid = item.type === 'question' ? (
                item.id
            ) : (qid) ? (
                qid
            ) : (
                null
            );

        return (
            <div className='af-discuss-item'>
                <DiscussionCard item={item} questionId={qid}/>
                <div className='af-discuss-children'>
                    <div className='af-discuss-vline'/>
                    <div className='af-discuss-replies'>
                        {item.replies.map(
                            item => this.renderItem(item, childqid)
                        )}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.items.map(item => this.renderItem(item))}
            </div>
        );
    }

}

