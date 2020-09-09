import React, { Component } from "react";
import "./Portal.css";
import { Route } from "react-router-dom";
import Header from "./PortalHeader";
import Catalog from "./PortalCatalog";
import Detail from "./PortalDetail";
import util from "../../../services/Util";
import { connect } from "react-redux";
const mapStateToProps = (state) => ({
  nowStation: state.station.nowStation,
});

class Portal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winHeight: window.innerHeight,
    };
    this.handleResize = this.handleResize.bind(this);
  }

  handleResize() {
    this.setState({ winHeight: window.innerHeight });
  }

  render() {
    const { match, location, nowStation } = this.props;
    const { winHeight } = this.state;
    const pathname = location.pathname;
    // 自定义背景
    const customBk =
      nowStation &&
      nowStation.config &&
      nowStation.config.customBk &&
      nowStation.config.customBk.one
        ? util.operation.isPortalDetail(window.location.pathname) &&
          nowStation.config.customBk.three
          ? `url(${nowStation.config.customBk.three.url})`
          : `url(${nowStation.config.customBk.one.url})`
        : null;
    // 自定义背景是否重复
    const noRepeat =
      customBk &&
      (util.operation.isPortalDetail(window.location.pathname) &&
      nowStation.config.customBk.three
        ? nowStation.config.customBk.three.type === 1
        : nowStation.config.customBk.one.type === 1);
    const customFootBk =
      nowStation &&
      nowStation.config &&
      nowStation.config.customBk &&
      nowStation.config.customBk.two
        ? `url(${nowStation.config.customBk.two.url})`
        : null;
    // 封面
    const cover = nowStation.cover
      ? nowStation.cover
      : nowStation.covers && nowStation.covers.length
      ? nowStation.covers[0].url
      : "";
    return (
      <div
        className="portal-home"
        style={{
          minHeight: `${winHeight}px`,
          background:
            nowStation && nowStation.style === 2
              ? customBk
                ? customBk
                : `url(/image/background/bg.jpg)`
              : "#434343",
          backgroundRepeat:
            nowStation && nowStation.style === 2
              ? noRepeat
                ? "no-repeat"
                : "repeat-x"
              : "unset",
          backgroundSize: noRepeat ? "cover" : "unset",
        }}
      >
        <Header />
        <div
          className="portal-home-body"
          style={{
            backgroundImage: pathname.split("/")[3] ? "unset" : `url(${cover})`,
          }}
        >
          <Route path={`${match.path}/catalog/:id`} component={Catalog}></Route>
          <Route path={`${match.path}/detail/:id`} component={Detail}></Route>
          {!util.operation.hidePortalHeader(pathname) ? (
            <div
              className="portal-home-footer"
              style={{ backgroundImage: customFootBk ? customFootBk : "unset" }}
            ></div>
          ) : null}
        </div>
        <PortalFooter
          name={nowStation ? nowStation.name : ""}
          recordNumber={nowStation ? nowStation.recordNumber : ""}
        />
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    const { nowStation } = this.props;
    // 微信分享
    const shareInfo = util.operation.getShareInfo(nowStation, null, null);
    if (shareInfo) {
      util.operation.initWechat(
        shareInfo.url,
        shareInfo.title,
        shareInfo.desc,
        shareInfo.imgUrl
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
}

class PortalFooter extends Component {
  render() {
    const { recordNumber } = this.props;
    return (
      <div className="portal-foot">
        <span>
          <a
            href="http://beian.miit.gov.cn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {recordNumber ? recordNumber : "苏ICP备15006448号"}
          </a>
        </span>
        <span>技术支持 时光科技</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(Portal);
