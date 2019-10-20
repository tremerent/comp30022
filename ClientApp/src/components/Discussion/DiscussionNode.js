import React from 'react';

import './DiscussionNode.css';

import DiscussionCard from './DiscussionCard.js';

export default class DiscussionNode extends React.Component {

    render(item = this.props.item, rootId) {
        const childRootId = item.type === 'question' ? (
                item.id
            ) : (rootId) ? (
                rootId
            ) : (
                null
            );

        return (
            <div key={item.id} className='af-dnode-item'>
                <DiscussionCard item={item} questionId={rootId}/>
                <div className='af-dnode-children'>
                    <div className='af-dnode-vline'/>
                    <div className='af-dnode-replies'>
                        {item.replies.map(
                            item => this.render(item, childRootId)
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

