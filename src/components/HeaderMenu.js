import React, { Component } from "react";
import "./HeaderMenu.css";
import { withRouter } from "react-router-dom";
import { IconWithText } from "./common/Common";
import ClickOutside from "./common/ClickOutside";
import { Modal, message } from "antd";
import { HOST_NAME } from "../global";
import { connect } from "react-redux";
import { logout, changeStation, clearStoryList } from "../actions/app";
const confirm = Modal.confirm;

const mapStateToProps2 = state => ({
  user: state.auth.user,
  stationList: state.station.stationList
});

class HeadMenu extends Component {
  constructor(props) {
    super(props);
    this.showConfirm = this.showConfirm.bind(this);
  }

  showConfirm() {
    const { logout } = this.props;
    confirm({
      title: "退出",
      content: "确定要退出吗？",
      onOk() {
        logout();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  handleClick(key) {
    const { history, location, switchMenu } = this.props;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    switchMenu();
    switch (key) {
      case "account":
        history.push(`/${stationDomain}/me`);
        break;
      case "logout":
        this.showConfirm();
        break;
      case "login":
        if (window.location.pathname !== "/account/login") {
          history.push("/account/login");
        }
        break;
      case "subscribe":
        history.push(`/${stationDomain}/subscribe`);
        break;
      case "discover":
        window.open(
          `https://exp.qingtime.cn?token=${localStorage.getItem("TOKEN")}`,
          "_blank"
        );
        break;
      case "article":
        history.push(`/${stationDomain}/myArticle`);
        break;
      default:
        message.info("功能开发中，敬请期待...");
        break;
    }
  }

  handleStationClick(key, domain, url) {
    const { history, changeStation, clearLogo, switchMenu } = this.props;
    switchMenu();

    const hostName = window.location.hostname;
    // 切换站点
    if ((hostName === HOST_NAME || hostName === "localhost") && !url) {
      changeStation(key);
      history.push(`/${domain}/home`);
      if (clearLogo) clearLogo();
    } else {
      const token = localStorage.getItem("TOKEN");
      window.open(
        `${
          url
            ? `http://${url}?token=${token}`
            : `https://${HOST_NAME}/${domain}/home`
        }`,
        "_blank"
      );
    }
  }

  getRoleName(role) {
    let roleNmae;
    switch (role) {
      case 1:
        roleNmae = "站长";
        break;
      case 2:
        roleNmae = "管理员";
        break;
      case 3:
        roleNmae = "编辑";
        break;
      case 4:
        roleNmae = "作者";
        break;
      default:
        break;
    }
    return roleNmae;
  }

  getRoleColor(role) {
    let color;
    switch (role) {
      case 1:
        color = "#EB817F";
        break;
      case 2:
        color = "#68B68F";
        break;
      case 3:
        color = "#6B90EF";
        break;
      case 4:
        color = "#CEA461";
        break;
      default:
        break;
    }
    return color;
  }

  render() {
    const { user, stationList, switchMenu } = this.props;
    return (
      <div
        className="head-menu"
        style={{ maxHeight: `${document.body.offsetHeight}px` }}
      >
        <ClickOutside onClickOutside={switchMenu}>
          {user && !user.isGuest ? (
            <div className="head-menu-button">
              <IconWithText
                key={"account"}
                iconUrl="/image/icon/header/account.svg"
                title="账户"
                handleClick={this.handleClick.bind(this, "account")}
              />
              <IconWithText
                key={"wallet"}
                iconUrl="/image/icon/header/wallet.svg"
                title="钱包"
                handleClick={this.handleClick.bind(this, "wallet")}
              />
              <IconWithText
                key={"message"}
                iconUrl="/image/icon/header/message.svg"
                title="消息"
                handleClick={this.handleClick.bind(this, "message")}
              />
              <IconWithText
                key={"logout"}
                iconUrl="/image/icon/header/logout.svg"
                title="退出"
                handleClick={this.handleClick.bind(this, "logout")}
              />
              <IconWithText
                key={"subscribe"}
                iconUrl="/image/icon/header/subscribe.svg"
                title="订阅"
                handleClick={this.handleClick.bind(this, "subscribe")}
              />
              <IconWithText
                key={"article"}
                iconUrl="/image/icon/header/article.svg"
                title="文章"
                handleClick={this.handleClick.bind(this, "article")}
              />
              <IconWithText
                key={"discover"}
                iconUrl="/image/icon/header/discover.svg"
                title="探索"
                handleClick={this.handleClick.bind(this, "discover")}
              />
            </div>
          ) : (
            <div className="head-menu-login">
              <IconWithText
                key={"login"}
                iconUrl="/image/icon/header/account.svg"
                title="登录"
                handleClick={this.handleClick.bind(this, "login")}
              />
            </div>
          )}
          {user && !user.isGuest ? (
            <div className="menu-station-list">
              {stationList.map(station => (
                <div key={station._key}>
                  <span
                    className="menu-station-name"
                    onClick={this.handleStationClick.bind(
                      this,
                      station._key,
                      station.domain,
                      station.url
                    )}
                  >{`・${station.name}`}</span>
                  {station.role && station.role < 5 ? (
                    <i
                      className="menu-station-role"
                      style={{
                        backgroundColor: this.getRoleColor(station.role)
                      }}
                    >
                      {this.getRoleName(station.role)}
                    </i>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </ClickOutside>
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps2, { clearStoryList, logout, changeStation })(HeadMenu)
);
