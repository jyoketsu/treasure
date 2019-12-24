import React, { useState, useEffect } from "react";
import "./Village.css";
import Header from "../../Header";
import Channels from "./Channels";
import News from "./News";
import Visitors from "./Visitors";
import Fans from "./Fans";
import Rank from "./Rank";
import StoryList from "./StoryList";
import AddButton from "../../AddArticleButton";
import util from "../../../services/Util";
import { Route, useRouteMatch, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Village() {
  const [minHeight, setMinHeight] = useState(window.innerHeight);
  const match = useRouteMatch();

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    setMinHeight(window.innerHeight);
  }

  return (
    <div
      className="village"
      style={{
        minHeight: `${minHeight}px`
      }}
    >
      <div>
        <Route exact path={`${match.path}`} component={Home} />
        <Route
          path={`${match.path}/stories/:channelKey`}
          component={StoryList}
        />
      </div>
    </div>
  );
}

function Home() {
  const nowStation = useSelector(state => state.station.nowStation);
  return (
    <div>
      <div className="village-head-wrapper">
        <Header />
      </div>
      <Banner nowStation={nowStation} />
      <div className="village-content">
        <Channels />
        <News />
        <Visitors />
        <Fans />
        <Rank />
        <div className="operation-panel">
          {nowStation && !util.common.isMobile() ? <AddButton /> : null}
        </div>
        {util.common.isMobile() ? <FootNavi /> : null}
      </div>
    </div>
  );
}

function Banner({ nowStation }) {
  return (
    <div
      className="village-banner"
      style={{
        backgroundImage: `url(${nowStation ? nowStation.cover : ""})`
      }}
    ></div>
  );
}

function FootNavi() {
  const match = useRouteMatch();
  const history = useHistory();
  const nowStation = useSelector(state => state.station.nowStation);
  return (
    <div className="village-navi">
      <i
        style={{
          backgroundImage:
            match.path === "/:id/home"
              ? "url(/image/icon/village/home-fill.svg)"
              : "url(/image/icon/village/home.svg)"
        }}
        onClick={() => history.push(`/${match.path}`)}
      ></i>
      <i style={{ backgroundImage: "url(/image/icon/village/invite.svg)" }}></i>
      <AddButton />
      <i style={{ backgroundImage: "url(/image/icon/village/sign.svg)" }}></i>
      <i
        style={{ backgroundImage: "url(/image/icon/village/people.svg)" }}
        onClick={() => history.push(`/${nowStation.domain}/me`)}
      ></i>
    </div>
  );
}
