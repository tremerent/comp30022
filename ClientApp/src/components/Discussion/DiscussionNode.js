import React from 'react';

import './DiscussionNode.css';

import DiscussionCard from './DiscussionCard.js';

export default class DiscussionNode extends React.Component {

    render(item = this.props.item, root) {
        const childRoot = item.type === 'question' ? (
                (item.answer ? null : item)
            ) : (
                null
            );

        return (
            <div key={item.id} className='af-dnode-item'>
                <DiscussionCard
                    item={item}
                    question={root}
                    auth={this.props.auth}
                />
                <div className='af-dnode-children'>
                    <div className='af-dnode-vline'/>
                    <div className='af-dnode-replies'>
                        {item.replies.map(
                            item => this.render(
                                this.props.discussion.items[item], childRoot)
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

