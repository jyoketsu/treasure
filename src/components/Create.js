import React, { Component } from 'react';
import './Create.css';
import UploadStationCover from './common/UploadCover';
import util from '../services/Util';
import { Form, Input, Button, message } from 'antd';
import { connect } from 'react-redux';
import { createStation } from '../actions/app';

const { TextArea } = Input;

const mapStateToProps = state => ({
    stationList: state.station.stationList,
});

class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coverUrl: null,
        }
        this.uploadAvatarCallback = this.uploadAvatarCallback.bind(this);
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const { createStation } = this.props;
        const { coverUrl } = this.state;
        if (!coverUrl) {
            message.error('请上传封面！');
            return;
        }
        let size = await util.common.getImageInfo(coverUrl);
        this.props.form.validateFields((err, values) => {
            if (!err) {
                createStation(values.name, 1, values.memo, false, coverUrl, size);
            }
        });
    };

    uploadAvatarCallback(imageUrl) {
        this.setState({
            coverUrl: imageUrl[0]
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { coverUrl } = this.state;
        return (
            <div className="main-content create-station">
                <h2>创建微站</h2>
                <UploadStationCover
                    uploadAvatarCallback={this.uploadAvatarCallback}
                    coverUrl={coverUrl}
                />
                <Form onSubmit={this.handleSubmit} className="login-form">
                    {/* 微站名 */}
                    <Form.Item>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入微站名!' }],
                        })(
                            <Input
                                placeholder="请输入微站名"
                            />,
                        )}
                    </Form.Item>
                    {/* 微站概述 */}
                    <Form.Item>
                        {getFieldDecorator('memo', {
                            rules: [{ required: true, message: '请输入微站概述!' }],
                        })(
                            <TextArea rows={6} placeholder="请输入微站概述" />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            保存
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    };

    componentDidUpdate(prevProps) {
        const { stationList, history } = this.props;
        if (stationList.length !== prevProps.stationList.length) {
            message.success('创建成功！');
            history.push(`/${window.location.search}`);
        }

    }
}

export default connect(
    mapStateToProps,
    { createStation, },
)(Form.create({ name: 'create-station' })(Create));