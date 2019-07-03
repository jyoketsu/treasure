import React, { Component } from 'react';
import './Login.css';
import { Form, Icon, Input, Button, Checkbox, Select, } from 'antd';
import api from '../services/Api';
import util from '../services/Util';
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import { LOGIN, } from '../actions/app';

const { Option } = Select;

const mapStateToProps = state => ({
    user: state.auth.user,
    nowStation: state.station.nowStation,
});

const mapDispatchToProps = dispatch => ({
    login: (params) =>
        dispatch({ type: LOGIN, payload: api.auth.login(params) }),
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { login } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                login({
                    mobileArea: values.mobileArea,
                    mobile: values.mobile,
                    password: values.password,
                });
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        let { nowStation } = this.props;
        if (!nowStation && sessionStorage.getItem('STATION_INFO')) {
            nowStation = JSON.parse(sessionStorage.getItem('STATION_INFO'));
        }

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
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码！' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="密码"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true,
                            })(<Checkbox>记住我</Checkbox>)}
                            <Link className="login-form-forgot" to="/account/reset">忘记密码</Link>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                            或者 <Link to="/account/register">立即注册！</Link>
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
                _key: nowStation._key,
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
    mapDispatchToProps
)(Form.create({ name: 'login' })(Login));