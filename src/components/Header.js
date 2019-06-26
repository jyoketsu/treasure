import React, { Component } from 'react';
import './Header.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getUserInfo, logout, changeStation, getStationList, clearStoryList, } from '../actions/app';
import TextMarquee from './common/TextMarquee';
import { IconWithText } from './common/Common';
import ClickOutside from './common/ClickOutside';
import util from '../services/Util';
import {
    Menu,
    Dropdown,
    Modal,
    message,
    // Divider,
} from 'antd';
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    user: state.auth.user,
    overdue: state.auth.overdue,
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.clearLogo = this.clearLogo.bind(this);
        this.switchMenu = this.switchMenu.bind(this);
        this.state = {
            logoSize: null,
            showMenu: false,
        }
    }

    clearLogo() {
        this.setState({ logoSize: null });
    }

    switchMenu() {
        this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
    }

    render() {
        const { location, nowStation, user, } = this.props;
        const { logoSize, showMenu } = this.state;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        const isMobile = util.common.isMobile();

        return (
            <div className="app-menu-container">
                <ul className="app-menu" ref={elem => this.nv = elem}>
                    {
                        logoSize ?
                            <li className={`menu-logo`} style={{
                                backgroundImage: `url(${nowStation && nowStation.logo !== null ? nowStation.logo : '/image/background/logo.png'})`,
                                width: `${Math.ceil(55 * (logoSize.width / logoSize.height))}px`
                            }}>
                                <Link to={`/${stationDomain}`}></Link>
                            </li> :
                            <li className={`menu-logo`} style={{
                                backgroundImage: `url(/image/background/logo.png)`,
                                width: '55px'
                            }}>
                                <Link to={`/${stationDomain}`}></Link>
                            </li>
                    }
                    {
                        !isMobile ? <li className="head-station-name">{nowStation ? nowStation.name : ''}</li> : null
                    }
                    <li className="menu-space"></li>
                    <li
                        className={`head-icon me ${pathname === '/me' ? 'active' : ''}`}
                        style={{
                            backgroundImage: user && user.profile ? `url(${user.profile.avatar})` : '/image/icon/me.svg',
                            borderRadius: user && user.profile ? '25px' : 'unset',
                            width: user && user.profile ? '50px' : '32px',
                            height: user && user.profile ? '50px' : '32px',
                        }}
                        onClick={this.switchMenu}
                    ></li>
                </ul>
                {
                    // isMobile ?
                    //     <TextMarquee
                    //         width={document.body.offsetWidth}
                    //         text={"文字如果超出了宽度自动向左滚动文字如果超出了宽度自动向左滚动"}
                    //         style={{ fontSize: '24px' }}
                    //     /> : null
                }
                <ReactCSSTransitionGroup transitionName="myFade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {showMenu ?
                        <TopMenu clearLogo={this.clearLogo} switchMenu={this.switchMenu} />
                        : null
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    };

    componentDidMount() {
        this.nv.addEventListener('touchmove', function (e) {
            //阻止默认的处理方式(阻止下拉滑动的效果)
            e.preventDefault();
        }, { passive: false }); //passive 参数不能省略，用来兼容ios和android

        const { history, getUserInfo, location, getStationList, } = this.props;
        const SEARCH_STR = location.search;
        let token = null;
        let query_token = null;
        if (SEARCH_STR) {
            const QUERY_PARAMS = new URLSearchParams(SEARCH_STR);
            query_token = QUERY_PARAMS.get('token');
        }
        token = query_token ? query_token : window.localStorage.getItem('TOKEN');
        // 已登录，获取用户信息
        if (token) {
            getUserInfo(token, history);
            getStationList();
        } else {
            // 没有登录，跳转到登录页
            history.push(`/account/login${window.location.search}`);
        }

        // 监听路由变化
        const that = this;
        this.props.history.listen((route) => {
            if (route.pathname === '/account/login') {
                that.gettedList = false;
                that.changed = false;
            }
        })
    }

    async componentDidUpdate(prevProps) {
        const {
            user,
            overdue,
            history,
            location,
            stationList,
            nowStationKey,
            nowStation,
            getStationList,
            changeStation,
        } = this.props;
        const { nowStation: prevStation } = prevProps;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        if (!prevProps.overdue && overdue) {
            history.push(`/account/login${window.location.search}`);
        }

        // 显示初始微站
        if (user && !nowStationKey && stationList.length !== 0 && !this.changed) {
            // 指定了要显示的微站
            if (stationDomain && stationDomain !== 'account') {
                this.changed = true;
                changeStation(null, stationDomain);
            } else if (stationList.length !== 0) {
                // 主站key
                let mainStar = null;
                for (let i = 0; i < stationList.length; i++) {
                    if (stationList[i].isMainStar) {
                        mainStar = stationList[i];
                        break;
                    }
                }
                history.push(`/${mainStar.domain}`);
            }
        }

        if (!prevProps.user && user && stationList.length === 0 && !this.gettedList) {
            this.gettedList = true;
            getStationList();
        }

        // 切换微站
        if ((nowStation && prevStation && nowStation._key !== prevStation._key && nowStation.logo) ||
            (nowStation && !prevStation && nowStation.logo)) {
            // 获取logo大小
            let size = await util.common.getImageInfo(nowStation.logo);
            this.setState({
                logoSize: size
            });
        }
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getUserInfo, logout, changeStation, getStationList, clearStoryList, }
)(Header));

const mapStateToProps2 = state => ({
    user: state.auth.user,
    stationList: state.station.stationList,
});

class HeadMenu extends Component {
    constructor(props) {
        super(props);
        this.showConfirm = this.showConfirm.bind(this);
    }

    showConfirm() {
        const { logout, history } = this.props;
        confirm({
            title: '退出',
            content: '确定要退出吗？',
            onOk() {
                logout(history);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    handleClick(key) {
        const { user, history, location, } = this.props;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        switch (key) {
            case "account":
                history.push(`/${stationDomain}/me`);
                break;
            case "myStation": break;
            case "logout": this.showConfirm(); break;
            case "login":
                if (window.location.pathname !== '/account/login') {
                    history.push('/account/login');
                }
                break;
            // case "stationOptions":
            //     clearStoryList();
            //     history.push(`/${stationDomain}/stationOptions`);
            //     break;
            case "subscribe":
                history.push(`/${stationDomain}/subscribeStation`);
                break;
            default:
                message.info('功能开发中，敬请期待...');
                break;
        }
    }

    handleStationClick(key, domain) {
        const { history, changeStation, clearLogo } = this.props;
        // 切换站点
        changeStation(key);
        history.push(`/${domain}`);
        clearLogo();
    }

    render() {
        const { user, stationList, switchMenu } = this.props;
        return (


            <div className="head-menu">
                <ClickOutside onClickOutside={switchMenu}>
                    {user ?
                        <div className="head-menu-button">
                            <IconWithText
                                key={'account'}
                                iconUrl="/image/icon/header/account.svg"
                                title="账户"
                                handleClick={this.handleClick.bind(this, 'account')} />
                            <IconWithText
                                key={'wallet'}
                                iconUrl="/image/icon/header/wallet.svg"
                                title="钱包"
                                handleClick={this.handleClick.bind(this, 'wallet')} />
                            <IconWithText
                                key={'message'}
                                iconUrl="/image/icon/header/message.svg"
                                title="消息"
                                handleClick={this.handleClick.bind(this, 'message')} />
                            <IconWithText
                                key={'logout'}
                                iconUrl="/image/icon/header/logout.svg"
                                title="退出"
                                handleClick={this.handleClick.bind(this, 'logout')} />
                            <IconWithText
                                key={'subscribe'}
                                iconUrl="/image/icon/header/subscribe.svg"
                                title="订阅"
                                handleClick={this.handleClick.bind(this, 'subscribe')} />
                            <IconWithText
                                key={'article'}
                                iconUrl="/image/icon/header/article.svg"
                                title="文章"
                                handleClick={this.handleClick.bind(this, 'article')} />
                            <IconWithText
                                key={'discover'}
                                iconUrl="/image/icon/header/discover.svg"
                                title="探索"
                                handleClick={this.handleClick.bind(this, 'discover')} />
                        </div> :
                        <div className="head-menu-login">
                            <IconWithText
                                key={'login'}
                                iconUrl="/image/icon/header/account.svg"
                                title="登录"
                                handleClick={this.handleClick.bind(this, 'login')} />
                        </div>}
                    {
                        user ?
                            <div className="menu-station-list">
                                {
                                    stationList.map((station) => (
                                        <span
                                            key={station._key}
                                            onClick={this.handleStationClick.bind(this, station._key, station.domain)}
                                        >{`・${station.name}`}</span>
                                    ))
                                }
                            </div> : null
                    }

                </ClickOutside>
            </div>
        )
    }
}

const TopMenu = withRouter(connect(
    mapStateToProps2,
    { clearStoryList, logout, changeStation, }
)(HeadMenu))