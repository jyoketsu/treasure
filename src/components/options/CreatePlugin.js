import React, { Component } from 'react';
// import './CreatePlugin.css';
import { Form, Input, Button, message, } from 'antd';
import UploadStationCover from '../common/UploadCover';
import util from '../../services/Util';
import { connect } from 'react-redux';
import { createPlugin, editPlugin, } from '../../actions/app';

const mapStateToProps = state => ({
    loading: state.common.loading,
    nowStationKey: state.station.nowStationKey,
    plugList: state.plugin.pluginList,
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
            url: Form.createFormField({
                ...props.url,
                value: props.url.value,
            }),
        };
    },

})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="插件名">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入插件名！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="插件地址">
                {getFieldDecorator('url', {
                    rules: [{ required: true, message: '请输入插件地址！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
});

class CreatePlugin extends Component {
    constructor(props) {
        super(props);
        const { plugList } = props;
        let pluginKey = util.common.getSearchParamValue(window.location.search, 'key');
        let plugin = null;
        for (let i = 0; i < plugList.length; i++) {
            if (plugList[i].pluginAppKey === pluginKey) {
                plugin = plugList[i];
                break;
            }
        }

        this.state = {
            key: plugin ? plugin.pluginAppKey : '',
            logo: plugin ? plugin.icon : '',
            fields: {
                name: {
                    value: plugin ? plugin.pluginName : '',
                },
                url: {
                    value: plugin ? plugin.url : '',
                },
            },
        }
        this.uploadAvatarCallback = this.uploadAvatarCallback.bind(this);
    }

    uploadAvatarCallback(imageUrl, columnName) {
        this.setState({
            [columnName]: imageUrl[0]
        });
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { createPlugin, nowStationKey, editPlugin } = this.props;
        const { fields, key, logo, } = this.state;

        this.form.validateFields(async (err, values) => {
            if (!err) {
                if (!logo) {
                    message.info('请上传logo！');
                    console.log('请上传logo！');
                    return;
                }
                if (key) {
                    editPlugin(key, nowStationKey, fields.name.value, logo, fields.url.value);
                } else {
                    createPlugin(nowStationKey, fields.name.value, logo, fields.url.value);
                }
            }
        });
    }

    render() {
        const { logo, fields, } = this.state;
        return (
            <div className="create-plugin">
                <h2>插件</h2>
                <label className='ant-form-item-required form-label'>插件logo</label>
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
                />
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        const { loading, history } = this.props;
        if (!loading && prevProps.loading) {
            history.goBack();
        }
    }
}

export default connect(
    mapStateToProps,
    { createPlugin, editPlugin, },
)(Form.create({ name: 'create-plugin' })(CreatePlugin));