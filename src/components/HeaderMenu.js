import React, { Component } from 'react';
import './HeaderMenu.css';
import { withRouter } from "react-router-dom";
import { IconWithText } from './common/Common';
import ClickOutside from './common/ClickOutside';
import { Modal, message, } from 'antd';
import { connect } from 'react-redux';
import {
    logout,
    changeStation,
    clearStoryList,
} from '../actions/app';
const confirm = Modal.confirm;

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
        if (clearLogo) clearLogo();
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

export default withRouter(connect(
    mapStateToProps2,
    { clearStoryList, logout, changeStation, }
)(HeadMenu));