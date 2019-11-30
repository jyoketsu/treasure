import React, { Component } from "react";
import "./Portal.css";
import { Route } from "react-router-dom";
import Catalog from "./PortalCatalog";
import Detail from "./PortalDetail";
import AddButton from "../AddArticleButton";
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
    return (
      <div className="portal-home" style={{ minHeight: `${winHeight}px` }}>
        <div
          className="portal-home-body"
          style={{
            minHeight: `${winHeight - 233 - 50}px`,
            backgroundImage: pathname.split("/")[2]
              ? "unset"
              : `url(${nowStation ? nowStation.cover : ""})`
          }}
        >
          <Route path={`${match.path}/catalog/:id`} component={Catalog}></Route>
          <Route path={`${match.path}/detail/:id`} component={Detail}></Route>
          <div className="portal-home-footer"></div>
        </div>
        {
          // pathname.indexOf('/catalog/') !== -1 ?
          //     <div className="operation-panel">
          //         <AddButton />
          //     </div> : null
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
