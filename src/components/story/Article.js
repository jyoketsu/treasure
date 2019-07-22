import React, { Component } from 'react';
import './Article.css'
import FroalaEditor from '../common/FroalaEditor';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { getStoryDetail, clearStoryDetail, } from '../../actions/app';

const mapStateToProps = state => ({
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story,
    nowStation: state.station.nowStation,
    nowStationKey: state.station.nowStationKey,
});

class Article extends Component {
    handleToEdit() {
        const { history, location } = this.props;
        history.push(`editArticle${location.search}`);
    }

    render() {
        const { story, userId, nowStationKey, nowStation, readOnly } = this.props;
        const { userKey, title, creator = {}, } = story;
        const role = nowStation ? nowStation.role : 8;
        let avatar = creator.avatar ? `${creator.avatar}?imageView2/1/w/160/h/160` : '/image/icon/avatar.svg';

        return (
            <div
                className="app-content story-container article-display"
                ref={eidtStory => this.eidtStoryRef = eidtStory}
            >
                <div className="main-content story-content article-show"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`
                    }}
                >
                    <div className="story-head-title" style={{ border: 'unset' }}>
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
                        </div>
                    </div>
                    {
                        !readOnly && (userId === userKey || role <= 3) && nowStationKey !== 'all' ? <span className="to-edit-story" onClick={this.handleToEdit.bind(this)}>编辑</span> : null
                    }
                    <div className="editor-container" ref={node => this.editorRef = node}>
                        {/* <MyCKEditor
                            domain=''
                            uptoken={''}
                            data={story ? story.content : ''}
                            locale="zh"
                            disabled={true}
                        /> */}
                        <FroalaEditor
                            previewMode={true}
                            data={story ? story.content || null : null}
                        />
                    </div>
                </div>
            </div>
        );
    }

    componentWillMount() {
        this.props.clearStoryDetail();
    }

    componentDidMount() {
        const { location, getStoryDetail, } = this.props;
        if (document.body.scrollTop !== 0) {
            document.body.scrollTop = 0;
        } else {
            document.documentElement.scrollTop = 0;
        }
        
        if (location) {
            let storyKey = util.common.getSearchParamValue(location.search, 'key');
            getStoryDetail(storyKey);
        }
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail, clearStoryDetail, },
)(Article);