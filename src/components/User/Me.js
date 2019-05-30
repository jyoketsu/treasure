import React, { Component } from 'react';
import './Me.css';
import { Tabs, Modal, } from 'antd';
import util from '../../services/Util';
import MyStation from './MyStation';
import Profile from './Profile';
import { connect } from 'react-redux';
import { logout } from '../../actions/app';

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
    user: state.auth.user,
});

class Me extends Component {
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
                    <span className="log-out ant-btn ant-btn-primary" onClick={this.showConfirm}>退出</span>
                </div>
                <div className="main-content account-content">
                    <Tabs defaultActiveKey={nowTab} tabPosition={tabPosition}>
                        <TabPane tab="我的名片" key="profile">
                            <Profile />
                        </TabPane>
                        <TabPane tab="我的投稿" key="myStory">
                            功能开发中，敬请期待！
                         </TabPane>
                        <TabPane tab="站点管理" key="myStation">
                            <MyStation />
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
    { logout },
)(Me);