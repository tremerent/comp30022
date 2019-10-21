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
            <div className='af-discuss-section'>
                <div className='af-dh-outer'>
                    <div className='af-dh-blocker'></div>
                    <div className='af-dh-inner'>
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
            </div>
        );
    }
}

function Discussion(props) {
    // These two sections are in the reverse order that we want them displayed.
    // We use `flex-direction: column-reverse` on the outer div to make them
    // *display* in the right order, but keep the reversed "HTML-source" order.
    // This is because when two items have the same z-index, as these two
    // DiscussSections do, the one which comes *later* in the HTML source is
    // rendered on top. Because of some weird witchery of position: sticky,
    // we actually want the one which visually comes *earlier* to be on top,
    // because this causes it to do a cool animatey thing where it pushes the
    // other item out of the way when moving into its sticky position. Also,
    // if the lower one is rendered above the upper one, we get a bizarre thing
    // where the lower one's <h2> is above the upper one's comment box, but
    // the lower's comment box is still below the upper's one.
    return (
        <div className='af-discussion'>
            <DiscussSection
                type='comment'
                title="Comments"
                {...props}
            />
            <DiscussSection
                type='question'
                title="Questions"
                {...props}
            />
        </div>
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

