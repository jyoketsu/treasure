import React, { Component } from 'react';
import './Me.css';
import { Link } from "react-router-dom";

import { connect } from 'react-redux';

const mapStateToProps = state => ({
    user: state.auth.user,
});

class Me extends Component {
    render() {
        const { user } = this.props;
        const avatar = user && user.profile && user.profile.avatar ?
            `${user.profile.avatar}?imageView2/1/w/80/h/80` :
            '/image/icon/avatar.svg';
        return (
            <div className="app-content account">
                <div className="user-info-card">
                    <div className="user-avatar" style={{ backgroundImage: `url(${avatar})` }}></div>
                    <div>手机号：{user ? user.mobile : ''}</div>
                </div>
                <div className="main-content">
                    <div className="my-content">
                        {/* <Link to="/myStation">我的文章</Link> */}
                        <Link to="/myStation">我的微站</Link>
                        {/* <Link to="/myStation">我的收藏</Link> */}
                        <div>功能开发中，敬请期待！</div>
                    </div>
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(Me);