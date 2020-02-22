import React, { Component } from "react";
import "./LoginTip.css";
import util from "../../services/Util";
import { Button } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
const mapStateToProps = state => ({
  nowStation: state.station.nowStation
});

class LoginTip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: null
    };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    const { nowStation } = this.props;
    const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
    const logo = nowStation.logo;
    window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
  }

  render() {
    const { nowStation, location } = this.props;
    const { logoSize } = this.state;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    const isWebView = util.common.getSearchParamValue(
      location.search,
      "web-view"
    );
    return (
      <div
        className="login-tip"
        style={{ display: isWebView ? "none" : "flex" }}
      >
        {logoSize ? (
          <i
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
          </i>
        ) : null}
        {/* <span>{nowStation ? nowStation.name : ''}</span> */}
        <Link to={`/${stationDomain}`}>
          {nowStation ? nowStation.name : ""}
        </Link>
        <Button type="primary" onClick={this.handleLogin}>
          登录
        </Button>
      </div>
    );
  }

  async componentDidMount() {
    const { nowStation } = this.props;
    if (!this.state.logoSize && nowStation) {
      let size = await util.common.getImageInfo(nowStation.logo);
      this.setState({
        logoSize: size
      });
    }
  }

  async componentDidUpdate() {
    const { nowStation } = this.props;
    if (!this.state.logoSize && nowStation) {
      let size = await util.common.getImageInfo(nowStation.logo);
      this.setState({
        logoSize: size
      });
    }
  }
}

export default withRouter(connect(mapStateToProps, {})(LoginTip));
