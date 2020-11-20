import React, { Component } from "react";
import "./PortalHeader.css";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { withRouter } from "react-router-dom";
import util from "../../../services/Util";
import TopMenu from "../../HeaderMenu";
import SubscribeMenu from "../../HeaderSubscribe";
import Header from "../../Header";
import { connect } from "react-redux";
import {
  setChannelKey,
  setStoryList,
  asyncStart,
  asyncEnd,
} from "../../../actions/app";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  stationList: state.station.stationList,
  nowStationKey: state.station.nowStationKey,
  nowStation: state.station.nowStation,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder,
});

class PortalHeader extends Component {
  constructor(props) {
    super(props);
    this.clearLogo = this.clearLogo.bind(this);
    this.switchMenu = this.switchMenu.bind(this);
    this.switchSubscribe = this.switchSubscribe.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      logoSize: null,
      showMenu: false,
      showSubscribe: false,
    };
    this.perPage = 32;
  }

  clearLogo() {
    this.setState({ logoSize: null });
  }

  switchMenu() {
    const { user, nowStation } = this.props;
    if (user && !user.isGuest) {
      this.setState((prevState) => ({ showMenu: !prevState.showMenu }));
    } else {
      const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
      const logo = nowStation.logo;
      window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
    }
  }

  switchSubscribe() {
    this.setState((prevState) => ({ showSubscribe: !prevState.showSubscribe }));
  }

  handleClick(channelKey) {
    const { location, history, setChannelKey } = this.props;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    history.push(`/${stationDomain}/home/catalog/${channelKey}`);
    setChannelKey(channelKey);
  }

  render() {
    const {
      location,
      nowStation,
      user,
      history,
      setStoryList,
      asyncStart,
      asyncEnd,
    } = this.props;
    const { logoSize, showMenu, showSubscribe } = this.state;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    const channelList = nowStation ? nowStation.seriesInfo : [];
    const isPortaDetail = util.operation.isPortalDetail(
      window.location.pathname
    );

    return !window.location.pathname.includes("stationOptions") ? (
      <div
        className="app-menu-container"
        style={{
          display: util.operation.hidePortalHeader(pathname) ? "none" : "flex",
        }}
      >
        <ul className="app-menu portal-menu" ref={(elem) => (this.nv = elem)}>
          <div className="portal-head-left">
            {channelList.map((channel, index) => (
              <Channel
                key={index}
                user={user}
                nowStation={nowStation}
                channelKey={channel._key}
                name={channel.name}
                icon={channel.logo}
                tag={channel.tag}
                location={location}
                history={history}
                setStoryList={setStoryList}
                asyncStart={asyncStart}
                asyncEnd={asyncEnd}
                onClick={() => this.handleClick(channel._key)}
              />
            ))}
          </div>
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
                      : "unset",
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
                        ? isPortaDetail
                          ? nowStation.logo2 || nowStation.logo
                          : nowStation.logo
                        : "/image/background/logo.svg"
                    })`,
                    width: `${Math.ceil(
                      55 * (logoSize.width / logoSize.height)
                    )}px`,
                  }}
                  onClick={() => history.push(`/${stationDomain}/home`)}
                ></li>
              ) : (
                <li
                  className={`menu-logo`}
                  style={{
                    backgroundImage: `url(/image/background/logo.svg)`,
                    width: "35px",
                  }}
                  onClick={() => history.push(`/${stationDomain}/home`)}
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
    ) : (
      <Header />
    );
  }

  async componentDidMount() {
    this.nv.addEventListener(
      "touchmove",
      function (e) {
        //阻止默认的处理方式(阻止下拉滑动的效果)
        e.preventDefault();
      },
      { passive: false }
    ); //passive 参数不能省略，用来兼容ios和android

    const { nowStation } = this.props;

    // 获取logo大小
    if (nowStation) {
      const isPortaDetail = util.operation.isPortalDetail(
        window.location.pathname
      );
      let size = await util.common.getImageInfo(
        isPortaDetail ? nowStation.logo2 || nowStation.logo : nowStation.logo
      );
      this.setState({
        logoSize: size,
      });
    }
    // 监听路由变化，更新logo大小（PS：按道理不能这么做，即使logo不变也更新了logo大小，但是时间有限，不管啦）
    this.props.history.listen(async (route, action) => {
      const isPortaDetail = util.operation.isPortalDetail(
        window.location.pathname
      );
      let size = await util.common.getImageInfo(
        isPortaDetail ? nowStation.logo2 || nowStation.logo : nowStation.logo
      );
      this.setState({
        logoSize: size,
      });
    });
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
      const isPortaDetail = util.operation.isPortalDetail(
        window.location.pathname
      );
      let size = await util.common.getImageInfo(
        isPortaDetail ? nowStation.logo2 || nowStation.logo : nowStation.logo
      );
      this.setState({
        logoSize: size,
      });
    }
  }
}

class Channel extends Component {
  render() {
    const { channelKey, name, icon, tag, onClick } = this.props;
    let tagList = tag ? tag.split(" ") : [];

    return (
      <div className="portal-channel">
        <i style={{ backgroundImage: `url(${icon})` }} onClick={onClick}></i>
        <span
          style={{
            color: util.operation.isPortalDetail(window.location.pathname)
              ? "#24374A"
              : "#FFFFFF",
          }}
          onClick={onClick}
        >
          {name}
        </span>
        <div
          className="portal-channel-list"
          style={{
            color: util.operation.isPortalDetail(window.location.pathname)
              ? "#24374A"
              : "#FFFFFF",
          }}
        >
          {tagList.map((catalog, index) => {
            let obj;
            if (util.common.isJSON(catalog)) {
              obj = JSON.parse(catalog);
            } else {
              obj = { id: catalog, name: catalog };
            }
            return (
              <div
                key={index}
                onClick={this.handleClick.bind(this, obj, channelKey)}
              >
                {obj.name}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  async handleClick(tag, channelKey) {
    const {
      user,
      history,
      nowStation,
      asyncStart,
      asyncEnd,
      setStoryList,
    } = this.props;
    asyncStart();
    const result = await util.operation.handleClickTag(
      nowStation._key,
      nowStation.domain,
      channelKey,
      tag.id,
      user
    );
    asyncEnd();
    if (result) {
      setStoryList(result.result, result.totalNumber, tag.id, "");
      history.push({
        pathname: `/${nowStation.domain}/home/detail/${channelKey}`,
        state: { tagId: tag.id, tagName: tag.name },
      });
    }
  }
}

export default withRouter(
  connect(mapStateToProps, {
    setChannelKey,
    setStoryList,
    asyncStart,
    asyncEnd,
  })(PortalHeader)
);
