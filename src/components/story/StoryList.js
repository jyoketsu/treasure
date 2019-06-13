import React, { Component } from 'react';
import './StoryList.css';
import { StoryLoading, StoryCard } from './StoryCard';
import { connect } from 'react-redux';
import { like, clearStoryList, deleteStory, auditStory, } from '../../actions/app';

const mapStateToProps = state => ({
    userKey: state.auth.user ? state.auth.user._key : '',
    waiting: state.common.waiting,
    storyList: state.story.storyList,
    storyNumber: state.story.storyNumber,
    flag: state.common.flag,
    groupKey: state.station.nowStation ? state.station.nowStation.intimateGroupKey : null,
});

class StoryList extends Component {
    render() {
        const {
            groupKey,
            storyList,
            waiting,
            storyNumber,
            like,
            audit,
            deleteStory,
            auditStory,
            flag,
            userKey
        } = this.props;
        return (
            <div className="story-list">
                {
                    storyList.map((story, index) => (
                        <StoryCard
                            key={index}
                            userKey={userKey}
                            story={story}
                            like={like}
                            deleteStory={deleteStory}
                            audit={audit}
                            auditStory={auditStory}
                            groupKey={groupKey}
                        />
                    ))
                }
                {
                    waiting && flag !== 'auditStory' ? <StoryLoading /> : null
                }
                {
                    storyList.length !== 0 && storyList.length >= storyNumber ?
                        <div className="story-is-all">已加载全部</div>
                        : null
                }
                {
                    !waiting && storyList.length === 0 ?
                        <div className="story-is-all">没有故事，请先创建</div>
                        : null
                }
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    { like, clearStoryList, deleteStory, auditStory, },
)(StoryList);