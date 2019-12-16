import React, { Component } from "react";
import "./Station.css";
import StationBasicInfo from "../User/StationBasicInfo";
import StationGroup from "../User/StationGroup";
import SubSite from "../User/SubSite";
import { Tabs, Modal } from "antd";

import { connect } from "react-redux";
import { clearGroupMember, cloneStation } from "../../actions/app";

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
  nowStation: state.station.nowStation
});

class Station extends Component {
  render() {
    const { nowStation } = this.props;
    return (
      <div className="station">
        <h2>站点定义</h2>
        <span className="clone-station" onClick={this.handleClone.bind(this)}>
          克隆当前站
        </span>
        <Tabs defaultActiveKey="basicInfo">
          <TabPane tab="基本信息" key="basicInfo">
            {nowStation ? <StationBasicInfo stationInfo={nowStation} /> : null}
          </TabPane>
          <TabPane tab="成员" key="group">
            <StationGroup />
          </TabPane>
          <TabPane tab="子站点" key="subStation">
            <SubSite />
          </TabPane>
        </Tabs>
      </div>
    );
  }

  handleClone() {
    const { nowStation, cloneStation } = this.props;
    confirm({
      title: "克隆站点",
      content: `确定要克隆【${nowStation.name}】吗？`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        cloneStation(nowStation._key);
      }
    });
  }

  componentDidMount() {
    this.props.clearGroupMember();
  }
}

export default connect(mapStateToProps, { clearGroupMember, cloneStation })(
  Station
);
