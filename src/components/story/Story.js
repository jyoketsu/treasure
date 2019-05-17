import React, { Component } from 'react';
import './Story.css';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { getStoryDetail } from '../../actions/app';

const mapStateToProps = state => ({
    userId: state.auth.user ? state.auth.user._key : null,
    story: state.story.story
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
        const { history } = this.props;
        history.push('/editStory');
    }

    render() {
        const { story, userId } = this.props;
        const { userKey, cover, title, creator = {}, richContent = [] } = story;
        return (
            <div className="story-container"
            >
                <div
                    className="story-head"
                    style={{
                        backgroundImage: `url(${cover}?imageView2/2/w/960/)`
                    }}>
                    {
                        userId === userKey ? <span className="to-edit-story" onClick={this.handleToEdit}>编辑</span> : null
                    }
                </div>
                <div className="main-content">
                    <div className="story-avatar">
                        <i style={{ backgroundImage: `url(${creator.avatar}?imageView2/1/w/60/h/60)` }}></i>
                        <span>{creator.name || `手机号${creator.mobile}的用户`}</span>
                    </div>
                    <div className="story-title">{title}</div>
                    {
                        richContent.map((content, index) => {
                            const { url, memo } = content;
                            let result = null;
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
                                            <span>{memo}</span>
                                            <div className="story-image-box">
                                                <img
                                                    className="story-image"
                                                    src={`${url}?imageView2/2/w/960/`}
                                                    alt="story"
                                                    onClick={this.handleClickImage.bind(this, url)}
                                                />
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
    componentDidMount() {
        const { location, getStoryDetail, } = this.props;
        let storyKey = util.common.getSearchParamValue(location.search, 'key');
        getStoryDetail(storyKey);
    }
}

export default connect(
    mapStateToProps,
    { getStoryDetail },
)(Story);