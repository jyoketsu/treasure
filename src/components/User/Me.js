import React, { Component } from 'react';
import './Me.css';
import { Tabs, } from 'antd';
import util from '../../services/Util';
import Profile from './Profile';
import { connect } from 'react-redux';

const TabPane = Tabs.TabPane;

const mapStateToProps = state => ({
    user: state.auth.user,
});

class Me extends Component {
    render() {
        const { user } = this.props;
        const avatar = user && user.profile && user.profile.avatar ?
            `${user.profile.avatar}?imageView2/1/w/80/h/80` :
            '/image/icon/avatar.svg';
        const tabPosition = util.common.isMobile() ? 'top' : 'left';
        const nowTab = sessionStorage.getItem('me-tab') ? sessionStorage.getItem('me-tab') : 'profile';
        return (
            <div className="app-content account">
                <div className="user-info-card">
                    <div className="user-avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
                    <div>{user ? (user.profile ? user.profile.nickName : user.mobile) : ''}</div>
                    <div>{user ? (user.profile ? user.profile.address : '') : ''}</div>
                </div>
                <div className="main-content account-content">
                    <Tabs defaultActiveKey={nowTab} tabPosition={tabPosition}>
                        <TabPane tab="我的名片" key="profile">
                            <Profile />
                        </TabPane>
                        <TabPane tab="我的投稿" key="myStory">
                            功能开发中，敬请期待！
                         </TabPane>
                        <TabPane tab="我的收藏" key="favorite">
                            功能开发中，敬请期待！
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(Me);