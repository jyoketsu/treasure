import React, { Component } from 'react';
import './Login.css';
import { FormGroup, Button, CheckBox, Link, Select, FormTextInput } from './common/Form.js';
import api from '../services/Api';
import { message } from 'antd';
import Loading from './common/Loading';
import util from '../services/Util';

import { connect } from 'react-redux';
import { LOGIN, REGISTER, BIND_MOBILE } from '../actions/app';

const mapStateToProps = state => ({
    user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
    login: (params, history) =>
        dispatch({ type: LOGIN, payload: api.auth.login(params) }),
    register: (params) =>
        dispatch({ type: REGISTER, payload: api.auth.register(params) }),
    bindMobile: (mobileArea, mobile, openId, code, type, fsInfo) =>
        dispatch({ type: BIND_MOBILE, payload: api.auth.thirdRegister(mobileArea, mobile, openId, code, type, fsInfo) }),
});

class Login extends Component {
    constructor(props) {
        super(props);
        let loginType = util.common.getSearchParamValue(this.props.location.search, 'type');
        this.state = {
            type: loginType || 'login',
            isAgree: false,
            count: 0,
        }
        this.params = {
            mobileArea: '+86',
        };
        this.login = this.login.bind(this);
        this.register = this.register.bind(this);
        this.getCode = this.getCode.bind(this);
        this.forgetPassword = this.forgetPassword.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.switchType = this.switchType.bind(this);
        this.switchAgree = this.switchAgree.bind(this);
        this.bindMobile = this.bindMobile.bind(this);
    }

    switchType(type) {
        this.setState({ type: type });
    }
    switchAgree() {
        this.setState((prevState) => ({
            isAgree: !prevState.isAgree
        }));
    }

    // 登陆
    async login() {
        const { login } = this.props;
        if (this.params.mobileArea && this.params.mobile && this.params.password) {
            login(this.params);
        } else {
            message.error('请输入完整！');
        }
    }

    // 注册
    async register() {
        const { register } = this.props;
        if (this.params.mobileArea && this.params.mobile && this.params.password && this.params.passwordRepeat) {
            if (this.params.password !== this.params.passwordRepeat) {
                message.error('请输入密码！');
            } else {
                register(this.params);
            }
        } else {
            message.error('请输入完整！');
        }
    }

    // 忘记密码
    async forgetPassword() {
        if (this.params.mobileArea && this.params.mobile && this.params.password && this.params.passwordRepeat) {
            if (this.params.password !== this.params.passwordRepeat) {
                message.error('两次密码不相同！');
            } else {
                Loading.open('请稍候...');
                let res = await api.auth.resetPassword(this.params);
                Loading.close();
                if (res.msg === "OK") {
                    message.success('重置密码成功！');
                    this.setState({ type: 'login', });
                } else {
                    message.error(res.msg);
                }
            }
        } else {
            message.error('请输入完整！');
        }
    }

    // 第三方账号绑定手机号
    async bindMobile() {
        const { bindMobile } = this.props;
        if (this.params.mobileArea && this.params.mobile && this.params.code) {
            bindMobile(this.params.mobileArea, this.params.mobile, this.openId, this.params.code, this.type, this.fsInfo);
        } else {
            message.error('请输入完整！');
        }
    }

    async getCode(type) {
        let that = this;
        let source;
        if (type === 'register') {
            source = 1;
        } else if (type === 'password') {
            source = 3;
        } else if (type === 'bind') {
            source = 2;
        }
        if (!this.state.count) {
            Loading.open('请稍后...');
            let res = await api.auth.getVerifyCode(Object.assign({ source: source }, this.params));
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
                message.error(res.msg);
            }

        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.params[name] = value;
    }

    showQQPopup() {
        window.QC.Login.showPopup({
            appId: "101523287",
            redirectURI: "https://f.qingtime.cn/login?type=login"
            // redirectURI: "http://localhost:3000/login?type=login"
        });
    }

    render() {
        const selectOptions = [{
            value: '+86',
            text: '中国大陆'
        }, {
            value: '+81',
            text: '日本'
        }, {
            value: '+1',
            text: '美国'
        }];

        let item = null;
        switch (this.state.type) {
            case 'login':
                item = [
                    <CheckBox key="remember"
                        text="记住密码" name="remember" onChange={this.handleInputChange} />,
                    <Button key="login"
                        text="登录"
                        style={{ width: '100%', height: '46px' }}
                        onClick={this.login} />
                ];
                break;
            case 'register':
                item = [
                    <FormGroup key="password">
                        <FormTextInput type="password" name="passwordRepeat" showType='edit' placeholder="请再次输入密码"
                            onChange={this.handleInputChange} />
                    </FormGroup>,
                    <FormGroup key="agree"
                        style={{ marginBottom: '40px' }}>
                        <CheckBox text="勾选即代表你同意《注册声明》《版权声明》" onChange={this.switchAgree} />
                    </FormGroup>,
                    <Button key="register"
                        text="注册"
                        disabled={this.state.isAgree ? false : true}
                        style={{ width: '100%', height: '46px' }} onClick={this.register} />
                ];
                break;
            case 'password':
                item = [
                    <FormGroup key="password">
                        <FormTextInput type="password" name="passwordRepeat" showType='edit' placeholder="请再次输入密码"
                            onChange={this.handleInputChange} />
                    </FormGroup>,
                    <Button key="resetPassword"
                        text="重置密码"
                        disabled={this.state.type === 'register' ? (this.state.isAgree ? false : true) : false}
                        style={{ width: '100%', height: '46px' }} onClick={this.forgetPassword} />
                ];
                break;
            case 'bind':
                item = (
                    <Button text="绑定手机号"
                        style={{ width: '100%', height: '46px' }} onClick={this.bindMobile} />);
                break;
            default: break;
        }
        return (
            <div className="login">
                <div className="login-box">
                    <FormGroup>
                        <Select
                            defaultValue={this.params.mobileArea}
                            name="mobileArea" placeholder="区号"
                            options={selectOptions}
                            onChange={this.handleInputChange}
                            style={{ display: 'inline-block', width: '30%' }} />
                        <FormTextInput
                            name="mobile" showType='edit' placeholder="请输入手机号"
                            style={{ marginTop: '15px', display: 'inline-block', width: '70%' }}
                            onChange={this.handleInputChange} />
                    </FormGroup>
                    {
                        this.state.type === 'register' || this.state.type === 'password' || this.state.type === 'bind' ?
                            <FormGroup>
                                <FormTextInput name="code" showType='edit' placeholder="请输入验证码"
                                    onChange={this.handleInputChange} />
                                <Button
                                    style={{ position: 'absolute', width: '120px', top: '0', right: '0', fontSize: '14px', boxShadow: 'unset' }}
                                    buttonType="noBorder"
                                    text={this.state.count ? `${this.state.count}S` : '获取验证码'}
                                    onClick={this.getCode.bind(this, this.state.type)} />
                            </FormGroup> : null
                    }
                    {
                        this.state.type !== 'bind' ?
                            <FormGroup>
                                <FormTextInput type="password" name="password" showType='edit' placeholder="请输入密码"
                                    onChange={this.handleInputChange} />
                            </FormGroup> : null
                    }
                    {item}
                    <FormGroup style={{ marginTop: '10px' }}>
                        {this.state.type === 'login' ?
                            <Link text="忘记密码" style={{ float: 'left' }} handleClick={this.switchType.bind(this, 'password')} />
                            : null}
                        {this.state.type === 'login' ?
                            <Link text="注册" style={{ float: 'right' }} handleClick={this.switchType.bind(this, 'register')} /> :
                            <Link text="登录" style={{ float: 'right' }} handleClick={this.switchType.bind(this, 'login')} />}
                    </FormGroup>
                    {
                        this.state.type !== 'bind' ?
                            <FormGroup className="thirdLogin-container" style={{ marginTop: '60px' }}>
                                {/* <div className="thirdLongin"><i className="loginByQQ" id="qqLoginBtn" onClick={this.showQQPopup}></i><span>QQ</span></div> */}
                            </FormGroup> : null
                    }
                </div>
            </div>
        );
    }

    async componentDidMount() {
        const { history } = this.props;
        let that = this;

        // QQ登录
        setTimeout(() => {
            if (window.QC && window.QC.Login.check()) {
                window.QC.Login.getMe(async function (openId, accessToken) {
                    that.type = 1;
                    that.openId = openId;
                    Loading.open('请稍后...');
                    let res = await api.auth.thirdLogin(openId, 1);
                    Loading.close();
                    if (res.msg === 'OK') {
                        // 使用qq登录成功
                        localStorage.setItem("TOKEN", res.token);
                        history.push({ pathname: '/' });
                    } else if (res.msg === 'NOUSER') {
                        message.error('该QQ号尚未绑定！');
                        that.setState({ type: 'bind' });
                    } else {
                        message.error(res.msg);
                    }
                })
            } else {
                console.log('不好意思用户没有登录');
            }
        }, 1000);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.user) {
            nextProps.history.push('/');
            return null;
        }
        return null;
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);