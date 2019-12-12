import React, { Component } from "react";
import "./Portal.css";
import { Route } from "react-router-dom";
import Header from "./PortalHeader";
import Catalog from "./PortalCatalog";
import Detail from "./PortalDetail";
import AddButton from "../../AddArticleButton";
import util from "../../../services/Util";
import { connect } from "react-redux";
const mapStateToProps = state => ({
  nowStation: state.station.nowStation
});

class Portal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      winHeight: window.innerHeight
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
        ? util.operation.isPortalDetail(window.location.pathname)
          ? `url(${nowStation.config.customBk.three.url})`
          : `url(${nowStation.config.customBk.one.url})`
        : null;
    // 自定义背景是否重复
    const noRepeat =
      customBk &&
      (util.operation.isPortalDetail(window.location.pathname)
        ? nowStation.config.customBk.three.type === 1
        : nowStation.config.customBk.one.type === 1);
    const customFootBk =
      nowStation &&
      nowStation.config &&
      nowStation.config.customBk &&
      nowStation.config.customBk.two
        ? `url(${nowStation.config.customBk.two.url})`
        : null;
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
          backgroundSize: noRepeat ? "100%" : "unset"
        }}
      >
        <Header />
        <div
          className="portal-home-body"
          style={{
            backgroundImage: pathname.split("/")[3]
              ? "unset"
              : `url(${nowStation ? nowStation.cover : ""})`
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
        {
          <div className="operation-panel">
            <AddButton />
          </div>
        }
        <PortalFooter name={nowStation ? nowStation.name : ""} />
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }
}

class PortalFooter extends Component {
  render() {
    // const { name } = this.props;
    return (
      <div className="portal-foot">
        <span>版权所有@2013-2019 qingtime，Inc 。保留所有权利。</span>
        <span>hello@qingtime.com</span>
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(Portal);
