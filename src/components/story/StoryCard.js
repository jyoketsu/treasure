import React, { Component } from 'react';
import './StoryCard.css';
import { withRouter } from "react-router-dom";
import util from '../../services/Util';
import { Spin } from 'antd';

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(key) {
        const { history } = this.props;
        history.push({
            pathname: '/story',
            search: `?key=${key}`,
        });
    }

    render() {
        const { story, like } = this.props;
        let avatar = (story.creator && story.creator.avatar) || '';
        let name = story.creator ? story.creator.name : '';
        let coverStyle = { backgroundImage: `url('${story.cover}?imageView2/2/w/375/')` };
        let storyType = story.type === 6 ? 'story' : (story.type === 9 ? 'article' : null);
        return (
            <div className={`story-card type-${storyType}`}>
                {/* 故事封面 */}
                {storyType === 'story' ?
                    <div
                        className="story-card-cover"
                        style={coverStyle}
                        onClick={this.handleClick.bind(this, story._key)}
                    >
                    </div> :
                    null}
                {/* 故事标题 */}
                <div className="story-card-title">{story.title}</div>
                {/* 图片数量 */}
                <span className="picture-count">
                    <i className="picture-count-icon"></i>
                    <span>{story.pictureCount}</span>
                </span>
                {/* 故事信息 */}
                <div className="story-card-info">
                    <i className="story-card-avatar" style={{ backgroundImage: `url('${avatar}')` }}></i>
                    <span className="story-card-name">{name}</span>
                    <span className="story-card-time">{util.common.timestamp2DataStr(story.time || story.updateTime, 'yyyy-MM-dd')}</span>
                    {/* 评论数 */}
                    {/* <span className="story-card-record">
                        <i className="story-card-icon" style={{ backgroundImage: 'url(/image/icon/comment.png)' }}></i>
                        <span>{story.commentNumber}</span>
                    </span> */}
                    {/* 点赞数 */}
                    <span className="story-card-record">
                        <i
                            className="story-card-icon"
                            onClick={like.bind(this, story._key)}
                            style={{ backgroundImage: `url(/image/icon/${story.islike ? 'like' : 'like2'}.svg)` }}
                        >
                        </i>
                        <span>{story.likeNumber}</span>
                    </span>
                    {/* 阅读数 */}
                    {/* <span className="story-card-record">
                        <i className="story-card-icon" style={{ backgroundImage: 'url(/image/icon/view.png)' }}></i>
                        <span>{story.clickNumber}</span>
                    </span> */}
                </div>
            </div>
        );
    }
}

class StoryLoading extends Component {
    render() {
        return <div className="story-loading">
            <Spin size="large" />
        </div>
    };
}
const StoryCard = withRouter(Card);

export { StoryCard, StoryLoading };