import React, { Component } from "react";
import "./Header.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Link, withRouter } from "react-router-dom";
import { Modal, Button } from "antd";
// import TextMarquee from './common/TextMarquee';
import util from "../services/Util";
import TopMenu from "./HeaderMenu";
import SubscribeMenu from "./HeaderSubscribe";
import QRCode from "qrcode.react";
import { connect } from "react-redux";
import { changeStation } from "../actions/app";

const mapStateToProps = state => ({
  user: state.auth.user,
  nowStation: state.station.nowStation
});

class Header extends Component {
  constructor(props) {
    super(props);
    this.clearLogo = this.clearLogo.bind(this);
    this.switchMenu = this.switchMenu.bind(this);
    this.switchSubscribe = this.switchSubscribe.bind(this);
    this.changeStation = this.changeStation.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.state = {
      logoSize: null,
      showMenu: false,
      showSubscribe: false,
      showQrCode: false
    };
    this.perPage = 32;
  }

  clearLogo() {
    this.setState({ logoSize: null });
  }

  switchMenu() {
    const { user, nowStation } = this.props;
    const { showMenu } = this.state;

    if (showMenu) {
      document.body.style.position = "";
    } else {
      document.body.style.position = "fixed";
    }

    if (user && !user.isGuest) {
      this.setState(prevState => {
        return { showMenu: !prevState.showMenu };
      });
    } else {
      const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
      const logo = nowStation.logo;
      window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
    }
  }

  switchSubscribe() {
    this.setState(prevState => ({ showSubscribe: !prevState.showSubscribe }));
  }

  changeStation(key, domain) {
    this.changed = true;
    this.props.changeStation(key, domain);
  }

  setFlag() {
    this.changed = true;
  }

  downloadQRCode() {
    const Qr = document.getElementById("qrid");
    let image = new Image();
    image.src = Qr.toDataURL("image/png");
    var a_link = document.getElementById("aId");
    a_link.href = image.src;
    a_link.click();
  }

  render() {
    const { location, nowStation, user } = this.props;
    const { logoSize, showMenu, showSubscribe, showQrCode } = this.state;
    const pathname = location.pathname;
    const stationDomain = nowStation ? nowStation.domain : "";
    const isMobile = util.common.isMobile();

    return (
      <div
        className="app-menu-container"
        style={{
          display:
            pathname === "/account/login" ||
            pathname === "/account/register" ||
            pathname === "/account/reset"
              ? "none"
              : "flex"
        }}
      >
        <ul className="app-menu" ref={elem => (this.nv = elem)}>
          {logoSize ? (
            <li
              className={`menu-logo`}
              style={{
                backgroundImage: `url(${
                  nowStation && nowStation.logo !== null
                    ? nowStation.logo
                    : "/image/background/logo.svg"
                })`,
                width: `${Math.ceil(35 * (logoSize.width / logoSize.height))}px`
              }}
            >
              <Link to={`/${stationDomain}/home`}></Link>
            </li>
          ) : (
            <li
              className={`menu-logo`}
              style={{
                backgroundImage: `url(/image/background/logo.svg)`,
                width: "35px"
              }}
            >
              <Link to={`/${stationDomain}/home`}></Link>
            </li>
          )}
          {!isMobile ? (
            <li className="head-station-name">
              <Link to={`/${stationDomain}/home`}>
                {nowStation ? nowStation.name : ""}
              </Link>
            </li>
          ) : null}
          <li className="menu-space"></li>
          {user && !user.isGuest ? (
            <li
              className={`head-icon subscribe ${
                pathname === "/message" ? "active" : ""
              }`}
              onClick={this.switchSubscribe}
            ></li>
          ) : null}
          <li
            className={`head-icon qrCode`}
            onClick={() => this.setState({ showQrCode: true })}
          ></li>
          {user &&
          !user.isGuest &&
          nowStation &&
          nowStation.role &&
          nowStation.role <= 3 ? (
            <li
              className={`head-icon station-option-icon ${
                pathname === "/message" ? "active" : ""
              }`}
            >
              <Link to={`/${stationDomain}/stationOptions`}></Link>
            </li>
          ) : null}
          <li
            className={`head-icon me ${pathname === "/me" ? "active" : ""}`}
            style={{
              backgroundImage:
                user && !user.isGuest && user.profile && user.profile.avatar
                  ? `url(${user.profile.avatar})`
                  : "/image/icon/me.svg",
              borderRadius:
                user && user.profile && user.profile.avatar ? "25px" : "unset",
              width:
                user && user.profile && user.profile.avatar ? "50px" : "24px",
              height:
                user && user.profile && user.profile.avatar ? "50px" : "24px"
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
        <ReactCSSTransitionGroup
          transitionName="myFade"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {showMenu ? (
            <TopMenu clearLogo={this.clearLogo} switchMenu={this.switchMenu} />
          ) : null}
          {showSubscribe ? (
            <SubscribeMenu switchSubscribe={this.switchSubscribe} />
          ) : null}
        </ReactCSSTransitionGroup>
        <Modal
          title={nowStation.name}
          visible={showQrCode}
          footer={null}
          onCancel={() => this.setState({ showQrCode: false })}
        >
          <div className="qrcode-wrapper">
            <a download id="aId" href="result.png" style={{ display: "none" }}>
              test
            </a>
            <QRCode
              id="qrid"
              value={`https://baoku.qingtime.cn/${nowStation.domain}/home?signin=${nowStation._key}`}
            />
            {!util.common.isMobile() ? (
              <Button
                type="primary"
                style={{ margin: "15px" }}
                onClick={this.downloadQRCode}
              >
                下载二维码
              </Button>
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    this.nv.addEventListener(
      "touchmove",
      function(e) {
        //阻止默认的处理方式(阻止下拉滑动的效果)
        e.preventDefault();
      },
      { passive: false }
    ); //passive 参数不能省略，用来兼容ios和android

    const { nowStation } = this.props;
    // 获取logo大小
    if (nowStation) {
      let size = await util.common.getImageInfo(nowStation.logo);
      this.setState({
        logoSize: size
      });
    }
  }

  async componentDidUpdate(prevProps) {
    const { nowStation } = this.props;
    const { nowStation: prevStation } = prevProps;

    // 切换了微站后，获取logo大小
    if (
      (nowStation &&
        prevStation &&
        nowStation._key !== prevStation._key &&
        nowStation.logo) ||
      (nowStation && !prevStation && nowStation.logo)
    ) {
      // 获取logo大小
      let size = await util.common.getImageInfo(nowStation.logo);
      this.setState({
        logoSize: size
      });
    }
  }
}

export default withRouter(
  connect(mapStateToProps, {
    changeStation
  })(Header)
);
