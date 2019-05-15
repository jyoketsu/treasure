import React, { Component } from 'react';
import './EditStory.css';
import { FileUpload } from '../common/Form';
import util from '../../services/Util';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
});

class EditStory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cover: null
        }
    }

    /**
    * 添加内容
    * @param {Number} index 要添加的位置
    * @param {String} contentType 内容类型
    */
    addContent(index, contentType) {
        this.setState((prevState) => {
            let storyContents = prevState.storyContents;
            storyContents.splice(index, 0, { _id: util.common.randomStr(false, 12), contentType: contentType, value: '' });
            this.scrollDown = true;
            return { storyContents: storyContents }
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
            let storyContents = prevState.storyContents;
            storyContents.splice(index, 0, { _id: util.common.randomStr(false, 12), contentType: 'image', value: images });
            this.scrollDown = true;
            return { storyContents: storyContents }
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
            let storyContents = prevState.storyContents;
            storyContents.splice(index, 0, { _id: util.common.randomStr(false, 12), contentType: 'video', value: videoUrl });
            this.scrollDown = true;
            return { storyContents: storyContents }
        });
    }

    /**
     * 删除内容
     * @param {Number} index 要删除的位置
     */
    deleteContent(index) {
        this.setState((prevState) => {
            let storyContents = prevState.storyContents;
            storyContents.splice(index - 1, 1);
            return { storyContents: storyContents }
        });
    }

    render() {
        const { cover } = this.props;
        return (
            <div className="main-content eidt-story">
                <div className="story-head" style={{
                    backgroundImage: `url(${cover})`
                }}>
                </div>
                <StoryContentEditBox
                    index={0}
                    addContent={this.addContent}
                    deleteContent={this.deleteContent}
                    uploadImageCallback={this.uploadImageCallback}
                    uploadVideoCallback={this.uploadVideoCallback}
                >
                    这个是标题
                </StoryContentEditBox>
            </div>
        );
    }
}

class StoryContentEditBox extends Component {
    render() {
        let deleteButton = null;
        if (this.props.state === 'edit' && !this.props.hideDeleteButton) {
            deleteButton =
                <i className="delete-story-content"
                    onClick={this.props.deleteContent.bind(this, this.props.index)}></i>;
        }
        let buttonGroup = <StoryEditButtonGroup index={this.props.index}
            addContent={this.props.addContent}
            uploadImageCallback={this.props.uploadImageCallback}
            uploadVideoCallback={this.props.uploadVideoCallback} />
        return (
            <div className={`story-content-edit-box ${this.props.className}`}>
                <div
                    className={`story-content-edit-content ${this.props.state}`}
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
                    <div className="story-edit-button"
                        onClick={this.props.addContent.bind(this, this.props.index, 'textTitle')}>
                        <i style={{ backgroundImage: 'url(/image/icon/story-title.png)' }} className="story-title-icon"></i>
                        <span>标题</span>
                    </div>
                    <div className="story-edit-button"
                        onClick={this.props.addContent.bind(this, this.props.index, 'text')}>
                        <i style={{ backgroundImage: 'url(/image/icon/story-text.png)' }} className="story-text-icon"></i>
                        <span>文本</span>
                    </div>
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
                </span>
            icon = "remove";
        }
        return (
            <div className="story-edit-button-container">
                {buttons}
                <button
                    style={{
                        backgroundImage: `url('/image/icon/${icon}.png')`,
                        backgroundPosition: 'top'
                    }}
                    onClick={this.collapseButton} />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {},
)(EditStory);