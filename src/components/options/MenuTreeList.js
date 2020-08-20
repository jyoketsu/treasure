import React, { Component } from "react";
import "./Channel.css";
import { connect } from "react-redux";
import { Table, Divider, Modal, Button, Select, message } from "antd";
import {
  deleteChannel,
  sortChannel,
  addMenuTree,
  delMenuTree,
} from "../../actions/app";
const { Column } = Table;
const { Option } = Select;
const confirm = Modal.confirm;

const mapStateToProps = (state) => ({
  nowStationKey: state.station.nowStationKey,
  nowStation: state.station.nowStation,
});

class MenuTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      seriesKey: "",
    };
    this.switchModalVisible = this.switchModalVisible.bind(this);
    this.handleClickAdd = this.handleClickAdd.bind(this);
  }

  showDeleteConfirm(key, name, rootKey) {
    const { delMenuTree } = this.props;
    confirm({
      title: "删除目录",
      content: `确定要删除频道【${name}】中的目录吗？`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        delMenuTree(key, rootKey);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  handleEdit(key) {
    const { history } = this.props;
    history.push({
      pathname: "menutree",
      search: `?key=${key}`,
    });
  }

  handleClickAdd() {
    const { seriesKey } = this.state;
    const { nowStation, addMenuTree } = this.props;
    const seriesInfo = nowStation ? nowStation.seriesInfo : [];
    const index = seriesInfo.findIndex((item) => item._key === seriesKey);
    if (index !== -1) {
      const series = seriesInfo[index];
      if (series.seriesTreeRootNode) {
        message.info("该频道下已有目录，不能重复添加！");
      } else {
        addMenuTree(seriesKey);
        this.switchModalVisible();
      }
    }
  }

  switchModalVisible() {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  }

  render() {
    const { visible, seriesKey } = this.state;
    const { nowStation } = this.props;
    const seriesInfo = nowStation ? nowStation.seriesInfo : [];
    const result = seriesInfo.filter((item) => item.seriesTreeRootNode);
    return (
      <div className="channel-option">
        <div className="channel-head">
          <span>目录管理</span>
          <Button
            type="primary"
            className="login-form-button"
            onClick={this.switchModalVisible}
          >
            新增目录
          </Button>
        </div>
        <Table dataSource={result} rowKey="_key" pagination={false}>
          <Column title="目录所在频道" dataIndex="name" />
          <Column
            title="操作"
            render={(text, record) => (
              <span className="tabel-actions">
                <span onClick={this.handleEdit.bind(this, record._key)}>
                  编辑
                </span>
                <Divider type="vertical" />
                <span
                  onClick={this.showDeleteConfirm.bind(
                    this,
                    record._key,
                    record.name,
                    record.seriesTreeRootNode
                  )}
                >
                  删除
                </span>
              </span>
            )}
          />
        </Table>
        <Modal
          title="请选择频道"
          visible={visible}
          okText="添加"
          cancelText="取消"
          onOk={this.handleClickAdd}
          onCancel={this.switchModalVisible}
        >
          <Select
            value={seriesKey}
            onChange={(value) => this.setState({ seriesKey: value })}
            style={{ width: "100%" }}
          >
            {seriesInfo.map((item) => (
              <Option key={item._key} value={item._key}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    const { nowStation, history } = this.props;
    if (!nowStation) {
      history.push(`/${window.location.search}`);
    }
  }
}

export default connect(mapStateToProps, {
  deleteChannel,
  sortChannel,
  addMenuTree,
  delMenuTree,
})(MenuTree);
