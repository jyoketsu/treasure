import React, { useState, useRef } from "react";
import "./HeaderMenu.css";
import { useHistory } from "react-router-dom";
import { Input } from "antd";
import Me from "./User/Me";
import Message from "./Message";
import Content from "./options/Content";
import util from "../services/Util";
import { HOST_NAME } from "../global";
import { changeStation } from "../actions/app";
import { useSelector, useDispatch } from "react-redux";

export default function HeadMenu({ switchMenu }) {
  const containerEl = useRef(null);
  const [key, setkey] = useState("sites");
  let content = null;
  switch (key) {
    case "sites":
      content = <StationList switchMenu={switchMenu} />;
      break;
    case "aritcles":
      content = (
        <div style={{ padding: "15px 5px" }}>
          <Content singleColumn={true} paginationCallback={scrollTop} />
        </div>
      );
      break;
    case "messages":
      content = <Message />;
      break;
    case "me":
      content = <Me />;
      break;
    default:
      break;
  }

  function scrollTop() {
    containerEl.current.scrollTop = 0;
  }

  return (
    <div className="head-menu" ref={containerEl}>
      <Head switchMenu={switchMenu} />
      <Tab selected={key} onClick={setkey} />
      {content}
    </div>
  );
}

function Tab({ selected, onClick }) {
  const tabs = [
    { id: "sites", text: "站点" },
    { id: "aritcles", text: "文章" },
    { id: "messages", text: "消息" },
    { id: "me", text: "我" }
  ];
  return (
    <div className="menu-head-tab">
      {tabs.map((tab, index) => (
        <TabItem
          key={index}
          selected={selected}
          id={tab.id}
          text={tab.text}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
function TabItem({ id, text, selected, onClick }) {
  return (
    <div
      className={`menu-head-tab-item ${id === selected ? "selected" : ""}`}
      onClick={() => onClick(id)}
    >
      <div>{text}</div>
    </div>
  );
}

function Head({ switchMenu }) {
  const nowStation = useSelector(state => state.station.nowStation);
  const isMobile = util.common.isMobile();
  return isMobile ? (
    <div
      className="head-menu-head"
      style={{ backgroundImage: `url(${nowStation.cover}?imageView2/2/w/500)` }}
    >
      <div className="head-menu-head-filter"></div>
      <div className="left-section">
        <span style={{ color: "#fff" }}>{nowStation.name}</span>
      </div>
      <div className="right-section">
        <i className="close-head-menu" onClick={() => switchMenu()}></i>
      </div>
    </div>
  ) : (
    <div
      className="head-menu-head"
      style={{ height: "50px", borderBottom: "1px solid #e6e6e6" }}
    >
      <div className="left-section">
        <span>个人中心</span>
      </div>
      <div className="right-section">
        <i
          className="close-head-menu"
          style={{
            backgroundImage: "url(/image/icon/story/close-black.svg)"
          }}
          onClick={() => switchMenu()}
        ></i>
      </div>
    </div>
  );
}

// 站点列表
function StationList({ switchMenu }) {
  const { Search } = Input;
  const history = useHistory();
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const stationList = useSelector(state => state.station.stationList);
  const [searchStr, setsearchStr] = useState("");

  function getRoleColor(role) {
    let color;
    switch (role) {
      case 1:
        color = "#EB817F";
        break;
      case 2:
        color = "#68B68F";
        break;
      case 3:
        color = "#6B90EF";
        break;
      case 4:
        color = "#CEA461";
        break;
      default:
        break;
    }
    return color;
  }

  function getRoleName(role) {
    let roleNmae;
    switch (role) {
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
      default:
        break;
    }
    return roleNmae;
  }

  function handleStationClick(key, domain, url) {
    if (domain === nowStation.domain) {
      return;
    }
    switchMenu();
    const hostName = window.location.hostname;
    // 切换站点
    if ((hostName === HOST_NAME || hostName === "localhost") && !url) {
      changeStation(key, null, dispatch);
      history.push(`/${domain}/home`);
    } else {
      const token = localStorage.getItem("TOKEN");
      window.open(
        `${
          url
            ? `http://${url}/account/login?token=${token}`
            : `https://${HOST_NAME}/${domain}/home`
        }`,
        "_blank"
      );
    }
  }

  return (
    <div className="menu-station-list">
      <Search
        placeholder="请输入站点名"
        style={{ margin: "15px 0" }}
        onSearch={value => setsearchStr(value)}
        enterButton
      />
      {stationList.map(station =>
        station.name.includes(searchStr) ? (
          <div key={station._key}>
            <i
              className="menu-station-logo"
              style={{
                backgroundImage: `url(${station.logo}?imageView2/2/w/100)`
              }}
            ></i>
            <span
              className="menu-station-name"
              onClick={() =>
                handleStationClick(station._key, station.domain, station.url)
              }
            >{`${station.name}`}</span>
            {station.role && station.role < 5 ? (
              <i
                className="menu-station-role"
                style={{
                  backgroundColor: getRoleColor(station.role)
                }}
              >
                {getRoleName(station.role)}
              </i>
            ) : null}
          </div>
        ) : null
      )}
    </div>
  );
}
