import React, { Component } from 'react';
import './EditStation.css';
import util from '../services/Util';
import { Form, Input, Button, message } from 'antd';
import UploadStationCover from './common/UploadCover';

import { connect } from 'react-redux';

import { editStation } from '../actions/app';

const { TextArea } = Input;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
    loading: state.common.loading,
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
                <Button type="primary" htmlType="submit" className="login-form-button">
                    保存
                </Button>
            </Form.Item>
        </Form>
    );
});

class EditStation extends Component {
    constructor(props) {
        super(props);
        const { location, stationList } = props;
        let stationKey = util.common.getSearchParamValue(location.search, 'key');
        let stationInfo = null;
        for (let i = 0; i < stationList.length; i++) {
            if (stationList[i].starKey === stationKey) {
                stationInfo = stationList[i];
                break;
            }
        }

        this.state = {
            starKey: stationInfo ? stationInfo.starKey : '',
            cover: stationInfo ? stationInfo.cover : '',
            size: stationInfo ? stationInfo.size : '',
            type: stationInfo ? stationInfo.type : '',
            isMainStar: stationInfo ? stationInfo.isMainStar : '',
            fields: {
                name: {
                    value: stationInfo ? stationInfo.starName : '',
                },
                memo: {
                    value: stationInfo ? stationInfo.memo : '',
                },
            },
        }
        this.uploadAvatarCallback = this.uploadAvatarCallback.bind(this);
    }

    uploadAvatarCallback(imageUrl) {
        this.setState({
            cover: imageUrl[0]
        });
    }

    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields },
        }));
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { editStation } = this.props;
        const { fields, starKey, type, isMainStar, cover } = this.state;
        if (!cover) {
            message.error('请上传封面！');
            return;
        }
        let size = await util.common.getImageInfo(cover);
        editStation(starKey, fields.name.value, type, fields.memo.value, isMainStar, cover, size);
    }

    render() {
        const { cover, fields } = this.state;

        return (
            <div className="edit-station">
                <div className="my-station-head">编辑微站</div>
                <div className="main-content">
                    <UploadStationCover
                        uploadAvatarCallback={this.uploadAvatarCallback}
                        coverUrl={cover}
                    />
                    <CustomizedForm
                        {...fields}
                        onChange={this.handleFormChange}
                        onSubmit={this.handleSubmit}
                    />
                </div>
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        const { loading, history } = this.props;
        if (!loading && prevProps.loading) {
            message.success('编辑成功！');
            history.goBack();
        }
    }
}

export default connect(
    mapStateToProps,
    { editStation },
)(Form.create({ name: 'create-station' })(EditStation));