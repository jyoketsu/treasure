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
        return (
            <div className="main-content account">
                <div className="user-info-card">
                    <div className="user-avatar"></div>
                    <div className="user-info">
                        <span>手机号：{user ? user.mobile : ''}</span>
                    </div>
                </div>
                <div className="my-content">
                    <Link to="/myStation">我的文章</Link>
                    <Link to="/myStation">我的微站</Link>
                    <Link to="/myStation">我的收藏</Link>
                </div>
            </div>
        );
    };
}

export default connect(
    mapStateToProps,
    {},
)(Me);