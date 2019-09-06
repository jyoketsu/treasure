import React, { Component } from 'react';
import './EditChannel.css';
import util from '../../services/Util';
import UploadStationCover from '../common/UploadCover';
import {
    Form,
    Input,
    Button,
    message,
    Select,
    Radio,
    Switch,
    Divider,
    Checkbox,
    Modal,
} from 'antd';
import { connect } from 'react-redux';
import { addChannel, editChannel, } from '../../actions/app';
const Option = Select.Option;
const { TextArea } = Input;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
    loading: state.common.loading,
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
});

const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
            name: Form.createFormField({
                ...props.name,
                value: props.name.value,
            }),
            publish: Form.createFormField({
                ...props.publish,
                value: props.publish.value,
            }),
            question: Form.createFormField({
                ...props.question,
                value: props.question.value,
            }),
            answer: Form.createFormField({
                ...props.answer,
                value: props.answer.value,
            }),
            showStyle: Form.createFormField({
                ...props.showStyle,
                value: props.showStyle.value,
            }),
            allowPublicUpload: Form.createFormField({
                ...props.allowPublicUpload,
                value: props.allowPublicUpload.value,
            }),
            allowUploadVideo: Form.createFormField({
                ...props.allowUploadVideo,
                value: props.allowUploadVideo.value,
            }),
            showExif: Form.createFormField({
                ...props.showExif,
                value: props.showExif.value,
            }),
            contributeType: Form.createFormField({
                ...props.contributeType,
                value: props.contributeType.value,
            }),
            albumType: Form.createFormField({
                ...props.albumType,
                value: props.albumType.value,
            }),
            showSetting: Form.createFormField({
                ...props.showSetting,
                value: props.showSetting.value,
            }),
            tag: Form.createFormField({
                ...props.tag,
                value: props.tag.value,
            }),
            allowPublicTag: Form.createFormField({
                ...props.allowPublicTag,
                value: props.allowPublicTag.value,
            }),
            statusTag: Form.createFormField({
                ...props.statusTag,
                value: props.statusTag.value,
            }),
            allowPublicStatus: Form.createFormField({
                ...props.allowPublicStatus,
                value: props.allowPublicStatus.value,
            }),
        };
    },
})(props => {
    const { switchModal } = props;
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="频道名">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入微站名！' }],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="可见性">
                {getFieldDecorator('publish', {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请设定可见性！' },
                    ],
                })(
                    <Select>
                        <Option value={1}>公开</Option>
                        <Option value={2}>隐私，仅管理员以上可见</Option>
                        <Option value={3}>需要回答问题</Option>
                        <Option value={4}>需要同意</Option>
                    </Select>)}
            </Form.Item>
            {
                props.publish.value === 3 ? [
                    <Form.Item label="问题" key="question">
                        {getFieldDecorator('question')(<Input />)}
                    </Form.Item>,
                    <Form.Item label="答案" key="answer">
                        {getFieldDecorator('answer')(<Input />)}
                    </Form.Item>
                ] : null
            }
            <Divider />

            <Form.Item label="显示风格">
                {getFieldDecorator('showStyle', {
                    rules: [{ required: true, message: '请选择显示风格！' }],
                })(
                    <Radio.Group>
                        <Radio value={1}>单列宽幅</Radio>
                        <Radio value={2}>多列瀑布流</Radio>
                    </Radio.Group>,
                )}
            </Form.Item>

            <Form.Item label="显示设置">
                {getFieldDecorator('showSetting', {
                })(
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Checkbox value="author">显示作者</Checkbox>
                        <Checkbox value="title">显示标题</Checkbox>
                        <Checkbox value="like">显示点赞数</Checkbox>
                        <Checkbox value="clickNumber">显示阅读数</Checkbox>
                    </Checkbox.Group>,
                )}
            </Form.Item>

            <Form.Item label="允许公众上传">
                {getFieldDecorator('allowPublicUpload', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Form.Item label="允许上传视频">
                {getFieldDecorator('allowUploadVideo', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Form.Item label="显示图片参数">
                {getFieldDecorator('showExif', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Divider />

            <Form.Item label="可投稿类型">
                {getFieldDecorator('contributeType', {
                    // initialValue: [1, 2],
                    rules: [
                        { required: true, message: '请至少设定1个投稿类型！' },
                    ],
                })(
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Checkbox value={1}>相册</Checkbox>
                        <Checkbox value={2}>文章</Checkbox>
                    </Checkbox.Group>,
                )}
            </Form.Item>

            <Form.Item label="相册类型">
                {getFieldDecorator('albumType', {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请设定相册类型！' },
                    ],
                })(
                    <Select>
                        <Option value="normal">普通</Option>
                        <Option value="contest">大赛类型</Option>
                    </Select>)}
            </Form.Item>

            <Divider />

            <Form.Item label="分类标签">
                {getFieldDecorator('tag', {
                    initialValue: '',
                })(<TextArea rows={2} placeholder="可输入多个标签，按空格生成标签…" />)}
            </Form.Item>

            <span className="set-tag-logo" onClick={switchModal}>标签进阶设定</span>

            <Form.Item label="允许公众设置">
                {getFieldDecorator('allowPublicTag', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Divider />

            <Form.Item label="状态标签">
                {getFieldDecorator('statusTag', {
                    initialValue: '',
                })(<TextArea rows={2} placeholder="可输入多个标签，按空格生成标签…" />)}
            </Form.Item>
            <Form.Item label="允许公众设置">
                {getFieldDecorator('allowPublicStatus', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Divider />

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
});

class EditChannel extends Component {
    constructor(props) {
        super(props);
        this.uploadAvatarCallback = this.uploadAvatarCallback.bind(this);
        this.switchModal = this.switchModal.bind(this);
        this.handleSetTag = this.handleSetTag.bind(this);
        const { nowStation, location, } = this.props;
        let seriesInfo = nowStation ? nowStation.seriesInfo : [];
        let channelKey = util.common.getSearchParamValue(location.search, 'key');
        let channelInfo = null;
        for (let i = 0; i < seriesInfo.length; i++) {
            if (seriesInfo[i]._key === channelKey) {
                channelInfo = seriesInfo[i];
                break;
            }
        }

        this.state = {
            showModal: false,
            logo: channelInfo ? channelInfo.logo : '',
            fields: {
                key: {
                    value: channelInfo ? channelInfo._key : '',
                },
                name: {
                    value: channelInfo ? channelInfo.name : '',
                },
                publish: {
                    value: channelInfo ? channelInfo.publish : 1,
                },
                question: {
                    value: channelInfo ? channelInfo.question : '',
                },
                answer: {
                    value: channelInfo ? channelInfo.answer : '',
                },
                showStyle: {
                    value: channelInfo ? channelInfo.showStyle : 2,
                },
                allowPublicUpload: {
                    value: channelInfo ? channelInfo.allowPublicUpload : true,
                },
                allowUploadVideo: {
                    value: channelInfo ? channelInfo.allowUploadVideo : true,
                },
                showExif: {
                    value: channelInfo ? channelInfo.showExif : true,
                },
                contributeType: {
                    value: channelInfo ?
                        (channelInfo.contributeType instanceof Array ? channelInfo.contributeType : [1, 2]) :
                        [1, 2],
                },
                showSetting: {
                    value: channelInfo ?
                        (channelInfo.showSetting instanceof Array ?
                            channelInfo.showSetting : ["author", "title", "like", "clickNumber"]) :
                        ["author", "title", "like", "clickNumber"],
                },
                albumType: {
                    value: channelInfo ? channelInfo.albumType : 'normal',
                },
                tag: {
                    value: channelInfo ? channelInfo.tag : '',
                },
                allowPublicTag: {
                    value: channelInfo ? channelInfo.allowPublicTag : true,
                },
                statusTag: {
                    value: channelInfo ? channelInfo.statusTag : '',
                },
                allowPublicStatus: {
                    value: channelInfo ? channelInfo.allowPublicStatus : false,
                }
            },
        }
    }

    switchModal() {
        this.setState((prevState) => ({
            showModal: !prevState.showModal
        }));
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    uploadAvatarCallback(imageUrl, columnName) {
        this.setState({
            [columnName]: imageUrl[0]
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { addChannel, nowStationKey, editChannel } = this.props;
        const { fields, logo } = this.state;

        if (fields.publish.value === 3) {
            if (!fields.question.value) {
                message.info('请输入问题！');
                return;
            }
            if (!fields.answer.value) {
                message.info('请输入答案！');
                return;
            }
        }

        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 验证通过
                let extParams = {};
                for (let key in fields) {
                    extParams[key] = fields[key].value;
                }
                if (!logo) {
                    message.info('请上传logo！');
                    console.log('请上传logo！');
                    return;
                }
                const logoSize = await util.common.getImageInfo(logo);
                extParams['logo'] = logo;
                extParams['logoSize'] = logoSize;

                if (fields.key.value) {
                    editChannel(
                        fields.key.value,
                        fields.name.value,
                        1,
                        extParams
                    );
                } else {
                    addChannel(
                        nowStationKey,
                        fields.name.value,
                        1,
                        extParams
                    );
                }
            }
        });
    }

    handleSetTag(tag) {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...{ tag: { value: tag } } },
            showModal: false
        }));
    }

    render() {
        const { fields, logo, showModal } = this.state;
        return (
            <div className="edit-channel">
                <div className="channel-head">{fields.key.value ? '频道设置' : '创建频道'}</div>
                <label className='ant-form-item-required form-label'>频道logo</label>
                <UploadStationCover
                    uploadAvatarCallback={this.uploadAvatarCallback}
                    extParam={'logo'}
                    coverUrl={logo}
                />
                <CustomizedForm
                    ref={node => this.form = node}
                    {...fields}
                    onChange={this.handleFormChange}
                    onSubmit={this.handleSubmit}
                    switchModal={this.switchModal}
                />
                <Modal
                    title="标签进阶设定"
                    visible={showModal}
                    onCancel={this.switchModal}
                    footer={null}
                    bodyStyle={{ padding: 'unset' }}
                >
                    <TagOptionList
                        tag={fields.tag.value}
                        onOk={this.handleSetTag}
                    />
                </Modal>
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        const { fields } = this.state;
        const { loading, history } = this.props;
        if (!loading && prevProps.loading) {
            message.success(`${fields.key.value ? '编辑' : '创建'}成功！`);
            history.goBack();
        }
    }
}

export default connect(
    mapStateToProps,
    { addChannel, editChannel },
)(Form.create({ name: 'create-station' })(EditChannel));

class TagOptionList extends Component {
    constructor(props) {
        super(props);
        const { tag = '' } = props;
        const tagList = tag.split(' ');
        let objList = [];
        for (let i = 0; i < tagList.length; i++) {
            if (util.common.isJSON(tagList[i])) {
                objList.push(JSON.parse(tagList[i]));
            } else {
                objList.push({
                    name: tagList[i],
                    logo: null,
                    info: null,
                });
            }
        }
        this.state = { objList: objList }
        this.handleChange = this.handleChange.bind(this);
        this.uploadCallback = this.uploadCallback.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleChange(name, info) {
        let [...list] = this.state.objList;
        for (let i = 0; i < list.length; i++) {
            if (name === list[i].name) {
                list[i].info = info;
                break;
            }
        }
        this.setState({ objList: list });
    }

    uploadCallback(url, name) {
        let [...list] = this.state.objList;
        for (let i = 0; i < list.length; i++) {
            if (name === list[i].name) {
                list[i].logo = url[0];
                break;
            }
        }
        this.setState({ objList: list });
    }

    handleClick() {
        const { onOk } = this.props;
        const { objList } = this.state;
        let list = [];
        for (let i = 0; i < objList.length; i++) {
            list.push(JSON.stringify(objList[i]));
        }
        onOk(list.join(' '));
    }

    render() {
        const { objList } = this.state;
        return (
            <div className="tag-option-list">
                <div className="tag-option-container">
                    {
                        objList.map((tag, index) => (
                            <TagOption
                                key={index}
                                tag={tag}
                                onChange={this.handleChange}
                                uploadCallback={this.uploadCallback}
                            />
                        ))
                    }
                </div>
                <div className="tag-list-footer">
                    <Button type="primary" onClick={this.handleClick}>确定</Button>
                </div>
            </div>
        );
    }
}

class TagOption extends Component {
    render() {
        const { tag, onChange, uploadCallback } = this.props;
        return (
            <div className="tag-option">
                <div className="tag-option-left">
                    <span>{tag.name}</span>
                    <TextArea
                        rows={3}
                        value={tag.info}
                        placeholder="请输入标签描述"
                        onChange={(e) => onChange(tag.name, e.target.value)}
                    />
                </div>
                <UploadStationCover
                    uploadAvatarCallback={uploadCallback}
                    extParam={tag.name}
                    coverUrl={tag.logo}
                />
            </div>
        );
    }
}