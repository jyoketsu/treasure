import React, { Component } from "react";
import "./PortalHeader.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { withRouter } from "react-router-dom";
import util from "../../services/Util";
import TopMenu from "../HeaderMenu";
import SubscribeMenu from "../HeaderSubscribe";
import { connect } from "react-redux";
import {
  getUserInfo,
  logout,
  changeStation,
  getStationList,
  clearStoryList,
  getStationDetail,
  getStoryList
} from "../../actions/app";
import { HOST_NAME } from "../../global";

const mapStateToProps = state => ({
  user: state.auth.user,
  stationList: state.station.stationList,
  nowStationKey: state.station.nowStationKey,
  nowStation: state.station.nowStation,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder
});

class PortalHeader extends Component {
  constructor(props) {
    super(props);
    this.clearLogo = this.clearLogo.bind(this);
    this.switchMenu = this.switchMenu.bind(this);
    this.switchSubscribe = this.switchSubscribe.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.changeStation = this.changeStation.bind(this);
    this.setFlag = this.setFlag.bind(this);
    this.state = {
      logoSize: null,
      showMenu: false,
      showSubscribe: false
    };
    this.perPage = 32;
  }

  clearLogo() {
    this.setState({ logoSize: null });
  }

  switchMenu() {
    this.setState(prevState => ({ showMenu: !prevState.showMenu }));
  }

  switchSubscribe() {
    this.setState(prevState => ({ showSubscribe: !prevState.showSubscribe }));
  }

  handleClick(channelKey) {
    const { location, history } = this.props;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    history.push(`/${stationDomain}/catalog/${channelKey}`);
  }

  changeStation(key, domain) {
    this.changed = true;
    this.props.changeStation(key, domain);
  }

  setFlag() {
    this.changed = true;
  }

  render() {
    const { location, nowStation, user, history } = this.props;
    const { logoSize, showMenu, showSubscribe } = this.state;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    const channelList = nowStation ? nowStation.seriesInfo : [];

    return (
      <div
        className="app-menu-container"
        style={{
          display:
            pathname === "/account/login" ||
            pathname === "/account/register" ||
            pathname === "/account/reset" ||
            pathname.indexOf("/stationOptions") !== -1 ||
            pathname.indexOf("/me") !== -1 ||
            pathname.indexOf("/subscribe") !== -1 ||
            pathname.indexOf("/myArticle") !== -1 ||
            pathname.indexOf("/editStory") !== -1 ||
            pathname.indexOf("/editArticle") !== -1
              ? "none"
              : user && user.isGuest && util.common.isMobile()
              ? "none"
              : "flex"
        }}
      >
        <ul className="app-menu portal-menu" ref={elem => (this.nv = elem)}>
          {channelList.map((channel, index) => (
            <Channel
              key={index}
              name={channel.name}
              icon={channel.logo}
              onClick={() => this.handleClick(channel._key)}
            />
          ))}
          <li className="menu-space"></li>
          <div className="portal-head-right">
            <div className="portal-head-buttons">
              {user && !user.isGuest ? (
                <li
                  className={`head-icon portal-subscribe ${
                    pathname === "/message" ? "active" : ""
                  }`}
                  onClick={this.switchSubscribe}
                ></li>
              ) : null}
              {user &&
              !user.isGuest &&
              nowStation &&
              nowStation.role &&
              nowStation.role <= 3 ? (
                <li
                  className={`head-icon portal-station-option-icon ${
                    pathname === "/message" ? "active" : ""
                  }`}
                  onClick={() =>
                    this.props.history.push(`/${stationDomain}/stationOptions`)
                  }
                ></li>
              ) : null}
              <li
                className={`head-icon me portal-me ${
                  pathname === "/me" ? "active" : ""
                }`}
                style={{
                  backgroundImage:
                    user && user.profile && user.profile.avatar
                      ? `url(${user.profile.avatar})`
                      : "/image/icon/me.svg",
                  borderRadius:
                    user && user.profile && user.profile.avatar
                      ? "25px"
                      : "unset"
                }}
                onClick={this.switchMenu}
              ></li>
            </div>
            <div className="portal-head-logo">
              {logoSize ? (
                <li
                  className={`menu-logo`}
                  style={{
                    backgroundImage: `url(${
                      nowStation && nowStation.logo !== null
                        ? nowStation.logo
                        : "/image/background/logo.svg"
                    })`,
                    width: `${Math.ceil(
                      55 * (logoSize.width / logoSize.height)
                    )}px`
                  }}
                  onClick={() => history.push(`/${stationDomain}`)}
                ></li>
              ) : (
                <li
                  className={`menu-logo`}
                  style={{
                    backgroundImage: `url(/image/background/logo.svg)`,
                    width: "35px"
                  }}
                  onClick={() => history.push(`/${stationDomain}`)}
                ></li>
              )}
            </div>
          </div>
        </ul>
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

    const {
      nowStation,
      history,
      getUserInfo,
      location,
      getStationList,
      changeStation
    } = this.props;
    const SEARCH_STR = location.search;
    let token = null;
    let query_token = null;
    if (SEARCH_STR) {
      query_token = util.common.getSearchParamValue(location.search, "token");
    }
    token = query_token ? query_token : window.localStorage.getItem("TOKEN");
    // 获取用户信息
    getUserInfo(token, history);
    getStationList();
    // 获取logo大小
    if (nowStation) {
      let size = await util.common.getImageInfo(nowStation.logo);
      this.setState({
        logoSize: size
      });
    }

    // 监听路由变化
    const that = this;
    this.props.history.listen((route, action) => {
      if (route.pathname === "/account/login") {
        that.gettedList = false;
        that.changed = false;
      }

      // 点击了浏览器前进，后退按钮
      if (action === "POP") {
        const nowDomain =
          window.location.hostname === HOST_NAME
            ? route.pathname.split("/")[1]
            : sessionStorage.getItem("DOMAIN");
        const prevDomain = sessionStorage.getItem("DOMAIN");
        if (nowDomain !== prevDomain) {
          console.log("换站了");
          changeStation(null, nowDomain);
        }
      }
    });
  }

  async componentDidUpdate(prevProps) {
    const {
      user,
      history,
      stationList,
      nowStationKey,
      nowStation,
      getStationList,
      getStationDetail,
      getStoryList,
      clearStoryList,
      sortType,
      sortOrder
    } = this.props;
    const { nowStation: prevStation } = prevProps;

    // 显示初始微站
    util.operation.initStation(
      user,
      stationList,
      nowStationKey,
      this.changed,
      history,
      this.changeStation,
      this.setFlag
    );

    //  用户登录后获取站点列表
    if (
      ((prevProps.user && prevProps.user.isGuest) || !prevProps.user) &&
      user &&
      !user.isGuest &&
      stationList.length === 0 &&
      !this.gettedList
    ) {
      this.gettedList = true;
      getStationList();
    }

    // 切换微站时重新获取故事
    if (
      nowStationKey !== prevProps.nowStationKey ||
      (prevProps.user && prevProps.user.isGuest && !user.isGuest)
    ) {
      clearStoryList();
      if (nowStationKey !== "notFound") {
        getStationDetail(nowStationKey);
      } else {
        history.push("/station/notFound");
      }
    }

    if (
      (nowStation &&
        ((prevStation && nowStation._key !== prevStation._key) ||
          !prevStation)) ||
      (nowStation && prevProps.user && prevProps.user.isGuest && !user.isGuest)
    ) {
      this.curPage = 1;
      getStoryList(
        1,
        nowStationKey,
        null,
        nowStation.showAll ? "allSeries" : nowStation.seriesInfo[0]._key,
        sortType,
        sortOrder,
        "",
        "",
        1,
        this.perPage
      );
      sessionStorage.setItem("home-curpage", this.curPage);
    }

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

class Channel extends Component {
  render() {
    const { name, icon, onClick } = this.props;
    return (
      <div className="portal-channel" onClick={onClick}>
        <i style={{ backgroundImage: `url(${icon})` }}></i>
        <span>{name}</span>
      </div>
    );
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    {
      getUserInfo,
      logout,
      changeStation,
      getStationList,
      clearStoryList,
      getStationDetail,
      getStoryList
    }
  )(PortalHeader)
);
