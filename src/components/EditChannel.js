import React, { Component } from 'react';
import './EditChannel.css';
import util from '../services/Util';
import { Form, Input, Button, message } from 'antd';

import { connect } from 'react-redux';

import { addChannel, editChannel, } from '../actions/app';

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
        };
    },

    onValuesChange(_, values) {
        console.log(values);
    },

})(props => {
    const { getFieldDecorator } = props.form;
    return (
        <Form onSubmit={props.onSubmit}>
            <Form.Item label="频道名">
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入微站名！' }],
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
            editChannel(fields.key.value, fields.name.value, 1);
        } else {
            addChannel(nowStationKey, fields.name.value, 1);
        }
    }

    render() {
        const { fields } = this.state;

        return (
            <div className="edit-station">
                <div className="my-station-head">{fields.key.value ? '编辑' : '创建'}频道</div>
                <div className="main-content">
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