import React, { Component } from 'react';
import './EditArticle.css';
import api from '../../services/Api';
import { withRouter } from "react-router-dom";
import { Form, Button, message, Modal, Select, } from 'antd';
import FroalaEditor from '../common/FroalaEditor';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { addStory, modifyStory, deleteStory, } from '../../actions/app';
const confirm = Modal.confirm;
const Option = Select.Option;

const mapStateToProps = state => ({
    seriesInfo: state.station.nowStation ?
        state.station.nowStation.seriesInfo : [],
    user: state.auth.user,
    story: state.story.story,
    nowStation: state.station.nowStation,
    nowChannelKey: state.story.nowChannelKey,
    nowStationKey: state.station.nowStationKey,
    storyList: state.story.storyList,
    loading: state.common.loading,
    flag: state.common.flag,
});

class EditArticle extends Component {
    constructor(props) {
        super(props);
        let type = util.common.getSearchParamValue(props.location.search, 'type');
        let story = type === 'new' ?
            {
                content:
                    '<p><span class="text-huge"><strong>请输入标题</strong></span></p>',
                series: { _key: util.common.getSearchParamValue(window.location.search, 'channel') || props.nowChannelKey }
            } : props.story;
        if (story._key) {
            story.content = `<p style="text-align:center;"><span class="text-huge"><strong>${story.title}</strong></span></p>${story.content}`
        }
        this.state = {
            story: story,
            uptoken: null,
            moreVisible: false,
        }
        this.handleCommit = this.handleCommit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

        this.getEditor = this.getEditor.bind(this);
        this.handleAticleChange = this.handleAticleChange.bind(this);
        this.switchMoreVisible = this.switchMoreVisible.bind(this);

        this.handleSetTag = this.handleSetTag.bind(this);
        this.handleSetStatus = this.handleSetStatus.bind(this);
        this.handleSelectChannel = this.handleSelectChannel.bind(this);
    }

    handleSetTag(value) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            prevStory.tag = value;
            return { story: prevStory }
        });
    }

    handleSetStatus(value) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            prevStory.statusTag = value;
            return { story: prevStory }
        });
    }

    handleSelectChannel(value) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            prevStory.series = { _key: value };
            prevStory.tag = undefined;
            return { story: prevStory }
        });
    }

    handleAticleChange(model) {
        const { story = {}, } = this.state;
        let changedStory = JSON.parse(JSON.stringify(story));
        changedStory.content = model;
        this.setState({ story: changedStory });
    }

    switchMoreVisible() {
        this.setState((prevState) => ({
            moreVisible: !prevState.moreVisible
        }));
    }

    async handleCommit(e) {
        const { user, nowStationKey, addStory, modifyStory, seriesInfo } = this.props;
        const { story, } = this.state;
        e.preventDefault();

        let channelInfo = {};
        const nowChannelId = story.series._key;
        for (let i = 0; i < seriesInfo.length; i++) {
            if (seriesInfo[i]._key === nowChannelId) {
                channelInfo = seriesInfo[i];
                break;
            }
        }
        const { tag, statusTag, allowPublicTag } = channelInfo;

        if (tag && !story.tag && allowPublicTag) {
            message.info('请选择一个标签！');
            return;
        }

        if (statusTag && !story.statusTag) {
            story.statusTag = statusTag.split(' ')[0];
        }

        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
        let str = story.content;
        if (str.indexOf('blob:http') !== -1) {
            message.info('图片正在上传，请稍后');
            return;
        }
        let arr = str.match(imgReg)  //筛选出所有的img
        if (arr) {
            let src = arr[0].match(srcReg);
            story.cover = src[1];
            // 封面大小
            const res = await util.common.getImageInfo(story.cover);
            if (res) {
                story.size = res;
            } else {
                story.cover = null;
                story.size = null;
            }
        } else {
            story.cover = null;
            story.size = null;
        }
        // memo
        // 去除标签
        let sectionStr = str.replace(/<\/?.+?>/g, '');
        sectionStr = sectionStr.replace(/&nbsp;/g, '')
        story.memo = sectionStr.substr(0, 200);

        // 文章标题（文章内容的第1行为标题）
        let title = util.common.getDomFirstChild(story.content);
        if (title) {
            story.title = title.innerText;
            story.content = story.content.replace(title.htmlStr, '')
        }

        if (typeof story.series === 'object') {
            story.series = story.series._key;
        }

        // 编辑
        if (story._key) {
            story.key = story._key;
            modifyStory(story);
        } else {
            Object.assign(story, {
                userKey: user._key,
                type: 9,
                starKey: nowStationKey,
            });
            addStory(story);
        }
    }

    showDeleteConfirm(key) {
        const { deleteStory } = this.props;
        confirm({
            title: '删除',
            content: `确定要删除吗？`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteStory(key);
            },
        });
    }

    getEditor(editor) {
        this.editor = editor;
    }

    render() {
        const { nowStation, seriesInfo, inline } = this.props;
        const { story = {}, uptoken, } = this.state;
        let channelInfo = {};
        const nowChannelId = story.series ? story.series._key : util.common.getSearchParamValue(window.location.search, 'channel');
        for (let i = 0; i < seriesInfo.length; i++) {
            if (seriesInfo[i]._key === nowChannelId) {
                channelInfo = seriesInfo[i];
                break;
            }
        }
        const { tag, allowPublicTag, statusTag, allowPublicStatus, role } = channelInfo;
        return (
            <div
                className={`app-content edit-story ${inline ? 'inline' : ''}`}
                style={{ top: nowStation && nowStation.style === 2 ? '0' : '70px' }}
                ref={eidtStory => this.eidtStoryRef = eidtStory}
            >
                <div
                    className="main-content story-content edit-article"
                    style={{
                        minHeight: `${window.innerHeight}px`
                    }}
                >
                    <div className="editor-container" ref={node => this.editorRef = node}>
                        {
                            uptoken ?
                                <FroalaEditor
                                    data={story ? story.content : ''}
                                    handleChange={this.handleAticleChange}
                                    uptoken={uptoken}
                                    handleClickMore={this.switchMoreVisible}
                                    inline={inline}
                                /> :
                                null
                        }

                    </div>
                    <div className="article-footer">
                        {story._key ? <Button type="danger" onClick={this.showDeleteConfirm.bind(this, story._key)}>删除</Button> : null}
                        <Button type="primary" onClick={this.handleCommit}>保存</Button>
                    </div>
                </div>
                <Modal
                    className="article-options-modal"
                    title="文章设定"
                    visible={this.state.moreVisible}
                    onOk={this.switchMoreVisible}
                    onCancel={this.switchMoreVisible}
                >
                    <Select
                        style={{ width: 200 }}
                        placeholder="请选择频道"
                        value={nowChannelId}
                        onChange={this.handleSelectChannel}
                    >
                        {
                            seriesInfo.map((item, index) => (
                                (item.role && item.role < 5) || (item.allowPublicUpload) ?
                                    <Option key={index} value={item._key}>{item.name}</Option> : null
                            ))
                        }
                    </Select>
                    {
                        tag && (allowPublicTag || (!allowPublicTag && role && role < 4)) ?
                            <Select
                                style={{ width: 200 }}
                                placeholder="请选择标签"
                                value={story.tag}
                                onChange={this.handleSetTag}
                            >
                                {
                                    tag.split(' ').map((item, index) => {
                                        let tagName = item;
                                        let tagValue = item;
                                        if (util.common.isJSON(item)) {
                                            tagName = JSON.parse(item).name;
                                            tagValue = JSON.parse(item).id;
                                        }
                                        return (<Option key={index} index={index} value={tagValue}>{tagName}</Option>);
                                    })
                                }
                            </Select> : null
                    }
                    {
                        statusTag && (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ?
                            <Select
                                style={{ width: 200 }}
                                placeholder="请选择状态"
                                value={story.statusTag}
                                onChange={this.handleSetStatus}
                            >
                                {
                                    statusTag.split(' ').map((item, index) => (
                                        <Option key={index} index={index} value={item}>{item}</Option>
                                    ))
                                }
                            </Select> : null
                    }
                </Modal>
            </div>
        );
    }

    async componentDidMount() {
        const { seriesInfo, history, story } = this.props;
        if (seriesInfo.length === 0) {
            history.push(`/${window.location.search}`);
        }
        // 获取七牛token
        let res = await api.auth.getUptoken(localStorage.getItem('TOKEN'));
        if (res.msg === 'OK') {
            this.setState({ uptoken: res.result });
        } else {
            message.info({ text: res.msg });
        }
        api.story.applyEdit(story._key, story.updateTime);
    }

    componentWillUnmount() {
        const { story } = this.props;
        api.story.exitEdit(story._key);
    }

    async componentDidUpdate(prevProps) {
        // 如果添加了内容，故事界面向下滚动一点
        if (this.scrollDown) {
            this.scrollDown = false;
            this.eidtStoryRef.scrollTop = this.eidtStoryRef.scrollTop + 100;
        }
        const { history, loading, flag, } = this.props;
        const { story } = this.state;
        if (!loading && prevProps.loading) {
            if (story._key) {
                if (flag === 'deleteStory') {
                    const pathname = window.location.pathname;
                    const stationDomain = pathname.split('/')[1];
                    history.push(`/${stationDomain}`);
                } else {
                    history.goBack();
                }
            } else {
                history.goBack();
            }
        }
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        { addStory, modifyStory, deleteStory, },
    )(Form.create({ name: 'create-station' })(EditArticle)));