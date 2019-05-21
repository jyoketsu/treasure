import React, { Component } from 'react';
import './EditStory.css';
import { withRouter } from "react-router-dom";
import { Button, Tooltip, message, Select } from 'antd';
import { FileUpload } from '../common/Form';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { addStory, modifyStory } from '../../actions/app';

const mapStateToProps = state => ({
    seriesInfo: state.station.stationMap[state.station.nowStationKey] ?
        state.station.stationMap[state.station.nowStationKey].seriesInfo : [],
    user: state.auth.user,
    story: state.story.story,
    nowStationKey: state.station.nowStationKey,
    storyList: state.story.storyList,
    loading: state.common.loading,
});

const Option = Select.Option;

class EditStory extends Component {
    constructor(props) {
        super(props);
        let type = util.common.getSearchParamValue(props.location.search, 'type');
        this.state = {
            story: type === 'new' ? {} : props.story,
        }
        this.addContent = this.addContent.bind(this);
        this.uploadImageCallback = this.uploadImageCallback.bind(this);
        this.uploadVideoCallback = this.uploadVideoCallback.bind(this);
        this.deleteContent = this.deleteContent.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.selectChannel = this.selectChannel.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
    }

    handleCancel() {
        this.props.history.goBack();
    }

    handleCommit() {
        const { user, nowStationKey, addStory, modifyStory } = this.props;
        const { story } = this.state;
        if (!story || (!story.series && !story._key)) {
            message.error('请选择一个频道！');
            return;
        }
        if (!story || !story.title) {
            message.error('请输入标题！');
            return;
        }
        if (!story.pictureCount) {
            message.error('请至少上传一张图片！');
            return;
        }
        // 编辑
        if (story._key) {
            story.key = story._key;
            if (typeof story.series === 'object') {
                story.series = story.series._key;
            }
            // 封面大小
            let size = util.common.getImageInfo(story.cover);
            story.size = size;
            for (let i = 0; i < story.richContent.length; i++) {
                if (story.richContent[i].metaType === 'image') {
                    delete story.richContent[i].exif;
                }
            }
            modifyStory(story);
        } else {
            // 新增
            // 封面大小
            let size = util.common.getImageInfo(story.cover);
            Object.assign(story, {
                userKey: user._key,
                type: 6,
                starKey: nowStationKey,
                publish: 1,
                size: size,
                isSimple: 0,
            });
            addStory(story);
        }
    }

    /**
    * 添加内容
    * @param {Number} index 要添加的位置
    * @param {String} contentType 内容类型
    */
    addContent(index, metaType) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            let { richContent: prevContent = [] } = prevStory;
            prevContent.splice(index, 0, { _id: util.common.randomStr(false, 12), metaType: metaType, memo: '' });
            prevStory.richContent = prevContent;
            this.scrollDown = true;
            return { story: prevStory }
        });
    }

    /**
     * 故事图片上传回调
     * @param {Array} images 图片url数组
     * @param {Object} extParams 参数
     */
    uploadImageCallback(images, extParams) {
        let index = extParams.index;
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            let { richContent: prevContent = [] } = prevStory;
            for (let i = 0; i < images.length; i++) {
                let size = util.common.getImageInfo(images[i]);
                prevContent.splice(index, 0, { _id: util.common.randomStr(false, 12), metaType: 'image', url: images[i], size: size, memo: '' });
            }
            prevStory.richContent = prevContent;
            if (typeof prevStory.pictureCount === 'number') {
                prevStory.pictureCount = prevStory.pictureCount + 1;
            } else {
                prevStory.pictureCount = 1;
            }
            // 设置封面
            if (!prevStory.cover) {
                prevStory.cover = images[0];
            }
            this.scrollDown = true;
            return { story: prevStory }
        });
    }

    /**
     * 故事视频上传回调
     * @param {Array} videoUrl 视频url
     * @param {Object} extParams 参数
     */
    uploadVideoCallback(videoUrl, extParams) {
        let index = extParams.index;
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            let { richContent: prevContent = [] } = prevStory;
            prevContent.splice(
                index,
                0,
                {
                    _id: util.common.randomStr(false, 12), metaType: 'video',
                    url: videoUrl,
                    thumbnailUrl: `${videoUrl}?vframe/jpg/offset/1`,
                    memo: ''
                }
            );
            prevStory.richContent = prevContent;
            this.scrollDown = true;
            return { story: prevStory }
        });
    }

    /**
     * 删除内容
     * @param {Number} index 要删除的位置
     */
    deleteContent(index, metaType) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            let { richContent: prevContent = [] } = prevStory;
            prevContent.splice(index - 1, 1);
            if (metaType === 'image') {
                prevStory.pictureCount = prevStory.pictureCount - 1;
            }
            prevStory.richContent = prevContent;
            return { story: prevStory }
        });
    }

    handleInput(name, index, event) {
        const { story = {} } = this.state;
        let changedStory = JSON.parse(JSON.stringify(story));
        const value = event.target.value;
        if (name === 'title') {
            changedStory.title = value;
        } else {
            let richContent = changedStory.richContent;
            richContent[index].memo = value;
        }
        this.setState({ story: changedStory });
    }

    selectChannel(value) {
        const { story = {} } = this.state;
        let changedStory = JSON.parse(JSON.stringify(story));
        changedStory.series = value;
        this.setState({ story: changedStory });
    }

    render() {
        const { story = {} } = this.state;
        const { cover, title = '', series = {}, richContent = [] } = story;
        const { seriesInfo } = this.props;
        let centent = richContent.map((content, index) => {
            let result = null;

            switch (content.metaType) {
                case 'html':
                    result = <StoryText index={index} memo={content.memo} handleInput={this.handleInput} />;
                    break;
                case 'header':
                    result = <TextTitle index={index} memo={content.memo} handleInput={this.handleInput} />;
                    break;
                case 'image':
                    result = <StoryImage url={content.url} memo={content.memo} />
                    break;
                case 'video':
                    result = <StoryVideo url={content.url} memo={content.memo} />
                    break;
                default: break;
            }

            let storyContent =
                <StoryContentEditBox
                    key={index}
                    index={index + 1}
                    metaType={content.metaType}
                    addContent={this.addContent}
                    deleteContent={this.deleteContent.bind(this)}
                    uploadImageCallback={this.uploadImageCallback}
                    uploadVideoCallback={this.uploadVideoCallback}>
                    {result}
                </StoryContentEditBox>
            return storyContent;
        });

        return (
            <div className="edit-story" ref={eidtStory => this.eidtStoryRef = eidtStory}>
                <div className="story-head" style={{
                    backgroundImage: `url(${cover}?imageView2/2/w/960/)`
                }}>
                    <div className="channel-select">
                        <span>选择频道：</span>
                        <Select
                            defaultValue={series._key}
                            style={{ width: 120 }}
                            onChange={this.selectChannel}
                        >
                            {
                                seriesInfo.map((series, index) => (
                                    <Option key={index} value={series._key}>{series.name}</Option>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className="main-content ">
                    <StoryContentEditBox
                        className="story-title-box"
                        hideDeleteButton={true}
                        index={0}
                        addContent={this.addContent}
                        deleteContent={this.deleteContent}
                        uploadImageCallback={this.uploadImageCallback}
                        uploadVideoCallback={this.uploadVideoCallback}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '50px',
                        }}
                    >
                        <input className="story-title" type="text"
                            placeholder="点击输入标题"
                            value={title}
                            onChange={this.handleInput.bind(this, 'title', null)} />
                    </StoryContentEditBox>
                    {centent}
                    <div className="story-footer">
                        <Button onClick={this.handleCancel}>取消</Button>
                        <Button type="primary" onClick={this.handleCommit}>保存</Button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { seriesInfo, history } = this.props;
        if (seriesInfo.length === 0) {
            history.push('/');
        }
    }

    async componentDidUpdate(prevProps) {
        // 如果添加了内容，故事界面向下滚动一点
        if (this.scrollDown) {
            this.scrollDown = false;
            this.eidtStoryRef.scrollTop = this.eidtStoryRef.scrollTop + 100;
        }
        const { storyList, history, loading } = this.props;
        if (storyList.length !== prevProps.storyList.length) {
            message.success('创建成功！');
            history.goBack();
        } else if (!loading && prevProps.loading) {
            message.success('编辑成功！');
            history.goBack();
        }
    }
}

class StoryContentEditBox extends Component {
    render() {
        let deleteButton = null;
        if (!this.props.hideDeleteButton) {
            deleteButton =
                <i className="delete-story-content"
                    onClick={this.props.deleteContent.bind(this, this.props.index, this.props.metaType)}></i>;
        }
        let buttonGroup = <StoryEditButtonGroup index={this.props.index}
            addContent={this.props.addContent}
            uploadImageCallback={this.props.uploadImageCallback}
            uploadVideoCallback={this.props.uploadVideoCallback} />
        return (
            <div className={`story-content-edit-box ${this.props.className}`}>
                <div
                    className="story-content-edit-content edit"
                    style={this.props.style}>
                    {this.props.children}
                    {deleteButton}
                </div>
                {buttonGroup}
            </div>
        );
    }
}

class StoryEditButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };
        this.collapseButton = this.collapseButton.bind(this);
    }

    collapseButton() {
        this.setState((prevState) => ({
            collapsed: !prevState.collapsed
        }));
    }

    render() {
        let buttons = null;
        let icon = null;
        if (this.state.collapsed) {
            icon = "add";
        } else {
            buttons =
                <span>
                    <Tooltip title="添加小标题">
                        <div className="story-edit-button"
                            onClick={this.props.addContent.bind(this, this.props.index, 'header')}>
                            <i style={{ backgroundImage: 'url(/image/icon/story-title.png)' }} className="story-title-icon"></i>
                            <span>标题</span>
                        </div>
                    </Tooltip>

                    <Tooltip title="添加文本">
                        <div className="story-edit-button"
                            onClick={this.props.addContent.bind(this, this.props.index, 'html')}>
                            <i style={{ backgroundImage: 'url(/image/icon/story-text.png)' }} className="story-text-icon"></i>
                            <span>文本</span>
                        </div>
                    </Tooltip>

                    <Tooltip title="点击上传图片">
                        <div className="story-edit-button">
                            <FileUpload
                                className="story-image-icon"
                                style={{
                                    backgroundImage: 'url(/image/icon/story-image.png)',
                                    display: 'block',
                                    width: '24px',
                                    height: '24px',
                                }}
                                multiple="multiple"
                                extParam={{ index: this.props.index }}
                                callback={this.props.uploadImageCallback} />
                            <span>图片</span>
                        </div>
                    </Tooltip>

                    <Tooltip title="点击上传视频">
                        <div className="story-edit-button">
                            <FileUpload
                                className="story-video-icon"
                                style={{
                                    backgroundImage: 'url(/image/icon/story-video.png)',
                                    display: 'block',
                                    width: '24px',
                                    height: '24px',
                                }}
                                metaType='video'
                                maxSize={52428800}
                                extParam={{ index: this.props.index }}
                                callback={this.props.uploadVideoCallback} />
                            <span>视频</span>
                        </div>
                    </Tooltip>
                </span>
            icon = "remove";
        }
        return (
            <div className="story-edit-button-container">
                {buttons}
                <Tooltip title="点击添加图片或者文字">
                    <button
                        style={{
                            backgroundImage: `url('/image/icon/${icon}.svg')`,
                            backgroundPosition: 'top'
                        }}
                        onClick={this.collapseButton} />
                </Tooltip>,
            </div>
        );
    }
}

class TextTitle extends Component {
    render() {
        const { index, memo, handleInput } = this.props;
        let title =
            <input
                className='story-text-title'
                placeholder="点击输入标题"
                value={memo}
                onChange={handleInput.bind(this, 'richContent', index)} />

        return title;
    }
}

class StoryText extends Component {
    render() {
        let { index, memo, handleInput } = this.props;
        memo = memo.replace(/^\s+|\s+$/g, '');// 去掉末尾多余的换行
        let text =
            <textarea
                className="story-content-textArea"
                placeholder="点击输入文本"
                value={memo}
                onChange={handleInput.bind(this, 'richContent', index)} />;
        return text;
    }
}

class StoryImage extends Component {
    render() {
        const { url, memo } = this.props;
        return (
            <div className="story-imageGroup">
                <span>{memo}</span>
                <div className="story-image-box"><img className="story-image" src={`${url}?imageView2/2/w/960/`} alt="story" /></div>
            </div>
        );
    }
}

class StoryVideo extends Component {
    render() {
        return (
            <video className="story-video" src={this.props.url} controls="controls">
                Your browser does not support the video tag.</video>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        { addStory, modifyStory },
    )(EditStory));