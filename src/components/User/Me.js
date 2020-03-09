import React, { Component } from "react";
import "./Me.css";
import Profile from "./Profile";
import { connect } from "react-redux";
import { logout } from "../../actions/app";

const mapStateToProps = state => ({
  user: state.auth.user
});

class Me extends Component {
  render() {
    const { user, logout } = this.props;
    const avatar =
      user && user.profile && user.profile.avatar
        ? `${user.profile.avatar}?imageView2/1/w/80/h/80`
        : "/image/icon/avatar.svg";
    return (
      <div className="account">
        <div
          className="user-info-card"
          style={{
            backgroundImage: user.profile.avatar
              ? `url(${user.profile.avatar}?imageView2/2/w/500)`
              : "url(/image/background/avatar-bk.png)"
          }}
        >
          <div className="user-info-card-filter"></div>
          <div
            className="user-avatar"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <div>
            {user ? (user.profile ? user.profile.nickName : user.mobile) : ""}
          </div>
          <div style={{ margin: "5px" }}>
            {user ? (user.profile ? user.profile.address : "") : ""}
          </div>
          <span
            className="user-logout"
            onClick={() => {
              logout();
              window.location.reload();
            }}
          >
            退出
          </span>
        </div>
        <div className="account-content">
          <Profile />
        </div>
      </div>
    );
  }
  componentDidMount() {
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
    const { user, history } = this.props;
    if (!user || user.isGuest) {
      history.push("/");
    }
  }
}

export default connect(mapStateToProps, { logout })(Me);
