import React from 'react';

import './DiscussionNode.css';

import DiscussionCard from './DiscussionCard.js';

export default class DiscussionNode extends React.Component {

    render(item = this.props.item, root) {
        const childRoot = item.type === 'question' ? (
                (item.answer ? null : item)
            ) : (root) ? (
                root
            ) : (
                null
            );

        return (
            <div key={item.id} className='af-dnode-item'>
                <DiscussionCard items={this.props.items} item={item} question={root} auth={this.props.auth}/>
                <div className='af-dnode-children'>
                    <div className='af-dnode-vline'/>
                    <div className='af-dnode-replies'>
                        {item.replies.sort((a, b) => a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0).map(
                            item => this.render(this.props.items[item], childRoot)
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

