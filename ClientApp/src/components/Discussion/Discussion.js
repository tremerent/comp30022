import React from 'react';

import DiscussionNode from './DiscussionNode.js';

import './Discussion.css';

export default class Discussion extends React.Component {

    render() {
        let questions = this.props.items.filter(x => x.type === 'question');
        let comments = this.props.items.filter(x => x.type === 'comment');

        return (
            <>
                <div className='af-discuss-header'>
                    <h2 className='af-discuss-title'>Questions</h2>
                </div>
                {questions.map(item => <DiscussionNode key={item.id} item={item}/>)}
                <div className='af-discuss-header'>
                    <h2 className='af-discuss-title'>Comments</h2>
                </div>
                {comments.map(item => <DiscussionNode key={item.id} item={item}/>)}
            </>
        );
    }

}

