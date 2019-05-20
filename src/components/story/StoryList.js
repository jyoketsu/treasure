import React, { Component } from 'react';
import './StoryList.css';
import { StoryLoading, StoryCard } from './StoryCard';
import { connect } from 'react-redux';
import { like } from '../../actions/app';

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    storyList: state.story.storyList,
    storyNumber: state.story.storyNumber,
});

class StoryList extends Component {
    render() {
        const { storyList, waiting, storyNumber, like } = this.props;
        return (
            <div className="story-list">
                {
                    storyList.map((story, index) => (
                        <StoryCard key={index} story={story} like={like} />
                    ))
                }
                {
                    waiting ? <StoryLoading /> : null
                }
                {
                    storyList.length !== 0 && storyList.length >= storyNumber ?
                        <div className="story-is-all">已加载全部</div>
                        : null
                }
                {
                    storyList.length === 0 ?
                        <div className="story-is-all">没有故事，请先创建</div>
                        : null
                }
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    { like },
)(StoryList);