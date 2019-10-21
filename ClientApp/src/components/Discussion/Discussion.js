import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CommentBox from './CommentBox.js';
import DiscussionNode from './DiscussionNode.js';

import { discuss } from '../../redux/actions/index.js';

import './Discussion.css';

class DiscussSection extends React.Component {


    postItem(body, parent) {
        const item = {
            id: `${Date.now()}`,
            artefact: this.props.artefactId,
            type: this.props.type,
            author: this.props.username,
            body,
        };

        this.props.postItem(item);
    }

    render() {
        const items = this.props.items.filter(x => { console.assert(x.type); return x.type === this.props.type; });

        return (
            <>
            <div className='af-dh'>
                <div className='af-dh-title'>
                    <h4 className='af-dh-heading'>
                        {this.props.title || this.props.type}
                    </h4>
                    <button
                            className='btn btn-secondary'
                            data-target={`#af-dh-create-${this.props.type}`}
                            data-toggle='collapse'
                    >
                        +
                    </button>
                </div>
                <div className='collapse' id={`af-dh-create-${this.props.type}`}>
                    <CommentBox type={this.props.type} onSubmit={body => this.postItem(body, null)}/>
                </div>
            </div>
            {
                items.length ? (
                    items.map(
                            item => <DiscussionNode key={item.id} item={item}/>
                        )
                ) : (
                    <span className='text-muted'>Nope sorry nothing here.</span>
                )
            }
            </>
        );
    }
}

function Discussion(props) {
    return (
        <>
            <DiscussSection
                type='question'
                title="Questions"
                {...props}
            />
            <DiscussSection
                type='comment'
                title="Comments"
                {...props}
            />
        </>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Discussion);

