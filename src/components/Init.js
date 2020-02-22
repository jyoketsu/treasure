import React, { Component } from "react";
import util from "../services/Util";
import { HOST_NAME } from "../global";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import {
  getUserInfo,
  changeStation,
  getStationList,
  clearStoryList,
  getStationDetail
} from "../actions/app";

const mapStateToProps = state => ({
  loading: state.common.loading,
  user: state.auth.user,
  stationList: state.station.stationList,
  nowStationKey: state.station.nowStationKey,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder,
  nowStation: state.station.nowStation
});

class Init extends Component {
  constructor(props) {
    super(props);
    this.changeStation = this.changeStation.bind(this);
    this.setFlag = this.setFlag.bind(this);
  }

  render() {
    return <div></div>;
  }

  changeStation(key, domain) {
    this.changed = true;
    this.props.changeStation(key, domain);
  }

  setFlag() {
    this.changed = true;
  }

  componentDidMount() {
    const { user, getUserInfo, changeStation } = this.props;
    // 监听窗口变化
    window.addEventListener("resize", this.handleResize);
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
            : localStorage.getItem("DOMAIN");
        const prevDomain = localStorage.getItem("DOMAIN");
        console.log("点击了浏览器前进，后退按钮", nowDomain, prevDomain);
        if (nowDomain !== prevDomain) {
          console.log("换站了");
          changeStation(null, nowDomain);
        }
      }
    });

    let token = window.localStorage.getItem("TOKEN");
    // 获取用户信息
    if (!user) {
      getUserInfo(token);
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      history,
      user,
      stationList,
      nowStationKey,
      nowStation,
      getStationList,
      getStationDetail,
      clearStoryList
    } = this.props;

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

    // 切换微站
    if (
      (nowStationKey && nowStationKey !== prevProps.nowStationKey) ||
      (prevProps.user && prevProps.user.isGuest && !user.isGuest)
    ) {
      clearStoryList();
      if (nowStationKey && nowStationKey !== "notFound") {
        getStationDetail(nowStationKey);
      }
    }
    const prevStationKey = prevProps.nowStation
      ? prevProps.nowStation._key
      : "";
    if (nowStation && nowStation._key !== prevStationKey) {
      document.title = nowStation.name ? nowStation.name : "时光宝库";
      localStorage.setItem("DOMAIN", nowStation.domain);
    }
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getUserInfo,
    changeStation,
    getStationList,
    clearStoryList,
    getStationDetail
  })(Init)
);
