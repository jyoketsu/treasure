import React, { Component } from 'react';
import {
    Form,
    Input,
    Icon,
    Select,
    Row,
    Col,
    Button,
    message,
} from 'antd';
import Loading from './common/Loading';
import api from '../services/Api';
import util from '../services/Util';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { REGISTER } from '../actions/app';

const { Option } = Select;

const mapStateToProps = state => ({
    user: state.auth.user,
    nowStation: state.station.nowStation,
});

const mapDispatchToProps = dispatch => ({
    register: (params) =>
        dispatch({ type: REGISTER, payload: api.auth.register(params) }),
});

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = { count: 0, };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCode = this.getCode.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { register } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                register({
                    mobileArea: values.mobileArea,
                    mobile: values.mobile,
                    password: values.password,
                    code: values.code,
                    lo: 13,
                    la: 14,
                    appHigh: 26,
                });
            }
        });
    };

    async getCode() {
        const { form } = this.props;
        const mobileArea = form.getFieldValue('mobileArea');
        const mobile = form.getFieldValue('mobile');
        if (!(mobileArea && mobile)) {
            message.info('请输入手机号！');
            return;
        }
        let that = this;

        let { nowStation } = this.props;
        if (!nowStation && sessionStorage.getItem('STATION_INFO')) {
            nowStation = JSON.parse(sessionStorage.getItem('STATION_INFO'));
        }
        let codeType = 1;
        if (nowStation._key === "93088" || nowStation._key === "14137732091240538") {
            codeType = 2;
        }
        if (!this.state.count) {
            Loading.open('请稍后...');
            let res = await api.auth.getVerifyCode({
                mobileArea: mobileArea,
                mobile: mobile,
                source: 1,
                type: codeType
            });
            Loading.close();
            if (res.msg === 'OK') {
                let interval = setInterval(() => {
                    that.setState((prevState) => {
                        if (prevState.count === 1) {
                            clearInterval(interval);
                        }
                        return { count: prevState.count ? prevState.count - 1 : 60 };
                    });
                }, 1000);
            } else {
                message.info(res.msg);
            }
        }
    }

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不同！');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let { nowStation } = this.props;
        if (!nowStation && sessionStorage.getItem('STATION_INFO')) {
            nowStation = JSON.parse(sessionStorage.getItem('STATION_INFO'));
        }
        const { count } = this.state;

        // 国际区号选择
        const prefixSelector = getFieldDecorator('mobileArea', {
            initialValue: '+86',
        })(
            <Select style={{ width: 70 }}>
                <Option value="+86">+86</Option>
                <Option value="+87">+87</Option>
            </Select>,
        );

        return (
            <div className="login">
                <div className="login-box">
                    <div
                        className="login-logo"
                        style={{ backgroundImage: nowStation && nowStation.logo ? `url(${nowStation.logo})` : '' }}
                    ></div>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('mobile', {
                                rules: [{ required: true, message: '请输入手机号！' }],
                            })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} placeholder="手机号" />)}
                        </Form.Item>
                        <Form.Item hasFeedback>
                            {getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请输入密码！',
                                    },
                                    {
                                        validator: this.validateToNextPassword,
                                    },
                                ],
                            })(<Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码" />)}
                        </Form.Item>
                        <Form.Item hasFeedback>
                            {getFieldDecorator('confirm', {
                                rules: [
                                    {
                                        required: true,
                                        message: '请确认密码！',
                                    },
                                    {
                                        validator: this.compareToFirstPassword,
                                    },
                                ],
                            })(<Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="请确认密码！"
                                onBlur={this.handleConfirmBlur} />)}
                        </Form.Item>
                        <Form.Item>
                            <Row gutter={8}>
                                <Col span={12}>
                                    {getFieldDecorator('code', {
                                        rules: [{ required: true, message: '请输入验证码！' }],
                                    })(<Input placeholder="请输入验证码！" />)}
                                </Col>
                                <Col span={12}>
                                    {
                                        count === 0 ? <Button onClick={this.getCode}>获取验证码</Button> : <span>{`已发送验证码 ${count}秒`}</span>
                                    }

                                </Col>
                            </Row>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                            已有帐号？ <Link to="/account/login">直接登录</Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }

    async componentDidMount() {
        const { nowStation, } = this.props;

        if (nowStation) {
            // 将微站信息保存到session中，以防刷新登录页后丢失
            sessionStorage.setItem('STATION_INFO', JSON.stringify({
                logo: nowStation.logo,
                name: nowStation.name,
                domain: nowStation.domain,
            }));
        }
    }

    static getDerivedStateFromProps(nextProps) {
        if (nextProps.user && !nextProps.user.isGuest) {
            const search = nextProps.location.search;
            const redirect = util.common.getSearchParamValue(search, 'redirect');
            if (!redirect) {
                let nowStation = nextProps.nowStation ?
                    nextProps.nowStation :
                    sessionStorage.getItem('STATION_INFO') ? JSON.parse(sessionStorage.getItem('STATION_INFO')) : null;
                if (nowStation) {
                    nextProps.history.push(`/${nowStation.domain}`);
                }
            } else {
                const token = localStorage.getItem('TOKEN');
                window.location.href = `${redirect}?token=${token}`;
            }
            return null;
        }
        return null;
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Form.create({ name: 'register' })(Register));