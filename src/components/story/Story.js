import React, { Component } from 'react';
import './Story.css';
import LoginTip from '../common/LoginTip';
import util from '../../services/Util';
import api from '../../services/Api';
import { connect } from 'react-redux';
import { getStoryDetail, clearStoryDetail, updateExif, } from '../../actions/app';
import lozad from 'lozad';

const mapStateToProps = state => ({
    user: state.auth.user,
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story,
    nowStation: state.station.nowStation,
    nowStationKey: state.station.nowStationKey,
    channelInfo: state.station.nowStation ? state.station.nowStation.seriesInfo : [],
});

class Story extends Component {
    constructor(props) {
        super(props);
        this.handleClickImage = this.handleClickImage.bind(this);
        this.handleToEdit = this.handleToEdit.bind(this);
        this.state = { propsKey: null }
    }

    handleClickImage(url) {
        if (!util.common.isMiniProgram()) {
            window.open(url, '_blank');
        }
    }

    handleToEdit() {
        const { history, location, story, channelInfo, } = this.props;
        let nowChannel;
        for (let i = 0; i < channelInfo.length; i++) {
            if (story.series._key === channelInfo[i]._key) {
                nowChannel = channelInfo[i];
                break;
            }
        }
        if (!nowChannel) {
            return;
        }
        history.push(`editStory${location.search}`);
    }

    render() {
        const { user, story, userId, nowStationKey, nowStation, readOnly, inline, } = this.props;
        const { userKey, title, creator = {}, richContent = [], address, memo, } = story;
        const role = nowStation ? nowStation.role : 8;
        let avatar = creator.avatar ? `${creator.avatar}?imageView2/1/w/160/h/160` : '/image/icon/avatar.svg';

        return (
            <div
                className={`app-content story-container ${inline ? 'inline' : ''}`}
                style={{
                    top: (user && user.isGuest && util.common.isMobile()) || inline ? '0' : '70px',
                    backgroundColor: inline ? 'unset' : '#f5f5f5',
                }}
            >
                {/* <div
                    className="story-head"
                    style={{
                        backgroundImage: `url(${cover}?imageView2/2/w/960/)`
                    }}>
                </div> */}
                <div className="main-content story-content"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`,
                        backgroundColor: inline ? 'unset' : 'white',
                        boxShadow: inline ? 'unset' : '0 0 3px rgba(0, 0, 0, .1)'
                    }}
                >
                    {/* <div className="story-avatar">
                        <i style={{ backgroundImage: `url(${avatar})` }}></i>
                        <span>{creator.name || `手机号${creator.mobile}的用户`}</span>
                    </div>
                    <div className="story-title">{title}</div>
                    <div className="edit-group">赛区：{address}</div> */}
                    <div className="story-head-title">
                        <div className="story-title">{title}</div>
                        <div className="story-head-info">
                            <div className="story-head-other">
                                <div>频道：{story.series ? story.series.name : ''}</div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <i className="story-head-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}')` }}></i>
                                    <div className="story-card-name">{creator.name}</div>
                                    <div className="story-card-time">{util.common.timestamp2DataStr(story.updateTime, 'yyyy-MM-dd')}</div>
                                </div>
                            </div>
                            {story.tag ? <div>标签：{story.tag}</div> : null}
                            {address ? <div className="story-head-address">{address}</div> : null}
                        </div>
                    </div>
                    {
                        /<iframe.*?(?:>|\/>)/gi.test(story.backGroundMusic) ?
                            <div className="story-edit-music"
                                dangerouslySetInnerHTML={{ __html: story.backGroundMusic }}
                            >
                            </div> : null
                    }
                    {
                        !readOnly && (userId === userKey || (role && role <= 3)) && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit}>编辑</span> : null
                    }
                    {
                        story.statusTag ? <span className="preview-status">{story.statusTag}</span> : null
                    }
                    {memo ? <pre className="story-memo">{memo}</pre> : null}
                    {
                        richContent ? richContent.map((content, index) => {
                            const { url, memo } = content;
                            let result = null;
                            let regex1 = /[^()]+(?=\))/g;
                            switch (content.metaType) {
                                case 'html':
                                    result = <pre className="story-content-view">{memo}</pre>
                                    break;
                                case 'header':
                                    result = <span className="story-text-title-show">{memo}</span>;
                                    break;
                                case 'image': {
                                    let exifStr = '';
                                    if (content.exif) {
                                        const model = content.exif.Model ? `${content.exif.Model.val}，  ` : '';
                                        const shutterSpeedValue = content.exif.ShutterSpeedValue ? `${content.exif.ShutterSpeedValue.val.match(regex1)}，  ` : '';
                                        const apertureValue = content.exif.ApertureValue ? `${content.exif.ApertureValue.val.match(regex1)}，  ` : '';
                                        const iSOSpeedRatings = content.exif.ISOSpeedRatings ? `${content.exif.ISOSpeedRatings.val}` : '';
                                        exifStr = model + shutterSpeedValue + apertureValue + iSOSpeedRatings;
                                    }

                                    result =
                                        <div className="story-imageGroup">
                                            <div className="story-image-box">
                                                <img
                                                    className="story-image lozad"
                                                    data-src={`${url}?imageView2/2/w/1280/`}
                                                    alt="story"
                                                    onClick={this.handleClickImage.bind(this, url)}
                                                />
                                                {exifStr ? <div className="img-exif">{exifStr}</div> : null}
                                            </div>
                                            <div className="image-memo">{memo}</div>
                                        </div>;
                                    break;
                                }
                                case 'video':
                                    result =
                                        <video className="story-video" src={url} controls="controls">
                                            Your browser does not support the video tag.</video>
                                    break;
                                default: break;
                            }
                            return (
                                <div className="story-content-edit-box" key={index}>
                                    {result}
                                </div>
                            );
                        }) : null
                    }
                </div>
                {
                    user && user.isGuest && util.common.isMobile() ? <LoginTip /> : null
                }
            </div>
        );
    }

    componentWillMount() {
        this.props.clearStoryDetail();
    }

    componentDidMount() {
        const { location, getStoryDetail } = this.props;
        if (location) {
            let storyKey = util.common.getSearchParamValue(location.search, 'key');
            getStoryDetail(storyKey);
        }
    }

    componentDidUpdate(prevPros) {
        const observer = lozad();
        observer.observe();
        const { story, updateExif } = this.props;
        // 获取到故事详情后
        if (!prevPros.story._key && story._key) {
            let richContent = story.richContent;
            const promises = [];
            for (let i = 0; i < richContent.length; i++) {
                if (richContent[i].metaType === 'image') {
                    promises.push(api.requests.get(`${richContent[i].url}?exif`));
                }
            }

            Promise.all(promises).then(function (posts) {
                let postsIndex = 0;
                for (let i = 0; i < richContent.length; i++) {
                    if (richContent[i].metaType === 'image') {
                        if (!posts[postsIndex].error) {
                            richContent[i].exif = posts[postsIndex];
                        }
                        postsIndex++;
                    }
                }
                updateExif(JSON.parse(JSON.stringify(story)));

            }).catch(function (reason) {
                // ...
            });
        }
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail, clearStoryDetail, updateExif },
)(Story);