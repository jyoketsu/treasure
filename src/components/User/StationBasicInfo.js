import React, { Component } from 'react';
import './StationBasicInfo.css';
import util from '../../services/Util';
import { Form, Input, Button, message, Checkbox, } from 'antd';
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
            memo: Form.createFormField({
                ...props.memo,
                value: props.memo.value,
            }),
            open: Form.createFormField({
                ...props.open,
                value: props.open.value,
            }),
        };
    },

    onValuesChange(_, values) {
        console.log(values);
    },

})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="微站名">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入微站名！' }],
                })(<Input />)}
            </Form.Item>
            <Form.Item label="微站概述">
                {getFieldDecorator('memo', {
                    rules: [{ required: true, message: '请输入微站概述！' }],
                })(<TextArea rows={6} />)}
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
                memo: {
                    value: stationInfo ? stationInfo.memo : '',
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
                    editStation(starKey, fields.name.value, type, fields.memo.value, fields.open.value, isMainStar, cover, logo, size);
                } else {
                    createStation(fields.name.value, 1, fields.memo.value, fields.open.value, false, cover, logo, size);
                }
            }
        });
    }

    render() {
        const { cover, logo, fields, } = this.state;

        return (
            <div>
                <label className='ant-form-item-required form-label'>微站logo：（推荐分辨率：260*70）</label>
                <UploadStationCover
                    uploadAvatarCallback={this.uploadAvatarCallback}
                    extParam={'logo'}
                    coverUrl={logo}
                />
                <label className='ant-form-item-required form-label'>微站封面图：（推荐分辨率：1920*380）</label>
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