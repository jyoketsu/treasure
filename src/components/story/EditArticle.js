import React, { Component } from 'react';
import './Contribute.css';
import { withRouter } from "react-router-dom";
import { Form, Button, Tooltip, message, Select, Input, Modal } from 'antd';
import { FileUpload } from '../common/Form';
import MyCKEditor from '../common/MyCKEditor';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { addStory, modifyStory, deleteStory, } from '../../actions/app';
import api from '../../services/Api';
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

const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            title: Form.createFormField({
                ...props.title,
                value: props.title.value,
            }),
        };
    },

})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="请输入标题">
                {getFieldDecorator('title', {
                    rules: [
                        { max: 20, message: '不能超过20个字符！' },
                        { required: true, message: '请输入作品标题！' }],
                })(<Input />)}
            </Form.Item>
        </Form>
    );
});

class EditArticle extends Component {
    constructor(props) {
        super(props);
        let type = util.common.getSearchParamValue(props.location.search, 'type');
        const story = type === 'new' ? {} : props.story;
        this.state = {
            story: story,
            uptoken: null,
            fields: {
                title: {
                    value: story.title,
                },
            },
        }
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

        this.getEditor = this.getEditor.bind(this);
        this.handleAticleChange = this.handleAticleChange.bind(this);
    }

    handleAticleChange() {
        const { story = {} } = this.state;
        let changedStory = JSON.parse(JSON.stringify(story));
        const content = this.editor.getData()
        changedStory.content = content;
        this.setState({ story: changedStory });
    }

    handleCancel() {
        this.props.history.goBack();
    }

    handleCommit(e) {
        const { user, nowStationKey, addStory, modifyStory, nowChannelKey, } = this.props;
        const { story, fields, } = this.state;
        e.preventDefault();
        this.form.validateFields((err, values) => {
            if (!err) {
                // 验证通过
                let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
                let srcReg = /src=['"]?([^'"]*)['"]?/i // 匹配图片中的src
                let str = story.content;
                let arr = str.match(imgReg)  //筛选出所有的img
                if (arr) {
                    let src = arr[0].match(srcReg);
                    story.cover = src[1];
                    // 封面大小
                    story.size = util.common.getImageInfo(story.cover);
                }
                // 编辑
                if (story._key) {
                    story.key = story._key;
                    Object.assign(story, {
                        title: fields.title.value,
                    });
                    modifyStory(story);
                } else {
                    Object.assign(story, {
                        userKey: user._key,
                        type: 9,
                        starKey: nowStationKey,
                        title: fields.title.value,
                        series: nowChannelKey,
                    });
                    addStory(story);
                }
            }
        });
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

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
        const { story = {}, fields, uptoken, } = this.state;
        return (
            <div className="edit-story" ref={eidtStory => this.eidtStoryRef = eidtStory}>
                <div className="my-station-head">文章</div>
                <div className="main-content story-content">
                    <CustomizedForm
                        {...fields}
                        ref={node => this.form = node}
                        onChange={this.handleFormChange}
                        onSubmit={this.handleSubmit}
                    />
                    {uptoken ?
                        <MyCKEditor
                            domain='http://cdn-icare.qingtime.cn/'
                            uptoken={uptoken}
                            onInit={this.getEditor}
                            onChange={this.handleAticleChange}
                            data={story.content}
                            locale="zh"
                            disabled={false}
                        /> : null}
                    <div className="story-footer">
                        <Button onClick={this.handleCancel}>取消</Button>
                        {story._key ? <Button type="danger" onClick={this.showDeleteConfirm.bind(this, story._key)}>删除</Button> : null}
                        <Button type="primary" onClick={this.handleCommit}>保存</Button>
                    </div>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        const { seriesInfo, history } = this.props;
        if (seriesInfo.length === 0) {
            history.push(`/${window.location.search}`);
        }
        // 获取七牛token
        let res = await api.auth.getUptoken(localStorage.getItem('TOKEN'));
        if (res.msg === 'OK') {
            this.setState({ uptoken: res.result });
        } else {
            message.error({ text: res.msg });
        }
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
                    message.success('删除成功！');
                    history.push(`/${window.location.search}`);
                } else {
                    message.success('编辑成功！');
                    history.goBack();
                }
            } else {
                message.success('创建成功！');
                // history.push(`/${window.location.search}`);
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