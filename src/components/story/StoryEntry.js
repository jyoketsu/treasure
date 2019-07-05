import React, { Component } from 'react';
import './StoryEntry.css';
import { withRouter } from "react-router-dom";
import util from '../../services/Util';
import ClickOutside from '../common/ClickOutside';
import { Modal } from 'antd';
const confirm = Modal.confirm;

class StoryEntry extends Component {
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
        const { story, like, audit, auditStory, userKey, groupKey, } = this.props;
        const { showDrop } = this.state;
        const isMyStory = (userKey === story.userKey) ? true : false;
        let avatar = (story.creator && story.creator.avatar) || '';
        let name = story.creator ? story.creator.name : '';
        let coverUrl = story.cover ?
            (story.cover.indexOf('cdn-icare.qingtime.cn') !== -1 ?
                `${story.cover}?imageView2/2/w/576/` :
                story.cover) :
            '/image/icon/icon-article.svg';
        let coverStyle = {
            backgroundImage: `url('${coverUrl}')`,
            backgroundSize: story.cover ? 'cover' : '30%'
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
            <div className="station-option-container">
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
                className={`story-entry type-${storyType}`}
                onClick={audit ? null : this.handleClick.bind(this, story._key, story.type)}>
                <div
                    className="story-entry-cover"
                    style={coverStyle}
                >
                </div>
                <div className="story-entry-info">
                    <div className="story-entry-title">
                        <span className="story-entry-title-span">
                            {story.title}
                        </span>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <span className="story-card-time">{util.common.timestamp2DataStr(story.time || story.updateTime, 'yyyy-MM-dd')}</span>
                            {audit ? option : null}
                        </div>
                    </div>

                    <div className="story-entry-memo">
                        {story.memo}
                    </div>

                    <div className="story-entry-stat">
                        <div>
                            <i className="story-card-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}?imageView2/1/w/60/h/60')` }}></i>
                            <span className="story-card-name">{name}</span>
                        </div>
                        <div>
                            <span style={statusStyle}>{status}</span>
                            <span className="story-card-record">
                                <i className="story-card-icon" style={{ 
                                    backgroundImage: 'url(/image/icon/readNum.svg)' ,
                                    width:'18px',
                                }}></i>
                                <span>{story.clickNumber}</span>
                            </span>
                            <span className="story-card-record">
                                <i
                                    className="story-card-icon"
                                    onClick={like.bind(this, story._key)}
                                    style={{ backgroundImage: `url(/image/icon/${story.islike ? 'like' : 'like2'}.svg)` }}
                                >
                                </i>
                                <span>{story.likeNumber}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(StoryEntry);