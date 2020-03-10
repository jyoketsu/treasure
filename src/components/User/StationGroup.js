import React, { Component } from "react";
import "./StationGroup.css";
import { Input, Modal, Button, Table, Select, message } from "antd";
import { MemberCard, SearchMemberCard } from "../common/Common";
import ReadExcel from "../common/ReadExcel";
import { connect } from "react-redux";
import {
  searchUser,
  groupMember,
  addGroupMember,
  setMemberRole,
  setMemberInfo,
  transferStation,
  removeMember,
  getImportedUsers,
  importUser,
  batchDeleteUser,
  editImportedUser
} from "../../actions/app";
const confirm = Modal.confirm;
const Option = Select.Option;
const Search = Input.Search;
const mapStateToProps = state => ({
  nowStation: state.station.nowStation,
  searchUserList: state.station.searchUserList,
  userList: state.station.userList,
  importedUsers: state.station.importedUsers,
  groupKey: state.station.nowStation.intimateGroupKey
});

class StationGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      batchImportVisible: false,
      batchDeleteVisible: false,
      importData: [],
      seletedBatchId: undefined
    };
    this.importUser = this.importUser.bind(this);
    this.handleBatchDeleteUser = this.handleBatchDeleteUser.bind(this);
  }

  showDeleteConfirm(key, name) {
    const { removeMember, groupKey } = this.props;
    confirm({
      title: "移除成员",
      content: `确定要删除【${name}】吗？`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        removeMember(groupKey, [key]);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  }

  downloadSample() {
    fetch("https://baoku.qingtime.cn/站点人员批量导入模版.xlsx").then(res =>
      res.blob().then(blob => {
        let a = document.createElement("a");
        let url = window.URL.createObjectURL(blob);
        let filename = "站点人员批量导入模版";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      })
    );
  }

  importUser() {
    const { importUser, nowStation } = this.props;
    const { importData } = this.state;
    let targetUserArray = [];
    for (let index = 0; index < importData.length; index++) {
      const element = importData[index];
      targetUserArray.push({
        mobileArea: element["手机区号"],
        mobile: element["手机号"] ? element["手机号"].toString() : "",
        name: element["姓名"],
        PID: element["身份证号"],
        depart: element["工作单位"],
        position: element["角色职位"],
        from: element["籍贯"],
        role: element["角色"],
        safeCode: element["安全码"]
      });
    }
    importUser(nowStation._key, targetUserArray);
    this.setState({ batchImportVisible: false });
  }

  handleBatchDeleteUser() {
    const { nowStation, batchDeleteUser } = this.props;
    const { seletedBatchId } = this.state;
    if (!seletedBatchId) {
      return message.info("请选择批次");
    }
    batchDeleteUser(nowStation._key, seletedBatchId);
    this.setState({ batchDeleteVisible: false });
  }

  render() {
    const {
      searchUser,
      userList,
      importedUsers,
      searchUserList,
      addGroupMember,
      setMemberInfo,
      setMemberRole,
      groupKey,
      nowStation,
      transferStation,
      editImportedUser
    } = this.props;

    const {
      importData,
      batchImportVisible,
      batchDeleteVisible,
      seletedBatchId
    } = this.state;

    const roleMap = {
      1: "站长",
      2: "管理员",
      3: "编辑",
      4: "作者",
      5: "成员"
    };

    const codeMap = {
      1: "绿码",
      2: "黄码",
      3: "红码",
      4: "黑码"
    };

    const columns = [
      {
        title: "手机区号",
        dataIndex: "手机区号",
        key: "手机区号"
      },
      {
        title: "手机号",
        dataIndex: "手机号",
        key: "手机号"
      },
      {
        title: "姓名",
        dataIndex: "姓名",
        key: "姓名"
      },
      {
        title: "身份证号",
        dataIndex: "身份证号",
        key: "身份证号"
      },
      {
        title: "工作单位",
        dataIndex: "工作单位",
        key: "工作单位"
      },
      {
        title: "角色职位",
        dataIndex: "角色职位",
        key: "角色职位"
      },
      {
        title: "籍贯",
        dataIndex: "籍贯",
        key: "籍贯"
      },
      {
        title: "角色",
        dataIndex: "角色",
        key: "角色",
        render: text => roleMap[text]
      },
      {
        title: "安全码",
        dataIndex: "安全码",
        key: "安全码",
        render: text => codeMap[text]
      }
    ];

    let batchs = [];
    for (let index = 0; index < importedUsers.length; index++) {
      const element = importedUsers[index];
      const batchId = element.batchId;
      if (batchs.indexOf(batchId) === -1) {
        batchs.push(batchId);
      }
    }

    return (
      <div className="station-group">
        <h2>添加成员</h2>
        <div className="add-member-wrapper">
          <Search
            placeholder="请搜索要添加的人员"
            onSearch={value => searchUser(value)}
            style={{ width: 200 }}
          />
          <Button onClick={() => this.setState({ batchImportVisible: true })}>
            批量导入
          </Button>
        </div>
        <div className="member-search-result">
          {searchUserList.map((user, index) => {
            let inList = false;
            for (let i = 0; i < userList.length; i++) {
              if (user._key === userList[i].userId) {
                inList = true;
                break;
              }
            }
            return (
              <SearchMemberCard
                key={index}
                groupKey={groupKey}
                userKey={user._key}
                gender={user.gender}
                avatar={user.profile ? user.profile.avatar : ""}
                mobile={`${user.mobileArea} ${user.mobile}`}
                name={user.profile ? user.profile.nickName : ""}
                addGroupMember={addGroupMember}
                disable={inList}
              />
            );
          })}
        </div>
        <h2>成员列表</h2>
        <div className="member-search-result">
          {userList.map((user, index) => (
            <MemberCard
              key={index}
              nowStationKey={nowStation._key}
              groupKey={groupKey}
              userKey={user.userId}
              avatar={user.avatar ? user.avatar : ""}
              mobile={`${user.mobileArea ? user.mobileArea : ""} ${
                user.mobile ? user.mobile : ""
              }`}
              name={user && user.nickName ? user.nickName : ""}
              role={user.role}
              safeCode={user.safeCode}
              userRole={nowStation.role}
              setMemberRole={setMemberRole}
              setMemberInfo={setMemberInfo}
              transferStation={transferStation}
              handleDelete={this.showDeleteConfirm.bind(
                this,
                user.userId,
                user.nickName ? user.nickName : ""
              )}
            />
          ))}
        </div>
        {importedUsers.length ? <h2>导入成员列表</h2> : null}
        <div className="member-search-result">
          {importedUsers.length ? (
            <Button
              style={{ position: "absolute", top: "-45px", right: "0" }}
              onClick={() => this.setState({ batchDeleteVisible: true })}
            >
              删除批次
            </Button>
          ) : null}
          {importedUsers.map((user, index) => (
            <MemberCard
              key={index}
              stationKey={nowStation._key}
              type={"import"}
              nowStationKey={nowStation._key}
              mobile={`${user.mobileArea ? user.mobileArea : ""} ${
                user.mobile ? user.mobile : ""
              }`}
              name={user && user.name ? user.name : ""}
              role={user.role}
              safeCode={user.safeCode}
              userRole={nowStation.role}
              batchId={user.batchId}
              setMemberInfo={editImportedUser}
            />
          ))}
        </div>
        <Modal
          className="batch-import-member"
          title="人员批量导入"
          visible={batchImportVisible}
          width={1100}
          okText="导入"
          cancelText="取消"
          onOk={this.importUser}
          onCancel={() => this.setState({ batchImportVisible: false })}
        >
          <div className="batch-import-action">
            <span className="batch-demo" onClick={this.downloadSample}>
              模版文件下载
            </span>
            <ReadExcel
              className="ant-btn batch-import-button"
              text="上传Excel"
              handleChange={data => this.setState({ importData: data })}
            />
          </div>
          <Table
            rowKey="__rowNum__"
            columns={columns}
            dataSource={importData}
          />
        </Modal>
        <Modal
          title="批次删除"
          visible={batchDeleteVisible}
          okText="删除"
          cancelText="取消"
          onOk={this.handleBatchDeleteUser}
          onCancel={() => this.setState({ batchDeleteVisible: false })}
        >
          <Select
            placeholder="请选择要删除的批次"
            value={seletedBatchId}
            style={{ width: "180px" }}
            onChange={value => this.setState({ seletedBatchId: value })}
          >
            {batchs.map((batch, index) => (
              <Option key={index} value={batch}>
                {batch}
              </Option>
            ))}
          </Select>
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    const { groupMember, groupKey, getImportedUsers, nowStation } = this.props;
    groupMember(groupKey);
    getImportedUsers(nowStation._key);
  }
}

export default connect(mapStateToProps, {
  searchUser,
  groupMember,
  addGroupMember,
  setMemberRole,
  setMemberInfo,
  transferStation,
  removeMember,
  getImportedUsers,
  importUser,
  batchDeleteUser,
  editImportedUser
})(StationGroup);
