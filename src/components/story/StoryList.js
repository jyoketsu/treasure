import React, { Component } from 'react';
import './StoryList.css';
import { StoryLoading, StoryCard } from './StoryCard';
import util from '../../services/Util';
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
    constructor(props) {
        super(props);
        this.state = {
            columnNum: 4
        }
        this.setColumn = this.setColumn.bind(this);
    }

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
        const { columnNum } = this.state;
        const isMobile = util.common.isMobile();

        const children = storyList.map((story, index) => {
            let height;
            if (story.type === 9) {
                height = 80;
            } else {
                let size = story.size;
                if (!(size.height && size.width)) {
                    height = 310;
                } else {
                    height = 80 + size.height / size.width * 290;
                }
            }
            if (showStyle === 2) {
                return (
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
                        height={height}
                    />
                )
            } else {
                return (
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
                );
            }
        });
        return (
            <div className="story-list" ref='container'>
                {
                    showStyle === 2 && !isMobile ?
                        <Waterfall columnNum={columnNum} kernel={10}>{children}</Waterfall> :
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

    setColumn() {
        const containerWidth = this.refs.container.clientWidth - 30;
        this.setState({
            columnNum: Math.floor(containerWidth / 310)
        });
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setColumn();
        }, false);
        this.setColumn();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.setColumn);
    }
}

export default connect(
    mapStateToProps,
    { like, deleteStory, auditStory, },
)(StoryList);