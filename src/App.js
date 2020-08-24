import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Spin, Skeleton } from "antd";
import { useSelector } from "react-redux";
import Init from "./components/Init";
import AddButton from "./components/AddArticleButton";
import Home from "./components/Home";
import Message from "./components/Message";
import EditStation from "./components/User/EditStation";
import Login from "./components/Login";
import Story from "./components/story/Story";
// import EditStory from './components/story/EditStory';
import Contribute from "./components/story/Contribute";
import StationOptions from "./components/options/StationOptions";
import EditArticle from "./components/story/EditArticle";
import Article from "./components/story/Article";
import Subscribe from "./components/subscribe/Subscribe";
import StoryEdit from "./components/story/StoryEdit";
import Create from "./components/story/Create";
import NotFound from "./components/NotFound";
import PortalHome from "./components/formats/portal/Portal";
import Village from "./components/formats/village/Village";
// import Im from "./components/common/Im";
import util from "./services/Util";
import { HOST_NAME } from "./global";

export default function App() {
  const [minHeight, setMinHeight] = useState(window.innerHeight);
  const nowStation = useSelector((state) => state.station.nowStation);
  const loading = useSelector((state) => state.common.loading);

  const isMobile = util.common.isMobile();

  // 站点类型
  const stationType = nowStation ? nowStation.style || 1 : "";
  // 主页
  let home;
  switch (stationType) {
    // 普通版式
    case 1:
      home = <Route path="/:id/home" component={Home} />;
      break;
    // 门户版式
    case 2: {
      // 如果是手机端，使用乡村版式
      if (isMobile) {
        home = <Route path="/:id/home" component={Village} />;
      } else {
        home = <Route path="/:id/home" component={PortalHome} />;
      }
      break;
    }
    // 乡村版式
    case 3:
      home = <Route path="/:id/home" component={Village} />;
      break;
    default:
      home = null;
      break;
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    let url = window.location.href;
    // 自动切换为https
    if (url.indexOf(HOST_NAME) !== -1 && url.indexOf("https") < 0) {
      url = url.replace("http:", "https:");
      window.location.replace(url);
    }

    if (
      window.location.pathname !== "/" &&
      !window.location.pathname.split("/")[2]
    ) {
      if (window.location.pathname.split("/")[2] === undefined) {
        window.location.href = `${window.location.href}/home`;
      } else {
        window.location.href = `${window.location.href}home`;
      }
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    setMinHeight(`${window.innerHeight}px`);
  }

  return (
    <Router>
      <div className="app" style={{ minHeight: minHeight }}>
        <Init />
        {/* <Im /> */}
        <div className="route-container">
          {nowStation ? (
            <div>
              {home}
              <Route path="/:id/message" component={Message} />
              <Route path="/:id/editStation" component={EditStation} />
              <Route path="/:id/story" component={Story} />
              {/* <Route path="/:id/editStory" component={EditStory}></Route> */}
              <Route path="/:id/create/:channelKey" component={Create}></Route>
              <Route path="/:id/editStory" component={StoryEdit}></Route>
              <Route path="/:id/contribute" component={Contribute}></Route>
              <Route
                path="/:id/stationOptions"
                component={StationOptions}
              ></Route>
              <Route path="/:id/article" component={Article}></Route>
              <Route path="/:id/editArticle" component={EditArticle} />
              <Route path="/:id/subscribe" component={Subscribe} />
            </div>
          ) : (
            <LoadStation />
          )}
          <Route path="/account/login" component={Login} />
          <Route path="/station/notFound" component={NotFound} />
        </div>
        {loading ? (
          <div className="loading-mask">
            <Spin size="large" />
          </div>
        ) : null}
        <div className="operation-panel-wrapper">
          {nowStation ? <AddButton /> : null}
        </div>
      </div>
    </Router>
  );
}

function LoadStation() {
  return (
    <div className="load-station">
      <Skeleton title paragraph={{ rows: 4 }} active />
      <Skeleton title paragraph={{ rows: 4 }} active />
    </div>
  );
}
