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
        const { history, location } = this.props;
        history.push(`/contribute${location.search}`);
    }

    render() {
        const { story, userId, nowStationKey } = this.props;
        const { userKey, cover, title, creator = {}, richContent = [], address, memo, } = story;
        let avatar = creator.avatar ? `${creator.avatar}?imageView2/1/w/160/h/160` : '/image/icon/avatar.svg';
        return (
            <div className="story-container"
            >
                <div
                    className="story-head"
                    style={{
                        backgroundImage: `url(${cover}?imageView2/2/w/960/)`
                    }}>
                    {
                        userId === userKey && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit}>编辑</span> : null
                    }
                </div>
                <div className="main-content story-content">
                    <div className="story-avatar">
                        <i style={{ backgroundImage: `url(${avatar})` }}></i>
                        <span>{creator.name || `手机号${creator.mobile}的用户`}</span>
                    </div>
                    <div className="story-title">{title}</div>
                    <div className="edit-group">赛区：{address}</div>
                    {memo ? <pre>{memo}</pre> : null}
                    {
                        richContent.map((content, index) => {
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
                                case 'image':
                                    result =
                                        <div className="story-imageGroup">
                                            <div className="image-memo">{memo}</div>
                                            <div className="story-image-box">
                                                <img
                                                    className="story-image"
                                                    src={`${url}?imageView2/2/w/960/`}
                                                    alt="story"
                                                    onClick={this.handleClickImage.bind(this, url)}
                                                />
                                                {
                                                    content.exif ?
                                                        <div className="img-exif">
                                                            {
                                                                `${
                                                                content.exif.Model ? content.exif.Model.val : '未知设备'
                                                                }，  ${
                                                                content.exif.ShutterSpeedValue ? content.exif.ShutterSpeedValue.val.match(regex1) : '未知快门'
                                                                }，  ${
                                                                content.exif.ApertureValue ? content.exif.ApertureValue.val.match(regex1) : '未知光圈'
                                                                }，  ${
                                                                content.exif.ISOSpeedRatings ? content.exif.ISOSpeedRatings.val : '未知ISO'
                                                                }`
                                                            }
                                                        </div> :
                                                        null
                                                }
                                            </div>
                                        </div>
                                    break;
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
                        })
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
                console.log('posts[postsIndex];', posts);
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