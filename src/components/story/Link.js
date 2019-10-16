import React, { Component } from 'react';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { switchEditLinkVisible, addStory, } from '../../actions/app';
import {
    Form,
    Input,
    Radio,
    Select,
    Modal,
} from 'antd';
const Option = Select.Option;

const mapStateToProps = state => ({
    user: state.auth.user,
    nowStationKey: state.station.nowStationKey,
    seriesInfo: state.station.nowStation ?
        state.station.nowStation.seriesInfo : [],
    story: state.story.story,
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
            url: Form.createFormField({
                ...props.url,
                value: props.url.value,
            }),
            openType: Form.createFormField({
                ...props.openType,
                value: props.openType.value,
            }),
            series: Form.createFormField({
                ...props.series,
                value: props.series.value,
            }),
            tag: Form.createFormField({
                ...props.tag,
                value: props.tag.value,
            }),
            statusTag: Form.createFormField({
                ...props.statusTag,
                value: props.statusTag.value,
            }),
        };
    },
})(props => {
    const { getFieldDecorator } = props.form;
    const { seriesInfo } = props;

    let channelInfo = {};
    const nowChannelId = props.series.value;
    for (let i = 0; i < seriesInfo.length; i++) {
        if (seriesInfo[i]._key === nowChannelId) {
            channelInfo = seriesInfo[i];
            break;
        }
    }
    const { tag, allowPublicTag, statusTag, allowPublicStatus, role } = channelInfo;

    const urlRe = new RegExp("(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]");
    return (
        <Form>
            <Form.Item label="链接名">
                {getFieldDecorator('title', {
                    rules: [{ required: true, message: '请输入链接名！' }],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="地址">
                {getFieldDecorator('url', {
                    rules: [
                        { required: true, message: '请输入链接地址！' },
                        { pattern: urlRe, message: '请输入正确的url' },
                    ],
                })(<Input />)}
            </Form.Item>

            <Form.Item label="打开方式">
                {getFieldDecorator('openType', {
                    rules: [{ required: true, message: '请选择打开方式！' }],
                })(
                    <Radio.Group>
                        <Radio value={1}>打开新标签页</Radio>
                        <Radio value={2}>本页内打开</Radio>
                    </Radio.Group>,
                )}
            </Form.Item>
            <Form.Item label="投稿主题">
                {getFieldDecorator('series', {
                    rules: [
                        { required: true, message: '请选择投稿主题！' },
                    ],
                })(
                    <Select>
                        {
                            seriesInfo.map((item, index) => (
                                (item.role && item.role < 5) || (item.allowPublicUpload) ?
                                    <Option key={index} value={item._key}>{item.name}</Option> : null
                            ))
                        }
                    </Select>
                )}
            </Form.Item>
            {
                tag && (allowPublicTag || (!allowPublicTag && role && role < 4)) ?
                    <Form.Item label="标签">
                        {getFieldDecorator('tag', {
                            rules: [
                                { required: true, message: '请选择标签！' },
                            ],
                        })(
                            <Select>
                                {
                                    tag.split(' ').map((item, index) => {
                                        let tagName = item;
                                        if (util.common.isJSON(item)) {
                                            tagName = JSON.parse(item).name;
                                        }
                                        return (<Option key={index} index={index} value={tagName}>{tagName}</Option>);
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item> : null
            }
            {
                statusTag && (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ?
                    <Form.Item label="状态标签">
                        {getFieldDecorator('statusTag', {
                            rules: [
                                { required: true, message: '请选择状态标签！' },
                            ],
                        })(
                            <Select>
                                {
                                    statusTag.split(' ').map((item, index) => (
                                        <Option key={index} index={index} value={item}>{item}</Option>
                                    ))
                                }
                            </Select>
                        )}
                    </Form.Item> : null
            }
        </Form>
    );
});

class LinkStory extends Component {
    constructor(props) {
        super(props);
        const { story } = props;
        this.state = {
            _key: story ? story._key : null,
            fields: {
                title: {
                    value: story ? story.title : '',
                },
                url: {
                    value: story ? story.url : '',
                },
                openType: {
                    value: story ? story.openType || 1 : 1,
                },
                series: {
                    value: story && story.series ? story.series._key || '' : '',
                },
                tag: {
                    value: story ? story.tag : '',
                },
                statusTag: {
                    value: story ? story.statusTag : '',
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
        const { _key } = this.state;
        const { addStory, user, nowStationKey, switchEditLinkVisible, } = this.props;
        this.form.validateFields(async (err, values) => {
            if (!err) {
                let story = {
                    userKey: user._key,
                    type: 15,
                    starKey: nowStationKey,
                    title: values.title,
                    url: values.url,
                    openType: values.openType,
                    series: values.series,
                    tag: values.tag,
                    statusTag: values.statusTag
                }
                addStory(story);
                switchEditLinkVisible();
            }
        });
    }

    render() {
        const { fields } = this.state;
        const { switchEditLinkVisible, seriesInfo } = this.props;
        return (
            <div className="link-story">
                <Modal
                    title="设定链接"
                    visible={true}
                    onOk={this.handleSubmit}
                    onCancel={switchEditLinkVisible}
                >
                    <CustomizedForm
                        ref={node => this.form = node}
                        {...fields}
                        seriesInfo={seriesInfo}
                        onChange={this.handleFormChange}
                    />
                </Modal>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    { switchEditLinkVisible, addStory },
)(LinkStory);