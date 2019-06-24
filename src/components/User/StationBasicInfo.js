import React, { Component } from 'react';
import './StationBasicInfo.css';
import util from '../../services/Util';
import { Form, Input, Button, message, Checkbox, Radio, } from 'antd';
import UploadStationCover from '../common/UploadCover';
import { withRouter } from "react-router-dom";

import { connect } from 'react-redux';

import { editStation, createStation } from '../../actions/app';

const { TextArea } = Input;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
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
            name: Form.createFormField({
                ...props.name,
                value: props.name.value,
            }),
            domain: Form.createFormField({
                ...props.domain,
                value: props.domain.value,
            }),
            memo: Form.createFormField({
                ...props.memo,
                value: props.memo.value,
            }),
            inheritedMode: Form.createFormField({
                ...props.inheritedMode,
                value: props.inheritedMode.value,
            }),
            open: Form.createFormField({
                ...props.open,
                value: props.open.value,
            }),
        };
    },
})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="站名">
                {getFieldDecorator('name', {
                    rules: [
                        { required: true, message: '请输入微站名！' },
                        { max: 20, message: '不能超过20个字符！' }
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="域名">
                {getFieldDecorator('domain', {
                    rules: [
                        { required: true, message: '请输入微站域名！' },
                        { pattern: /^[A-Za-z0-9]+$/, message: '请输入英文数字！' },
                        { max: 20, message: '不能超过20个字符！' }
                    ],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="概述">
                {getFieldDecorator('memo', {
                    rules: [
                        { required: true, message: '请输入微站概述！' },
                        { max: 1000, message: '不能超过1000个字符！' }
                    ],
                })(<TextArea rows={6} />)}
            </Form.Item>
            <Form.Item label="管理模式">
                {getFieldDecorator('inheritedMode', {
                    rules: [{ required: true, message: '请选择管理模式！' }],
                })(
                    <Radio.Group>
                        <Radio value={1}>全站统一</Radio>
                        <Radio value={2}>频道插件独立管理</Radio>
                    </Radio.Group>,
                )}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('open', {
                    valuePropName: 'checked',
                    initialValue: false,
                })(<Checkbox>公开微站</Checkbox>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
});

class StationBasicInfo extends Component {
    constructor(props) {
        super(props);
        const { stationInfo } = props;

        this.state = {
            starKey: stationInfo ? stationInfo._key : '',
            cover: stationInfo ? stationInfo.cover : '',
            logo: stationInfo ? stationInfo.logo : '',
            size: stationInfo ? stationInfo.size : '',
            type: stationInfo ? stationInfo.type : '',
            isMainStar: stationInfo ? stationInfo.isMainStar : '',
            fields: {
                name: {
                    value: stationInfo ? stationInfo.name : '',
                },
                domain: {
                    value: stationInfo ? stationInfo.domain : '',
                },
                memo: {
                    value: stationInfo ? stationInfo.memo : '',
                },
                inheritedMode: {
                    value: stationInfo ? stationInfo.inheritedMode : '',
                },
                open: {
                    value: stationInfo ? stationInfo.open : 0,
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
        const { editStation, createStation, } = this.props;
        const { fields, starKey, type, isMainStar, cover, logo, } = this.state;

        this.form.validateFields(async (err, values) => {
            if (!err) {
                if (!cover) {
                    message.error('请上传封面！');
                    console.log('请上传封面！');
                    return;
                }
                let size = await util.common.getImageInfo(cover);
                if (starKey) {
                    editStation(
                        starKey,
                        fields.name.value,
                        fields.domain.value,
                        type,
                        fields.memo.value,
                        fields.open.value,
                        isMainStar,
                        cover,
                        logo,
                        size,
                        fields.inheritedMode.value
                    );
                } else {
                    createStation(
                        fields.name.value,
                        fields.domain.value,
                        1,
                        fields.memo.value,
                        fields.open.value,
                        false,
                        cover,
                        logo,
                        size,
                        fields.inheritedMode.value);
                }
            }
        });
    }

    render() {
        const { cover, logo, fields, } = this.state;

        return (
            <div>
                <label className='ant-form-item-required form-label'>logo：（推荐分辨率：260*70）</label>
                <UploadStationCover
                    uploadAvatarCallback={this.uploadAvatarCallback}
                    extParam={'logo'}
                    coverUrl={logo}
                />
                <label className='ant-form-item-required form-label'>Banner图：（推荐分辨率：1920*523）</label>
                <UploadStationCover
                    uploadAvatarCallback={this.uploadAvatarCallback}
                    extParam={'cover'}
                    coverUrl={cover}
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
        const { loading, history, flag, } = this.props;
        if (!loading && prevProps.loading) {
            if (flag === 'createStation') {
                message.success('创建成功！');
                history.goBack();
            } else if (flag === 'editStation') {
                message.success('编辑成功！');
                history.goBack();
            }
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    { editStation, createStation },
)(Form.create({ name: 'create-station' })(StationBasicInfo)));