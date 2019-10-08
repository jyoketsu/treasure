import React, { Component } from 'react';
import './StoryCard.css';
import { withRouter } from "react-router-dom";
import util from '../../services/Util';
import { Spin, Modal } from 'antd';
import { connect } from 'react-redux';
import { deleteStory } from '../../actions/app';
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    userKey: state.auth.user ? state.auth.user._key : '',
    role: state.station.nowStation ? state.station.nowStation.role : null,
});

class Card extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.deletePage = this.deletePage.bind(this);
    }

    handleClick(key, type) {
        const { history, match } = this.props;
        if (type === 12) {
            const token = localStorage.getItem('TOKEN');
            window.open(
                `https://editor.qingtime.cn?token=${token}&key=${key}`,
                '_blank');
        } else {
            const path = type === 9 ? 'article' : 'story';
            history.push({
                pathname: `/${match.params.id}/${path}`,
                search: `?key=${key}`
            });
        }
    }

    handleLike(storyKey, e) {
        e.stopPropagation();
        this.props.like(storyKey);
    }

    deletePage(e) {
        e.stopPropagation();
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
        const { story, userKey, showSetting, height, role, } = this.props;
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
                (story.cover.indexOf('vframe') === -1 ? `${story.cover}?imageView2/2/w/576/` : story.cover) :
                story.cover) :
            '/image/icon/icon-article.svg';
        let coverStyle = {
            backgroundImage: `url('${coverUrl}')`,
            backgroundSize: story.cover ? 'cover' : '30%',
            height: `${height - 80}px`,
        };
        let storyType = story.type === 6 ? 'story' : (story.type === 9 ? 'article' : 'page');
        let status = '';
        let statusStyle = {};
        if (isMyStory && role && role > 2) {
            switch (story.pass) {
                case 1: status = '待审核'; statusStyle = { color: '#9F353A' }; break;
                case 2: status = '审核通过'; statusStyle = { color: '#7BA23F' }; break;
                case 3: status = '审核不通过'; statusStyle = { color: '#CB1B45' }; break;
                default: break;
            }
        }

        return (
            <div
                className={`story-card type-${storyType}`}
                style={{ height: height }}
                onClick={this.handleClick.bind(this, story._key, story.type)}
            >
                <div
                    className="story-card-cover"
                    style={coverStyle}
                >
                    <div className="story-card-mask" style={{ height: `${height - 80}px`, }}></div>
                </div>
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
                {
                    story.type === 12 && (isMyStory || (role && role <= 3)) ?
                        <span className="delete-page" onClick={this.deletePage}>删除</span> : null
                }
                {
                    // 图片数量
                    story.type === 6 ?
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
                        <span className="story-card-time">{util.common.timestamp2DataStr(story.updateTime, 'yyyy-MM-dd')}</span>
                        {
                            showClickNumber ?
                                <span className="story-card-record">
                                    <i className="story-card-icon" style={{
                                        backgroundImage: 'url(/image/icon/readNum.svg)',
                                        width: '18px',
                                    }}></i>
                                    <span>{story.clickNumber || 1}</span>
                                </span> : null
                        }
                        {
                            showLike ?
                                <span className="story-card-record">
                                    <i
                                        className="story-card-icon"
                                        onClick={this.handleLike.bind(this, story._key)}
                                        style={{ backgroundImage: `url(/image/icon/${story.islike ? 'like' : 'like2'}.svg)` }}
                                    >
                                    </i>
                                    <span>{story.likeNumber}</span>
                                </span> : null
                        }
                    </div>
                </div>
                {
                    story.statusTag ? <span className="cover-status">{story.statusTag}</span> : null
                }
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
const StoryCard = withRouter(connect(mapStateToProps, { deleteStory })(Card));

export { StoryCard, StoryLoading };