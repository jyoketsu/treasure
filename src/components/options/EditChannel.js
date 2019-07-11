import React, { Component } from 'react';
import './EditChannel.css';
import util from '../../services/Util';
import { Form, Input, Button, message, Select, Radio, Switch, Divider, Checkbox, } from 'antd';
import { connect } from 'react-redux';
import { addChannel, editChannel, } from '../../actions/app';
const Option = Select.Option;

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
        };
    },
})(props => {
    const { getFieldDecorator } = props.form;
    const formItemLayout = {
        labelCol: {
            xs: { span: 5 },
            sm: { span: 5 },
        },
        wrapperCol: {
            xs: { span: 19 },
            sm: { span: 19 },
        },
    };

    return (
        <Form {...formItemLayout} onSubmit={props.onSubmit}>
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
            },
        }
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { addChannel, nowStationKey, editChannel } = this.props;
        const { fields, } = this.state;

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

        this.form.validateFields((err, values) => {
            if (!err) {
                // 验证通过
                let extParams = {};
                for (let key in fields) {
                    extParams[key] = fields[key].value;
                }
                if (fields.key.value) {
                    console.log('编辑频道字段：', extParams);
                    editChannel(fields.key.value, fields.name.value, 1, extParams);
                } else {
                    addChannel(nowStationKey, fields.name.value, 1, extParams);
                }
            }
        });
    }

    render() {
        const { fields } = this.state;

        return (
            <div className="edit-channel">
                <div className="channel-head">{fields.key.value ? '频道设置' : '创建频道'}</div>
                <CustomizedForm
                    ref={node => this.form = node}
                    {...fields}
                    onChange={this.handleFormChange}
                    onSubmit={this.handleSubmit}
                />
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