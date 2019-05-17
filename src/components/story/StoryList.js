import React, { Component } from 'react';
import './StoryList.css';
import { StoryLoading, StoryCard } from './StoryCard';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    storyList: state.story.storyList,
    storyNumber: state.story.storyNumber,
});

class StoryList extends Component {
    render() {
        const { storyList, waiting, storyNumber } = this.props;
        return (
            <div className="story-list">
                {
                    storyList.map((story, index) => (
                        <StoryCard key={index} story={story} />
                    ))
                }
                {
                    waiting ? <StoryLoading /> : null
                }
                {
                    storyList.length >= storyNumber ?
                        <div className="story-is-all">已加载全部</div>
                        : null
                }
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(StoryList);