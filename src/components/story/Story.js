import React, { Component } from 'react';
import './Story.css';
import util from '../../services/Util';
import api from '../../services/Api';
import { connect } from 'react-redux';
import { getStoryDetail, clearStoryDetail, updateExif, } from '../../actions/app';

const mapStateToProps = state => ({
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story,
    nowStationKey: state.station.nowStationKey,
    channelInfo: state.station.nowStation ? state.station.nowStation.seriesInfo : [],
});

class Story extends Component {
    constructor(props) {
        super(props);
        this.handleClickImage = this.handleClickImage.bind(this);
        this.handleToEdit = this.handleToEdit.bind(this);
    }

    handleClickImage(url) {
        window.open(url, '_blank');
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
        if (nowChannel.albumType === 'normal') {
            history.push(`editStory${location.search}`);
        } else {
            history.push(`contribute${location.search}`);
        }
    }

    render() {
        const { story, userId, nowStationKey, channelInfo, } = this.props;
        const { userKey, title, creator = {}, richContent = [], address, memo, } = story;
        let avatar = creator.avatar ? `${creator.avatar}?imageView2/1/w/160/h/160` : '/image/icon/avatar.svg';
        // 频道信息
        let nowChannel;
        for (let i = 0; i < channelInfo.length; i++) {
            if (story.series && story.series._key === channelInfo[i]._key) {
                nowChannel = channelInfo[i];
                break;
            }
        }

        return (
            <div className="app-content story-container"
            >
                {/* <div
                    className="story-head"
                    style={{
                        backgroundImage: `url(${cover}?imageView2/2/w/960/)`
                    }}>
                </div> */}
                <div className="main-content story-content"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`
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
                            {address ? <div className="story-head-address">{address}</div> : null}
                            <div className="story-head-other">
                                <div>频道：{nowChannel ? nowChannel.name : '未知'}</div>
                                <i className="story-head-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}')` }}></i>
                                <div className="story-card-name">{creator.name}</div>
                                <div className="story-card-time">{util.common.timestamp2DataStr(story.time || story.updateTime, 'yyyy-MM-dd')}</div>
                            </div>
                        </div>
                    </div>
                    {
                        userId === userKey && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit}>编辑</span> : null
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
                                            <div className="image-memo">{memo}</div>
                                            <div className="story-image-box">
                                                <img
                                                    className="story-image"
                                                    src={`${url}?imageView2/2/w/1280/`}
                                                    alt="story"
                                                    onClick={this.handleClickImage.bind(this, url)}
                                                />
                                                {exifStr ? <div className="img-exif">{exifStr}</div> : null}
                                            </div>
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
            </div>
        );
    }

    componentWillMount() {
        this.props.clearStoryDetail();
    }

    componentDidMount() {
        const { location, getStoryDetail, } = this.props;
        let storyKey = util.common.getSearchParamValue(location.search, 'key');
        getStoryDetail(storyKey);
    }

    componentDidUpdate(prevPros) {
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