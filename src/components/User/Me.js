import React, { Component } from "react";
import "./Me.css";
import Profile from "./Profile";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  user: state.auth.user
});

class Me extends Component {
  render() {
    const { user } = this.props;
    const avatar =
      user && user.profile && user.profile.avatar
        ? `${user.profile.avatar}?imageView2/1/w/80/h/80`
        : "/image/icon/avatar.svg";
    return (
      <div className="account">
        <div className="user-info-card">
          <div
            className="user-avatar"
            style={{ backgroundImage: `url(${avatar})` }}
          ></div>
          <div>
            {user ? (user.profile ? user.profile.nickName : user.mobile) : ""}
          </div>
          <div>{user ? (user.profile ? user.profile.address : "") : ""}</div>
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

export default connect(mapStateToProps, {})(Me);
