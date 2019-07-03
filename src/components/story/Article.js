import React, { Component } from 'react';
import './Article.css'
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { getStoryDetail, clearStoryDetail, } from '../../actions/app';

const mapStateToProps = state => ({
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story,
    nowStation: state.station.nowStation,
    nowStationKey: state.station.nowStationKey,
    channelInfo: state.station.nowStation ? state.station.nowStation.seriesInfo : [],
});

class Article extends Component {
    handleToEdit() {
        const { history, location } = this.props;
        history.push(`editArticle${location.search}`);
    }

    render() {
        const { story, userId, nowStationKey, channelInfo, nowStation, } = this.props;
        const { userKey, title, creator = {}, } = story;
        const role = nowStation ? nowStation.role : 8;
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
            <div
                className="app-content story-container article-display"
                ref={eidtStory => this.eidtStoryRef = eidtStory}
            >
                <div className="main-content story-content"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`
                    }}
                >
                    <div className="story-head-title">
                        <div className="story-title">{title}</div>
                        <div className="story-head-info">
                            <div className="story-head-other">
                                <div>频道：{nowChannel ? nowChannel.name : '未知'}</div>
                                <i className="story-head-avatar" style={{ backgroundImage: `url('${avatar || "/image/icon/avatar.svg"}')` }}></i>
                                <div className="story-card-name">{creator.name}</div>
                                <div className="story-card-time">{util.common.timestamp2DataStr(story.time || story.updateTime, 'yyyy-MM-dd')}</div>
                            </div>
                        </div>
                    </div>
                    {
                        (userId === userKey || role <= 3) && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit.bind(this)}>编辑</span> : null
                    }
                    <CKEditor
                        editor={ClassicEditor}
                        data={story ? story.content : ''}
                        config={{
                            toolbar: [],
                        }}
                        disabled={true}
                    />
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
}

export default connect(
    mapStateToProps,
    { getStoryDetail, clearStoryDetail, },
)(Article);