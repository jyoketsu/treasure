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

    handleClick(key, type) {
        const { history, match } = this.props;
        const path = type === 9 ? 'article' : 'story';
        history.push({
            pathname: `/${match.params.id}/${path}`,
            search: `?key=${key}`
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
        const { story, like, audit, auditStory, userKey, groupKey, showSetting, height } = this.props;
        const { showDrop } = this.state;
        const isMyStory = (userKey === story.userKey) ? true : false;

        // 显示项目设定
        const showAuthor = showSetting ? (showSetting.indexOf('author') === -1 ? false : true) : true;
        const showTitle = showSetting ? (showSetting.indexOf('title') === -1 ? false : true) : true;
        const showLike = showSetting ? (showSetting.indexOf('like') === -1 ? false : true) : true;
        const showClickNumber = showSetting ? (showSetting.indexOf('clickNumber') === -1 ? false : true) : true;

        let avatar = (story.creator && story.creator.avatar) || '';
        let name = story.creator ? story.creator.name : '';
        let coverUrl = story.cover ?
            (story.cover.indexOf('cdn-icare.qingtime.cn') !== -1 ?
                `${story.cover}?imageView2/2/w/576/` :
                story.cover) :
            '/image/icon/icon-article.svg';
        let coverStyle = {
            backgroundImage: `url('${coverUrl}')`,
            backgroundSize: story.cover ? 'cover' : '30%',
            height: `${height - 80}px`,
        };
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
                                <div onClick={this.handleClick.bind(this, story._key, story.type)}>查看</div>
                                <div onClick={auditStory.bind(this, story._key, groupKey, 2)}>通过</div>
                                <div onClick={auditStory.bind(this, story._key, groupKey, 3)}>不通过</div>
                                <div onClick={this.showDeleteConfirm}>删除</div>
                            </div>
                        </ClickOutside>
                        : null
                }
            </div>);
        return (
            <div
                className={`story-card type-${storyType}`}
                style={{ height: height }}
                onClick={audit ? null : this.handleClick.bind(this, story._key, story.type)}
            >
                {
                    storyType === 'story' ?
                        <div
                            className="story-card-cover"
                            style={coverStyle}
                        >
                            <div className="story-card-mask" style={{ height: `${height - 80}px`, }}></div>
                            {audit ? option : null}
                        </div> : null
                }
                <div className="story-card-title">
                    {
                        showTitle ?
                            <span className="story-card-title-span">
                                {story.title}
                            </span> : null
                    }
                    <div>
                        <span style={statusStyle}>{status}</span>
                    </div>
                </div>
                {/* 图片数量 */}
                {
                    story.type !== 9 ?
                        <span className="picture-count">
                            <i className="picture-count-icon"></i>
                            <span>{story.pictureCount}</span>
                        </span> : null
                }

                <div className="story-card-info">
                    {
                        showAuthor ?
                            <div>
                                <i className="story-card-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}?imageView2/1/w/60/h/60')` }}></i>
                                <span className="story-card-name">{name}</span>
                            </div> : null
                    }
                    <div>
                        <span className="story-card-time">{util.common.timestamp2DataStr(story.time || story.updateTime, 'yyyy-MM-dd')}</span>
                        {
                            showClickNumber ?
                                <span className="story-card-record">
                                    <i className="story-card-icon" style={{ backgroundImage: 'url(/image/icon/readNum.svg)' }}></i>
                                    <span>{story.clickNumber || 1}</span>
                                </span> : null
                        }
                        {
                            showLike ?
                                <span className="story-card-record">
                                    <i
                                        className="story-card-icon"
                                        onClick={like.bind(this, story._key)}
                                        style={{ backgroundImage: `url(/image/icon/${story.islike ? 'like' : 'like2'}.svg)` }}
                                    >
                                    </i>
                                    <span>{story.likeNumber}</span>
                                </span> : null
                        }
                    </div>
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