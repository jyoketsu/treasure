import React, { Component } from "react";
import "./Common.css";
import util from "../../services/Util";
import { Select, Modal } from "antd";
const { Option } = Select;
const confirm = Modal.confirm;

class MemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = { role: props.role, safeCode: props.safeCode };
    this.handleChange = this.handleChange.bind(this);
    this.showConfirm = this.showConfirm.bind(this);
    this.handleChangeSafeCode = this.handleChangeSafeCode.bind(this);
    this.improveMember = this.improveMember.bind(this);
  }

  showConfirm() {
    const { transferStation, nowStationKey, userKey } = this.props;
    confirm({
      title: "移交",
      content:
        "每个站点只有一名站长，确认后您将降级为管理员。（对方确认后生效）",
      onOk() {
        transferStation(nowStationKey, userKey);
      }
    });
  }

  handleChange(value) {
    const {
      stationKey,
      type,
      mobile,
      userKey,
      safeCode,
      groupKey,
      setMemberRole,
      setMemberInfo
    } = this.props;
    if (type === "import") {
      let bango = mobile ? mobile.split(" ") : ["", ""];
      setMemberInfo(stationKey, bango[0], bango[1], value, safeCode);
    } else {
      if (value === 1) {
        this.showConfirm();
        return;
      }
      setMemberRole(groupKey, userKey, value);
    }
    this.setState({
      role: value
    });
  }

  handleChangeSafeCode(value) {
    const {
      stationKey,
      type,
      role,
      mobile,
      userKey,
      groupKey,
      setMemberInfo
    } = this.props;
    if (type === "import") {
      let bango = mobile ? mobile.split(" ") : ["", ""];
      setMemberInfo(stationKey, bango[0], bango[1], role, value);
    } else {
      setMemberInfo(groupKey, userKey, { safeCode: value });
    }
    this.setState({
      safeCode: value
    });
  }

  improveMember(e) {
    e.stopPropagation();
    const { userKey, siteGroupKey, addGroupMember } = this.props;
    addGroupMember(
      siteGroupKey,
      [
        {
          userKey: userKey,
          role: 5
        }
      ],
      true
    );
    this.setState({
      role: 5
    });
  }

  render() {
    const {
      type,
      avatar,
      name,
      mobile,
      userRole,
      disabled,
      handleClick,
      handleDelete,
      count
    } = this.props;
    const { role, safeCode } = this.state;
    let roleName = "";
    if (disabled) {
      switch (role) {
        case 1:
          roleName = "站长";
          break;
        case 2:
          roleName = "管理员";
          break;
        case 3:
          roleName = "编辑";
          break;
        case 4:
          roleName = "作者";
          break;
        case 5:
          roleName = "成员";
          break;
        default:
          roleName = "粉丝";
      }
    }
    return (
      <div
        className={`member-card ${handleClick ? "clickable" : ""}`}
        onClick={handleClick}
      >
        {/* 删除按钮 */}
        {type !== "import" &&
        !disabled &&
        userRole &&
        userRole <= 2 &&
        userRole < role ? (
          <i className="deleteMember" onClick={handleDelete}></i>
        ) : null}

        {/* 用户头像 */}
        <div className="member-avatar-container">
          <i
            className="member-avatar"
            style={{
              backgroundImage: `url(${
                avatar
                  ? `${avatar}?imageView2/1/w/80/h/80`
                  : "/image/icon/avatar.svg"
              })`
            }}
          ></i>
        </div>

        {/* 用户信息 */}
        <div className="member-info">
          <span className="member-name">{name || ""}</span>
          <span className="member-name">{mobile || ""}</span>
          {disabled ? (
            <div>{`${roleName} 投稿数:${count}`}</div>
          ) : (
            <div className="member-card-select-wrapper">
              <Select
                value={role}
                style={{ width: 80 }}
                ref={node => (this.select = node)}
                onChange={this.handleChange}
                disabled={
                  userRole && userRole <= 2 && userRole < role ? false : true
                }
              >
                {type === "import" ? (
                  <Option value={1} disabled>
                    站长
                  </Option>
                ) : (
                  <Option value={1}>站长</Option>
                )}
                <Option value={2}>管理员</Option>
                <Option value={3}>编辑</Option>
                <Option value={4}>作者</Option>
                <Option value={5}>成员</Option>
              </Select>
              <Select
                value={safeCode}
                style={{ width: 80 }}
                ref={node => (this.select = node)}
                onChange={this.handleChangeSafeCode}
                disabled={
                  userRole && userRole <= 2 && userRole < role ? false : true
                }
              >
                <Option value={1}>绿码</Option>
                <Option value={2}>黄码</Option>
                <Option value={3}>红码</Option>
                <Option value={4}>黑码</Option>
              </Select>
            </div>
          )}
        </div>

        {/* 提升粉丝为成员 */}
        {!role && type !== "import" && disabled ? (
          <i className="improve-member" onClick={this.improveMember}>
            设为成员
          </i>
        ) : null}
      </div>
    );
  }
}

class SearchMemberCard extends Component {
  render() {
    const {
      groupKey,
      userKey,
      avatar,
      name,
      mobile,
      addGroupMember,
      disable
    } = this.props;
    return (
      <div className="member-card">
        <div className="member-avatar-container">
          <i
            className="member-avatar"
            style={{
              backgroundImage: `url(${
                avatar
                  ? `${avatar}?imageView2/1/w/80/h/80`
                  : "/image/icon/avatar.svg"
              })`
            }}
          ></i>
        </div>
        <div className="member-info">
          <span className="member-name">{name || ""}</span>
          <span className="member-name">{mobile || ""}</span>
          {disable ? (
            <span>已添加</span>
          ) : (
            <span
              className="member-button"
              onClick={addGroupMember.bind(this, groupKey, [
                {
                  userKey: userKey,
                  role: 5
                }
              ])}
            >
              添加
            </span>
          )}
        </div>
      </div>
    );
  }
}

class IconWithText extends Component {
  render() {
    const { iconUrl, title, handleClick } = this.props;
    return (
      <div className="icon-with-text" onClick={handleClick}>
        <i style={{ backgroundImage: `url(${iconUrl})` }}></i>
        <span>{title}</span>
      </div>
    );
  }
}

class Tab extends Component {
  render() {
    const { tabList, currentKey, handleClick } = this.props;
    return (
      <div className="router-tabs">
        {tabList.map((tab, index) => (
          <div
            key={index}
            className={`tab-item ${currentKey === tab.key ? "selected" : ""}`}
            onClick={() => handleClick(tab.key)}
          >
            {tab.name}
          </div>
        ))}
      </div>
    );
  }
}

class StationCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoSize: null
    };
  }

  render() {
    const { type, station, onClick } = this.props;
    const { logoSize } = this.state;
    let roleNmae;
    switch (station.role) {
      case 1:
        roleNmae = "站长";
        break;
      case 2:
        roleNmae = "管理员";
        break;
      case 3:
        roleNmae = "编辑";
        break;
      case 4:
        roleNmae = "作者";
        break;
      case 5:
        roleNmae = "成员";
        break;
      default:
        roleNmae = "游客";
        break;
    }
    let action = null;
    switch (type) {
      case "add":
        action = <div className="station-card-action">添加</div>;
        break;
      case "added":
        action = <div className="station-card-action">已添加</div>;
        break;
      case "list":
        action = <div className="station-card-action">删除</div>;
        break;
      default:
        break;
    }
    return (
      <div
        className={`station-card role${station.role ? station.role : ""}`}
        onClick={() => onClick()}
      >
        <span className="card-station-role">{roleNmae}</span>
        <div className="card-station-title">
          <i
            className="card-station-logo"
            style={{
              backgroundImage: `url(${
                station.logo ? station.logo : "/image/background/logo.svg"
              })`,
              width: logoSize
                ? `${Math.ceil(68 * (logoSize.width / logoSize.height))}px`
                : "68px"
            }}
          ></i>
          <span className="card-station-name">{station.name}</span>
        </div>
        {action}
      </div>
    );
  }

  async componentDidMount() {
    const { station } = this.props;
    const { seriesInfo = [] } = station;
    let checkedChannels = [];
    for (let i = 0; i < seriesInfo.length; i++) {
      if (seriesInfo[i].isCareSeries) {
        checkedChannels.push(seriesInfo[i]._key);
      }
    }
    // 获取logo大小
    let size = await util.common.getImageInfo(station.logo);
    this.setState({
      checkedChannels: checkedChannels,
      allChecked: checkedChannels.length === seriesInfo.length ? true : false,
      logoSize: size
    });
  }

  componentDidUpdate(prevProps) {
    const { station } = this.props;
    if (prevProps.station._key !== station._key) {
      const { seriesInfo = [] } = station;
      let checkedChannels = [];
      for (let i = 0; i < seriesInfo.length; i++) {
        if (seriesInfo[i].isCareSeries) {
          checkedChannels.push(seriesInfo[i]._key);
        }
      }
      this.setState({
        checkedChannels: checkedChannels,
        allChecked: checkedChannels.length === seriesInfo.length ? true : false
      });
    }
  }
}

export { MemberCard, SearchMemberCard, IconWithText, Tab, StationCard };
