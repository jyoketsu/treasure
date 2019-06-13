import React, { Component } from 'react';
import './EditChannel.css';
import util from '../../services/Util';
import { Form, Input, Button, message, Select, Radio, Switch, Divider, } from 'antd';
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
            displayStyle: Form.createFormField({
                ...props.displayStyle,
                value: props.displayStyle.value,
            }),
            allowPublicUpload: Form.createFormField({
                ...props.allowPublicUpload,
                value: props.allowPublicUpload.value,
            }),
            allowVideo: Form.createFormField({
                ...props.allowVideo,
                value: props.allowVideo.value,
            }),
            showExif: Form.createFormField({
                ...props.showExif,
                value: props.showExif.value,
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
                        <Option value={2}>隐私，仅root 可见</Option>
                        <Option value={3}>需要回答问题</Option>
                        <Option value={4}>需要同意</Option>
                    </Select>)}
            </Form.Item>

            <Form.Item label="问题">
                {getFieldDecorator('question', {
                    rules: [{ required: true, message: '请输入问题！' }],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="答案">
                {getFieldDecorator('answer', {
                    rules: [{ required: true, message: '请输入答案！' }],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="显示风格">
                {getFieldDecorator('displayStyle')(
                    <Radio.Group>
                        <Radio value="1">单列宽幅</Radio>
                        <Radio value="2">多列瀑布流</Radio>
                    </Radio.Group>,
                )}
            </Form.Item>

            <Divider />

            <Form.Item label="允许公众上传">
                {getFieldDecorator('allowPublicUpload', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Form.Item label="允许上传视频">
                {getFieldDecorator('allowVideo', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Form.Item label="显示图片参数">
                {getFieldDecorator('showExif', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

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
                displayStyle: {
                    value: channelInfo ? channelInfo.displayStyle : '2',
                },
                allowPublicUpload: {
                    value: channelInfo ? channelInfo.allowPublicUpload : true,
                },
                allowVideo: {
                    value: channelInfo ? channelInfo.allowVideo : true,
                },
                showExif: {
                    value: channelInfo ? channelInfo.showExif : true,
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
        if (fields.key.value) {
            console.log('编辑频道字段：', fields);
            // editChannel(fields.key.value, fields.name.value, 1);
        } else {
            addChannel(nowStationKey, fields.name.value, 1);
        }
    }

    render() {
        const { fields } = this.state;

        return (
            <div className="edit-channel">
                <h2>{fields.key.value ? '频道设置' : '创建频道'}</h2>
                <Divider />
                <CustomizedForm
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