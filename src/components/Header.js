import React, { Component } from 'react';
import './Header.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link, withRouter } from "react-router-dom";
// import TextMarquee from './common/TextMarquee';
import { IconWithText } from './common/Common';
import ClickOutside from './common/ClickOutside';
import util from '../services/Util';
import { Modal, message, Button, Checkbox, } from 'antd';
import { connect } from 'react-redux';
import {
    getUserInfo,
    logout,
    changeStation,
    getStationList,
    clearStoryList,
    subscribe,
    subscribeStation,
    getStationDetail,
    getStoryList,
} from '../actions/app';
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    user: state.auth.user,
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
});

class Header extends Component {
    constructor(props) {
        super(props);
        this.clearLogo = this.clearLogo.bind(this);
        this.switchMenu = this.switchMenu.bind(this);
        this.switchSubscribe = this.switchSubscribe.bind(this);
        this.state = {
            logoSize: null,
            showMenu: false,
            showSubscribe: false,
        }
        this.perPage = 32;
    }

    clearLogo() {
        this.setState({ logoSize: null });
    }

    switchMenu() {
        this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
    }

    switchSubscribe() {
        this.setState((prevState) => ({ showSubscribe: !prevState.showSubscribe }));
    }

    render() {
        const { location, nowStation, user, } = this.props;
        const { logoSize, showMenu, showSubscribe } = this.state;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        const isMobile = util.common.isMobile();

        return (
            <div className="app-menu-container" style={{
                display: (
                    pathname === '/account/login' ||
                    pathname === '/account/register' ||
                    pathname === '/account/reset') ?
                    'none' : 'flex'
            }}>
                <ul className="app-menu" ref={elem => this.nv = elem}>
                    {
                        logoSize ?
                            <li className={`menu-logo`} style={{
                                backgroundImage: `url(${nowStation && nowStation.logo !== null ? nowStation.logo : '/image/background/logo.svg'})`,
                                width: `${Math.ceil(55 * (logoSize.width / logoSize.height))}px`
                            }}>
                                <Link to={`/${stationDomain}`}></Link>
                            </li> :
                            <li className={`menu-logo`} style={{
                                backgroundImage: `url(/image/background/logo.svg)`,
                                width: '55px'
                            }}>
                                <Link to={`/${stationDomain}`}></Link>
                            </li>
                    }
                    {
                        !isMobile ? <li className="head-station-name"><Link to={`/${stationDomain}`}>{nowStation ? nowStation.name : ''}</Link></li> : null
                    }
                    <li className="menu-space"></li>
                    {
                        user && !user.isGuest ?
                            <li
                                className={`head-icon subscribe ${pathname === '/message' ? 'active' : ''}`}
                                onClick={this.switchSubscribe}
                            ></li>
                            : null
                    }
                    {
                        user && !user.isGuest && nowStation && nowStation.role <= 3 ?
                            <li className={`head-icon station-option-icon ${pathname === '/message' ? 'active' : ''}`}>
                                <Link to={`/${stationDomain}/stationOptions`}></Link>
                            </li> : null
                    }
                    <li
                        className={`head-icon me ${pathname === '/me' ? 'active' : ''}`}
                        style={{
                            backgroundImage: user && user.profile && user.profile.avatar ? `url(${user.profile.avatar})` : '/image/icon/me.svg',
                            borderRadius: user && user.profile && user.profile.avatar ? '25px' : 'unset',
                            width: user && user.profile && user.profile.avatar ? '50px' : '24px',
                            height: user && user.profile && user.profile.avatar ? '50px' : '24px',
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
                    {
                        showSubscribe ? <SubscribeMenu switchSubscribe={this.switchSubscribe} /> : null
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

        const { history, getUserInfo, location, getStationList, changeStation, } = this.props;
        const SEARCH_STR = location.search;
        let token = null;
        let query_token = null;
        if (SEARCH_STR) {
            query_token = util.common.getSearchParamValue(location.search, 'token');
        }
        token = query_token ? query_token : window.localStorage.getItem('TOKEN');
        // 获取用户信息
        getUserInfo(token, history);
        getStationList();

        // 监听路由变化
        const that = this;
        this.props.history.listen((route, action) => {
            if (route.pathname === '/account/login') {
                that.gettedList = false;
                that.changed = false;
            }

            // 点击了浏览器前进，后退按钮
            if (action === 'POP') {
                const nowDomain = route.pathname.split('/')[1];
                const prevDomain = sessionStorage.getItem('DOMAIN');
                if (nowDomain !== prevDomain) {
                    console.log('换站了');
                    changeStation(null, nowDomain);
                }
            }
        })
    }

    async componentDidUpdate(prevProps) {
        const {
            user,
            history,
            location,
            stationList,
            nowStationKey,
            nowStation,
            getStationList,
            getStationDetail,
            getStoryList,
            changeStation,
            clearStoryList,
            sortType,
            sortOrder,
        } = this.props;
        const { nowStation: prevStation } = prevProps;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];

        // 显示初始微站
        if (user && !nowStationKey && !this.changed) {
            // 指定了要显示的微站
            if (stationDomain && stationDomain !== 'account') {
                this.changed = true;
                changeStation(null, stationDomain);
            } else {
                // 登录用户
                if (!user.isGuest && stationList.length !== 0) {
                    // 主站key
                    let mainStar = null;
                    for (let i = 0; i < stationList.length; i++) {
                        if (stationList[i].isMainStar) {
                            mainStar = stationList[i];
                            break;
                        }
                    }
                    if (mainStar) {
                        history.push(`/${mainStar.domain}`);
                    } else {
                        const prevDomain = sessionStorage.getItem('DOMAIN') || 'sgkj';
                        history.push(`/${prevDomain}`);
                    }
                } else {
                    // 游客用户
                    if (pathname === '/') {
                        // 什么站点都不指定，跳转到上次访问的微站或者时光科技站
                        const prevDomain = sessionStorage.getItem('DOMAIN') || 'sgkj';
                        history.push(`/${prevDomain}`);
                    }
                }
            }
        }

        //  用户登录后获取站点列表
        if (((prevProps.user && prevProps.user.isGuest) || !prevProps.user) && user && !user.isGuest && stationList.length === 0 && !this.gettedList) {
            this.gettedList = true;
            getStationList();
        }

        // 切换微站时重新获取故事
        if ((nowStationKey !== prevProps.nowStationKey) || (prevProps.user && prevProps.user.isGuest && !user.isGuest)) {
            clearStoryList();
            if (nowStationKey !== 'notFound') {
                getStationDetail(nowStationKey);
            } else {
                history.push('/station/notFound');
            }
        }

        if ((nowStation && ((prevStation && nowStation._key !== prevStation._key) || !prevStation)) ||
            (nowStation && prevProps.user && prevProps.user.isGuest && !user.isGuest)) {
            this.curPage = 1;
            getStoryList(1, nowStationKey, null, nowStation.showAll ? 'allSeries' : nowStation.seriesInfo[0]._key, sortType, sortOrder, 1, this.perPage);
            sessionStorage.setItem('home-curpage', this.curPage);
        }

        // 切换了微站后，获取logo大小
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
    {
        getUserInfo,
        logout,
        changeStation,
        getStationList,
        clearStoryList,
        getStationDetail,
        getStoryList,
    }
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
        const { history, location, switchMenu } = this.props;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        switchMenu();
        switch (key) {
            case "account":
                history.push(`/${stationDomain}/me`);
                break;
            case "logout": this.showConfirm(); break;
            case "login":
                if (window.location.pathname !== '/account/login') {
                    history.push('/account/login');
                }
                break;
            case "subscribe":
                history.push(`/${stationDomain}/subscribe`);
                break;
            case "discover":
                window.open(`https://exp.qingtime.cn?token=${localStorage.getItem('TOKEN')}`, '_blank');
                break;
            case "article":
                history.push(`/${stationDomain}/myArticle`);
                break;
            default:
                message.info('功能开发中，敬请期待...');
                break;
        }
    }

    handleStationClick(key, domain) {
        const { history, changeStation, clearLogo, switchMenu } = this.props;
        switchMenu();
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
                    {user && !user.isGuest ?
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
                        user && !user.isGuest ?
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

const mapStateToProps3 = state => ({
    user: state.auth.user,
    nowStation: state.station.nowStation,
});

class Subscribe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedChannels: [],
            allChecked: false,
        }
        this.onChange = this.onChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    onChange(e) {
        const { nowStation } = this.props;
        const { seriesInfo } = nowStation;
        const key = e.target.name;
        const checked = e.target.checked;
        if (key === 'all') {
            let checkedChannels = [];
            if (checked) {
                for (let i = 0; i < seriesInfo.length; i++) {
                    checkedChannels.push(seriesInfo[i]._key);
                }
            }
            this.setState({
                checkedChannels: checkedChannels,
                allChecked: checked,
            });
        } else {
            this.setState((prevState) => {
                let prevList = prevState.checkedChannels;
                if (checked) {
                    prevList.push(key);
                } else {
                    prevList.splice(prevList.indexOf(key), 1);
                }
                return {
                    checkedChannels: prevList,
                    allChecked: prevList.length === seriesInfo.length ? true : false
                }
            });
        }
    }

    handleSave() {
        const { subscribe, subscribeStation, nowStation, switchSubscribe, } = this.props;
        const { checkedChannels, allChecked } = this.state;
        switchSubscribe();
        let list = [];
        for (let i = 0; i < checkedChannels.length; i++) {
            list.push({ type: 'series', value: checkedChannels[i] });
        }
        if (allChecked) {
            subscribeStation(nowStation._key, allChecked);
        } else {
            subscribe(list, nowStation._key, checkedChannels);
        }
    }

    render() {
        const { nowStation, switchSubscribe } = this.props;
        const channelList = nowStation ? nowStation.seriesInfo : [];
        const { checkedChannels, allChecked } = this.state;
        return (
            <div className="subscribe-menu">
                <ClickOutside onClickOutside={switchSubscribe}>
                    <div className="menu-title">
                        <span>订阅</span>
                        <Button
                            type="primary"
                            className="save-subscribe"
                            onClick={this.handleSave}
                        >保存</Button>
                    </div>
                    <div className="subscribe-menu-item">
                        <span>全站</span>
                        <Checkbox name="all" checked={allChecked} onChange={this.onChange} />
                    </div>
                    <div className="menu-title">
                        <span>频道</span>
                        {/* <span className="select-all">全选</span> */}
                    </div>
                    {channelList.map((channel, index) => (
                        <div className="subscribe-menu-item" key={index}>
                            <span>{channel.name}</span>
                            <Checkbox
                                name={channel._key}
                                checked={checkedChannels.indexOf(channel._key) === -1 ? false : true}
                                onChange={this.onChange}
                            />
                        </div>
                    ))}
                </ClickOutside>
            </div>
        );
    }

    componentDidMount() {
        const { nowStation } = this.props;
        const channelList = nowStation ? nowStation.seriesInfo : [];
        let checkedChannels = [];
        for (let i = 0; i < channelList.length; i++) {
            if (channelList[i].isCareSeries) {
                checkedChannels.push(channelList[i]._key);
            }
        }
        this.setState({
            checkedChannels: checkedChannels,
            allChecked: checkedChannels.length === channelList.length ? true : false
        });
    }
}

const SubscribeMenu = withRouter(connect(
    mapStateToProps3,
    { subscribe, subscribeStation, }
)(Subscribe))