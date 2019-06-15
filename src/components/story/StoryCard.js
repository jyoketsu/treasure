import React, { Component } from 'react';
import './StoryCard.css';
import { withRouter } from "react-router-dom";
import util from '../../services/Util';
import { Spin } from 'antd';
import ClickOutside from '../common/ClickOutside';
import { Modal } from 'antd';
const confirm = Modal.confirm;

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDrop: false,
        }
        this.switchDrop = this.switchDrop.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }

    handleClick(key) {
        const { history } = this.props;
        const stationKey = util.common.getSearchParamValue(window.location.search, 'stationKey');
        history.push({
            pathname: '/story',
            search: stationKey ? `?stationKey=${stationKey}&key=${key}` : `?key=${key}`,
        });
    }

    switchDrop() {
        this.setState((prevState) => ({
            showDrop: !prevState.showDrop
        }));
    }

    showDeleteConfirm() {
        const { deleteStory, story } = this.props;
        confirm({
            title: '删除',
            content: `确定要删除吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStory(story._key);
            },
        });
    }

    render() {
        const { story, like, audit, auditStory, userKey, groupKey, } = this.props;
        const { showDrop } = this.state;
        const isMyStory = (userKey === story.userKey) ? true : false;
        let avatar = (story.creator && story.creator.avatar) || '';
        let name = story.creator ? story.creator.name : '';
        let coverStyle = { backgroundImage: `url('${story.cover}?imageView2/2/w/300/')` };
        let storyType = story.type === 6 ? 'story' : (story.type === 9 ? 'article' : null);
        let status = '';
        let statusStyle = {};
        if (isMyStory || audit) {
            switch (story.pass) {
                case 1: status = '待审核'; statusStyle = { color: '#9F353A' }; break;
                case 2: status = '审核通过'; statusStyle = { color: '#7BA23F' }; break;
                case 3: status = '审核不通过'; statusStyle = { color: '#CB1B45' }; break;
                default: break;
            }
        }
        let option = (
            <div>
                <div className="station-option" onClick={this.switchDrop}></div>
                {
                    showDrop ?
                        <ClickOutside onClickOutside={this.switchDrop}>
                            <div className="station-option-dorpdown">
                                <div onClick={this.handleClick.bind(this, story._key)}>查看</div>
                                <div onClick={auditStory.bind(this, story._key, groupKey, 2)}>通过</div>
                                <div onClick={auditStory.bind(this, story._key, groupKey, 3)}>不通过</div>
                                <div onClick={this.showDeleteConfirm}>删除</div>
                            </div>
                        </ClickOutside>
                        : null
                }
            </div>);
        return (
            <div className={`story-card type-${storyType}`}>
                {/* 故事封面 */}
                <div
                    className="story-card-cover"
                    style={coverStyle}
                    onClick={audit ? null : this.handleClick.bind(this, story._key)}
                >
                    {audit ? option : null}
                </div>
                {/* 故事标题 */}
                <div className="story-card-title">
                    {story.title}
                    <span style={statusStyle}>{status}</span>
                </div>
                {/* 图片数量 */}
                <span className="picture-count">
                    <i className="picture-count-icon"></i>
                    <span>{story.pictureCount}</span>
                </span>
                {/* 故事信息 */}
                <div className="story-card-info">
                    <i className="story-card-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}?imageView2/1/w/60/h/60')` }}></i>
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