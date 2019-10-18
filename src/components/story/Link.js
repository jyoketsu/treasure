import React, { Component } from 'react';
import util from '../../services/Util';
import { connect } from 'react-redux';
import {
    switchEditLinkVisible,
    addStory,
    modifyStory,
    applyEdit,
    exitEdit,
} from '../../actions/app';
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

    let tagList = tag ? tag.split(' ').map((item, index) => {
        if (util.common.isJSON(item)) {
            const itemObj = JSON.parse(item);
            return {
                id: itemObj.id,
                name: itemObj.name
            }
        } else {
            return {
                id: item,
                name: item
            }
        }
    }) : null;

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
                tagList && (allowPublicTag || (!allowPublicTag && role && role < 4)) ?
                    <Form.Item label="标签">
                        {getFieldDecorator('tag', {
                            rules: [
                                { required: true, message: '请选择标签！' },
                            ],
                        })(
                            <Select>
                                {
                                    tagList.map((item, index) => {
                                        return (<Option key={index} index={index} value={item.id}>{item.name}</Option>);
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
        const {
            user,
            story,
            nowStationKey,
            addStory,
            modifyStory,
            switchEditLinkVisible,
        } = this.props;

        this.form.validateFields(async (err, values) => {
            if (!err) {
                // 新增
                if (!story._key) {
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
                } else {
                    // 编辑
                    modifyStory({ ...story, ...values, ...{ key: story._key } });
                }

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

    componentDidMount() {
        const { story } = this.props;
        if (story._key) {
            applyEdit(story._key, story.updateTime);
        }
    }

    componentDidUpdate(prevProps) {
        const { story: prevStory = {} } = prevProps;
        const { story, applyEdit } = this.props;
        if (prevStory._key !== story._key) {
            applyEdit(story._key, story.updateTime);
            this.setState({
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
            });
        }
    }

    componentWillUnmount() {
        const { story, exitEdit } = this.props;
        if (story._key) {
            exitEdit(story._key);
        }
    }
}

export default connect(
    mapStateToProps,
    {
        switchEditLinkVisible,
        addStory,
        modifyStory,
        applyEdit,
        exitEdit,
    },
)(LinkStory);