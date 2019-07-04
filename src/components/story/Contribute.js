import React, { Component } from 'react';
import './Contribute.css';
import { withRouter } from "react-router-dom";
import { Form, Button, Tooltip, message, Select, Input, Modal } from 'antd';
import { FileUpload } from '../common/Form';
import util from '../../services/Util';
import api from '../../services/Api';
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

const Option = Select.Option;
const { TextArea } = Input;

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
            memo: Form.createFormField({
                ...props.memo,
                value: props.memo.value,
            }),
            series: Form.createFormField({
                ...props.series,
                value: props.series.value,
            }),
            address: Form.createFormField({
                ...props.address,
                value: props.address.value,
            }),
            isGroup: Form.createFormField({
                ...props.isGroup,
                value: props.isGroup.value,
            }),
        };
    },

})(props => {
    const { getFieldDecorator } = props.form;
    const addressList = ["北京赛区", "天津赛区", "河北赛区", "山西赛区", "内蒙古赛区", "辽宁赛区", "吉林赛区", "黑龙江赛区", "上海赛区", "江苏赛区", "浙江赛区", "安徽赛区", "福建赛区", "江西赛区", "山东赛区", "河南赛区", "湖北赛区", "湖南赛区", "广东赛区", "广西赛区", "四川赛区", "重庆赛区", "贵州赛区", "云南赛区", "陕西赛区", "甘肃赛区", "新疆赛区", "海南赛区", "宁夏赛区", "海外赛区"];
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="作品类型">
                {getFieldDecorator('isGroup', {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请选择作品类型！' },
                    ],
                })(
                    <Select>
                        <Option value={1}>单张</Option>
                        <Option value={2}>组照（4-8张）</Option>
                    </Select>)}
            </Form.Item>
            <Form.Item label="作品标题">
                {getFieldDecorator('title', {
                    rules: [
                        { max: 30, message: '不能超过30个字符！' },
                        { required: true, message: '请输入作品标题！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="作品描述">
                {getFieldDecorator('memo', {
                    rules: [{ max: 200, message: '不能超过200个字符！' },],
                })(<TextArea rows={3} />)}
            </Form.Item>
            {/* <Form.Item label="作品类别">
                {getFieldDecorator('series', {
                    rules: [{ required: true, message: '请选择作品类别！' },],
                })(
                    <Select style={{ width: 120 }}>
                        {
                            props.seriesInfo.map((series, index) => (
                                <Option key={index} value={series._key}>{series.name}</Option>
                            ))
                        }
                    </Select>)}
            </Form.Item> */}
            <Form.Item label="作品赛区">
                {getFieldDecorator('address', {
                    rules: [{ required: true, message: '请选择作品赛区！' },],
                })(
                    <Select style={{ width: 120 }}>
                        {
                            addressList.map((address, index) => (
                                <Option key={index} index={index} value={address}>{address}</Option>
                            ))
                        }
                    </Select>)}
            </Form.Item>
        </Form>
    );
});

class Contribute extends Component {
    constructor(props) {
        super(props);
        let type = util.common.getSearchParamValue(props.location.search, 'type');
        const story = type === 'new' ? {} : props.story;
        this.state = {
            story: story,
            fields: {
                title: {
                    value: story.title,
                },
                memo: {
                    value: story.memo,
                },
                series: {
                    value: story.series ? story.series._key : props.nowChannelKey,
                },
                address: {
                    value: story.address,
                },
                isGroup: {
                    value: story.isGroup,
                },
            },
        }
        this.addContent = this.addContent.bind(this);
        this.uploadImageCallback = this.uploadImageCallback.bind(this);
        this.deleteContent = this.deleteContent.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCommit = this.handleCommit.bind(this);
        this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    }

    handleCancel() {
        this.props.history.goBack();
    }

    handleCommit(e) {
        const { user, nowStationKey, addStory, modifyStory } = this.props;
        const { story, fields, } = this.state;
        e.preventDefault();
        this.form.validateFields(async (err, values) => {
            if (fields.isGroup.value === 1) {
                if (story.pictureCount !== 1) {
                    message.info('单张作品，请上传一张图片');
                    return;
                }
            } else {
                if (story.pictureCount < 4 || story.pictureCount > 8) {
                    message.info('组图，请上传4～8张图片');
                    return;
                }
            }
            if (!err) {
                // 验证通过
                // 编辑
                if (story._key) {
                    story.key = story._key;
                    for (let i = 0; i < story.richContent.length; i++) {
                        if (i === 0) {
                            story.cover = story.richContent[i].url;
                        }
                        if (story.richContent[i].metaType === 'image') {
                            delete story.richContent[i].exif;
                        }
                    }
                    // 封面大小
                    let size = await util.common.getImageInfo(story.cover);
                    story.size = size;
                    Object.assign(story, {
                        title: fields.title.value,
                        memo: fields.memo.value,
                        series: fields.series.value,
                        address: fields.address.value,
                        isGroup: fields.isGroup.value,
                    });
                    modifyStory(story);
                } else {
                    // 新增
                    story.cover = story.richContent[0].url;
                    // 封面大小
                    let size = await util.common.getImageInfo(story.cover);
                    Object.assign(story, {
                        userKey: user._key,
                        type: 6,
                        starKey: nowStationKey,
                        publish: 1,
                        size: size,
                        isSimple: 0,
                        title: fields.title.value,
                        memo: fields.memo.value,
                        series: fields.series.value,
                        address: fields.address.value,
                        isGroup: fields.isGroup.value,
                    });
                    addStory(story);
                }

            }
        });
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
     * 删除内容
     * @param {Number} index 要删除的位置
     */
    deleteContent(index) {
        this.setState((prevState) => {
            let { story: prevStory = {} } = prevState;
            let { richContent: prevContent = [] } = prevStory;
            prevContent.splice(index - 1, 1);
            prevStory.pictureCount = prevStory.pictureCount - 1;
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

    render() {
        const { story = {}, fields } = this.state;
        const { richContent = [] } = story;
        const { seriesInfo } = this.props;
        let centent = richContent ? richContent.map((content, index) => {
            let result = <StoryImage index={index} url={content.url} memo={content.memo} handleInput={this.handleInput} />

            let storyContent =
                <StoryContentEditBox
                    key={index}
                    index={index + 1}
                    addContent={this.addContent}
                    deleteContent={this.deleteContent.bind(this)}
                    uploadImageCallback={this.uploadImageCallback}
                >
                    {result}
                </StoryContentEditBox>
            return content.metaType === 'image' ? storyContent : null;
        }) : null;

        return (
            <div className="app-content edit-story" ref={eidtStory => this.eidtStoryRef = eidtStory}>
                <div className="main-content story-content">
                    <CustomizedForm
                        {...fields}
                        seriesInfo={seriesInfo}
                        ref={node => this.form = node}
                        onChange={this.handleFormChange}
                        onSubmit={this.handleSubmit}
                    />
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
                    </StoryContentEditBox>
                    {centent}
                    <div className="story-footer">
                        <Button onClick={this.handleCancel}>取消</Button>
                        {story._key ? <Button type="danger" onClick={this.showDeleteConfirm.bind(this, story._key)}>删除</Button> : null}
                        <Button type="primary" onClick={this.handleCommit}>保存</Button>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { seriesInfo, history, story, } = this.props;
        if (seriesInfo.length === 0) {
            history.push(`/${window.location.search}`);
        }
        // 申请编辑
        if (story._key) {
            api.story.applyEdit(story._key, story.updateTime);
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

class StoryContentEditBox extends Component {
    render() {
        let deleteButton = null;
        if (!this.props.hideDeleteButton) {
            deleteButton =
                <i className="delete-story-content"
                    onClick={this.props.deleteContent.bind(this, this.props.index)}></i>;
        }
        let buttonGroup = <StoryEditButtonGroup index={this.props.index}
            addContent={this.props.addContent}
            uploadImageCallback={this.props.uploadImageCallback} />

        return (
            <div className={`story-content-edit-box ${this.props.className}`}>
                <div
                    className="story-content-edit-content edit contribute"
                    style={Object.assign({ border: this.props.children ? '1px solid #DDDDDD' : 'unset' }, this.props.style)}>
                    {this.props.children}
                    {deleteButton}
                </div>
                {buttonGroup}
            </div>
        );
    }
}

class StoryEditButtonGroup extends Component {
    render() {
        const { index, } = this.props;
        return (
            <div className="story-edit-button-container">
                <Tooltip title="点击上传图片">
                    <div className="story-edit-button contribute-button">
                        <FileUpload
                            className="story-image-icon ant-btn ant-btn-primary"
                            style={{
                                display: 'block',
                                width: '84px',
                                height: '32px',
                                fontStyle: 'normal',
                                lineHeight: '32px',
                            }}
                            maxSize={10000000}
                            multiple="multiple"
                            text="添加图片"
                            extParam={{ index: index }}
                            callback={this.props.uploadImageCallback} />
                    </div>
                </Tooltip>
            </div>
        );
    }
}

class StoryImage extends Component {
    render() {
        const { url, memo, handleInput, index } = this.props;
        return (
            <div className="story-imageGroup">
                <div className="story-image-box"><img className="story-image" src={`${url}?imageView2/2/w/960/`} alt="story" /></div>
                <Input placeholder="请输入图片描述" value={memo} onChange={handleInput.bind(this, 'richContent', index)} />
            </div>
        );
    }
}

export default withRouter(
    connect(
        mapStateToProps,
        { addStory, modifyStory, deleteStory, },
    )(Form.create({ name: 'create-station' })(Contribute)));