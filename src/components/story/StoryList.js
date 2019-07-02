import React, { Component } from 'react';
import './StoryList.css';
import { StoryLoading, StoryCard } from './StoryCard';
import StoryEntry from './StoryEntry';
import Waterfall from '../common/Waterfall';
import { connect } from 'react-redux';
import { like, deleteStory, auditStory, } from '../../actions/app';

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
            userKey,
            showStyle,
            showSetting,
        } = this.props;
        const children = storyList.map((story, index) => (
            showStyle === 2 ?
                <StoryCard
                    key={index}
                    userKey={userKey}
                    story={story}
                    like={like}
                    deleteStory={deleteStory}
                    audit={audit}
                    auditStory={auditStory}
                    groupKey={groupKey}
                    showSetting={showSetting}
                    height={story.type === 9 ? 100 : 330}
                /> :
                <StoryEntry
                    key={index}
                    userKey={userKey}
                    story={story}
                    like={like}
                    deleteStory={deleteStory}
                    audit={audit}
                    auditStory={auditStory}
                    groupKey={groupKey}
                    showSetting={showSetting}
                />
        ));
        return (
            <div className="story-list">
                {
                    showStyle === 2 ?
                        <Waterfall ref="container" columnNum={4} kernel={10}>{children}</Waterfall> :
                        children
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
    { like, deleteStory, auditStory, },
)(StoryList);