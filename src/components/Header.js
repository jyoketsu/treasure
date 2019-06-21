import React, { Component } from 'react';
import './Header.css';
import { Link, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { getUserInfo, logout, changeStation, getStationList, clearStoryList, } from '../actions/app';
import TextMarquee from './common/TextMarquee';
import util from '../services/Util';
import {
    Menu,
    Dropdown,
    Modal,
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
        this.handleMenuClick = this.handleMenuClick.bind(this);
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

    handleMenuClick({ key, item }) {
        const { history, clearStoryList, location, } = this.props;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        const domain = item.props.domain;
        switch (key) {
            case "account":
                history.push(`/${stationDomain}/me`);
                break;
            case "myStation": break;
            case "logout": this.showConfirm(); break;
            case "stationOptions":
                clearStoryList();
                history.push(`/${stationDomain}/stationOptions`);
                break;
            case "subscribeStation":
                history.push(`/${stationDomain}/subscribeStation`);
                break;
            default:
                // 切换站点
                this.props.changeStation(key);
                history.push(`/${domain}`);
                break;
        }
    }

    render() {
        const { location, nowStation, stationList, } = this.props;
        const pathname = location.pathname;
        const stationDomain = pathname.split('/')[1];
        const isMobile = util.common.isMobile();

        const menu = (
            <Menu onClick={this.handleMenuClick}>
                {
                    nowStation && nowStation.editRight ?
                        <Menu.Item key="stationOptions">本站管理</Menu.Item> : null
                }
                {/* <Divider /> */}
                <Menu.Item key="myStation">我的站点</Menu.Item>
                {
                    stationList.map((station) => (
                        <Menu.Item key={station._key} domain={station.domain || station._key}>{`　・${station.name}`}</Menu.Item>
                    ))
                }
                {/* <Divider /> */}
                <Menu.Item key="subscribeStation">订阅站点</Menu.Item>
                <Menu.Item key="account">账户</Menu.Item>
                <Menu.Item key="logout">退出</Menu.Item>
            </Menu>
        );

        return (
            <div className="app-menu-container">
                <ul className="app-menu" ref={elem => this.nv = elem}>
                    <li className={`menu-logo`} style={{
                        backgroundImage: `url(${nowStation && nowStation.logo !== null ? nowStation.logo : '/image/background/logo.png'})`
                    }}>
                        <Link to={`/${stationDomain}`}></Link>
                    </li>
                    {
                        !isMobile ? <li className="head-station-name">{nowStation ? nowStation.name : ''}</li> : null
                    }
                    <li className="menu-space"></li>
                    {
                        !isMobile ?
                            <TextMarquee
                                width={189}
                                text={"文字如果超出了宽度自动向左滚动文字如果超出了宽度自动向左滚动"}
                                style={{ marginRight: '24px' }}
                            /> : null
                    }
                    <li className={`head-icon subscribe`}>

                    </li>
                    <li className={`head-icon search`}>

                    </li>
                    <li className={`head-icon message ${pathname === '/message' ? 'active' : ''}`}>
                        <Link to={`/message`}></Link>
                    </li>
                    <li className={`head-icon me ${pathname === '/me' ? 'active' : ''}`}>
                        <Dropdown overlay={menu} overlayStyle={{ width: '200px' }}>
                            <a className="ant-dropdown-link" href="####">me</a>
                        </Dropdown>
                    </li>
                </ul>
                {
                    isMobile ?
                        <TextMarquee
                            width={document.body.offsetWidth}
                            text={"文字如果超出了宽度自动向左滚动文字如果超出了宽度自动向左滚动"}
                            style={{ fontSize: '24px' }}
                        /> : null
                }
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
    }

    componentDidUpdate(prevProps) {
        const {
            user,
            overdue,
            history,
            location,
            stationList,
            nowStationKey,
            getStationList,
            changeStation,
        } = this.props;
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
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getUserInfo, logout, changeStation, getStationList, clearStoryList, }
)(Header));