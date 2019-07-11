import React, { Component } from 'react';
import util from '../../services/Util';
import { Form, Input, Button, message, Select, Switch } from 'antd';
import { connect } from 'react-redux';
import { setPlugin } from '../../actions/app';

const Option = Select.Option;

const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

const CustomizedForm = Form.create({
    name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onChange(changedFields);
    },
    mapPropsToFields(props) {
        return {
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
            subscribePay: Form.createFormField({
                ...props.subscribePay,
                value: props.subscribePay.value,
            }),
            monthlyFee: Form.createFormField({
                ...props.monthlyFee,
                value: props.monthlyFee.value,
            }),
            annualFee: Form.createFormField({
                ...props.annualFee,
                value: props.annualFee.value,
            }),
            lifelongFee: Form.createFormField({
                ...props.lifelongFee,
                value: props.lifelongFee.value,
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
            <Form.Item label="公开性">
                {getFieldDecorator('publish', {
                    initialValue: 0,
                    rules: [
                        { required: true, message: '请设定公开性！' },
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
                        {getFieldDecorator('question', {
                            rules: [
                                { required: true, message: '请输入问题！' },
                            ],
                        })(<Input placeholder="请输入问题..." />)}
                    </Form.Item>,
                    <Form.Item label="答案" key="answer">
                        {getFieldDecorator('answer', {
                            rules: [
                                { required: true, message: '请输入答案！' },
                            ],
                        })(<Input placeholder="请输入答案..." />)}
                    </Form.Item>
                ] : null
            }

            <Form.Item label="付费订阅">
                {getFieldDecorator('subscribePay', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            {
                props.subscribePay.value ?
                    [
                        <Form.Item label="月费" key="monthlyFee">
                            {
                                getFieldDecorator('monthlyFee', {
                                    rules: [
                                        { required: true, message: '请输入！' },
                                    ]
                                })(<Input addonAfter="元/月" />)
                            }
                        </Form.Item>,
                        <Form.Item label="年费" key="annualFee">
                            {getFieldDecorator('annualFee', {
                                rules: [
                                    { required: true, message: '请输入！' },
                                ]
                            })(<Input addonAfter="元/年" />)}
                        </Form.Item>,
                        <Form.Item label="买断" key="lifelongFee">
                            {getFieldDecorator('lifelongFee', {
                                rules: [
                                    { required: true, message: '请输入！' },
                                ]
                            })(<Input addonAfter="元/终身" />)}
                        </Form.Item>,
                    ] : null
            }

            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form >
    );
});

class PluginOptions extends Component {
    constructor(props) {
        super(props);

        const { nowStation, location, } = this.props;
        let pluginInfos = nowStation ? nowStation.pluginInfo : [];
        let pluginKey = util.common.getSearchParamValue(location.search, 'key');
        let pluginInfo = null;
        for (let i = 0; i < pluginInfos.length; i++) {
            if (pluginInfos[i]._key === pluginKey) {
                pluginInfo = pluginInfos[i];
                break;
            }
        }

        this.key = pluginInfo ? pluginInfo._key : null;

        this.state = {
            fields: {
                publish: {
                    value: pluginInfo ? pluginInfo.publish : '',
                },
                question: {
                    value: pluginInfo ? pluginInfo.question : null,
                },
                answer: {
                    value: pluginInfo ? pluginInfo.answer : null,
                },
                subscribePay: {
                    value: pluginInfo ? pluginInfo.subscribePay : false,
                },
                monthlyFee: {
                    value: pluginInfo ? pluginInfo.monthlyFee : null,
                },
                annualFee: {
                    value: pluginInfo ? pluginInfo.annualFee : null,
                },
                lifelongFee: {
                    value: pluginInfo ? pluginInfo.lifelongFee : null,
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
        const { setPlugin } = this.props;
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

        if (fields.subscribePay.value && (
            isNaN(parseFloat(fields.monthlyFee.value)) ||
            isNaN(parseFloat(fields.annualFee.value)) ||
            isNaN(parseFloat(fields.lifelongFee.value)))
        ) {
            message.info('收费请输入数字');
            return;
        }

        const key = this.key;
        this.form.validateFields((err, values) => {
            if (!err) {
                // 验证通过
                console.log('验证通过', values);
                setPlugin(
                    key,
                    values.publish,
                    values.question,
                    values.answer,
                    values.subscribePay,
                    parseFloat(values.monthlyFee),
                    parseFloat(values.annualFee),
                    parseFloat(values.lifelongFee),
                );
            }
        });
    }

    render() {
        const { fields } = this.state;
        return (
            <div className="plugin-options">
                <div className="channel-head">插件设置</div>
                <CustomizedForm
                    ref={node => this.form = node}
                    {...fields}
                    onChange={this.handleFormChange}
                    onSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    { setPlugin },
)(Form.create({ name: 'plugin-options' })(PluginOptions));