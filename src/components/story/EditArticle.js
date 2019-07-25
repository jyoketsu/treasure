import React, { Component } from 'react';
import './EditArticle.css';
import api from '../../services/Api';
import { withRouter } from "react-router-dom";
import { Form, Button, message, Modal } from 'antd';
import FroalaEditor from '../common/FroalaEditor';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { addStory, modifyStory, deleteStory, } from '../../actions/app';
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    seriesInfo: state.station.nowStation ?
        state.station.nowStation.seriesInfo : [],
    user: state.auth.user,
    story: state.story.story,
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
                    '<p style="text-align:center;"><span class="text-huge"><strong>请输入标题</strong></span></p>',
                series: { _key: util.common.getSearchParamValue(window.location.search, 'channel') || props.nowChannelKey }
            } : props.story;
        if (story._key) {
            story.content = `<p style="text-align:center;"><span class="text-huge"><strong>${story.title}</strong></span></p>${story.content}`
        }
        this.state = {
            story: story,
            uptoken: null,
        }
        this.handleCommit = this.handleCommit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

        this.getEditor = this.getEditor.bind(this);
        this.handleAticleChange = this.handleAticleChange.bind(this);
    }

    handleAticleChange(model) {
        const { story = {}, } = this.state;
        let changedStory = JSON.parse(JSON.stringify(story));
        changedStory.content = model;
        this.setState({ story: changedStory });
    }

    async handleCommit(e) {
        const { user, nowStationKey, addStory, modifyStory, } = this.props;
        const { story, } = this.state;
        e.preventDefault();

        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
        let str = story.content;
        let arr = str.match(imgReg)  //筛选出所有的img
        if (arr) {
            let src = arr[0].match(srcReg);
            story.cover = src[1];
            // 封面大小
            story.size = await util.common.getImageInfo(story.cover);
        }
        // memo
        // 去除标签
        let sectionStr = str.replace(/<\/?.+?>/g, '');
        sectionStr = sectionStr.replace(/&nbsp;/g, '')
        story.memo = sectionStr.substr(0, 100);

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
        const { story = {}, uptoken, } = this.state;
        return (
            <div
                className="app-content edit-story"
                ref={eidtStory => this.eidtStoryRef = eidtStory}
            >
                <div
                    className="main-content story-content edit-article"
                    style={{
                        minHeight: `${window.innerHeight - 70}px`
                    }}
                >
                    <div className="editor-container" ref={node => this.editorRef = node}>
                        {
                            uptoken ? <FroalaEditor data={story ? story.content : ''} handleChange={this.handleAticleChange} uptoken={uptoken} /> : null
                        }

                    </div>
                    <div className="article-footer">
                        {story._key ? <Button type="danger" onClick={this.showDeleteConfirm.bind(this, story._key)}>删除</Button> : null}
                        <Button type="primary" onClick={this.handleCommit}>保存</Button>
                    </div>
                </div>
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