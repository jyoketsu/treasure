import React, { useState, useEffect } from "react";
import "./Village.css";
// import Header from "./Header";
import Header from "../../Header";
import Channels from "./Channels";
import News from "./News";
import Visitors from "./Visitors";
import Fans from "./Fans";
import Rank from "./Rank";
import StoryList from "./StoryList";
import AddButton from "../../AddArticleButton";
import { Route, useRouteMatch } from "react-router-dom";
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
          {nowStation ? <AddButton /> : null}
        </div>
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
