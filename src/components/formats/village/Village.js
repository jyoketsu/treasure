import React, { useState, useEffect } from "react";
import "./Village.css";
import Header from "../../Header";
import Channels from "./Channels";
import News from "./News";
import Visitors from "./Visitors";
import Fans from "./Fans";
import Rank from "./Rank";
import StoryList from "./StoryList";
import Invite from "./Invite";
import Checkin from "./Checkin";
import AllVisitors from "./VisitorsAll";
import AllFans from "./FansAll";
import AllRank from "./RankAll";
import AddButton from "../../AddArticleButton";
import util from "../../../services/Util";
import { setChannelKey } from "../../../actions/app";
import {
  Route,
  useRouteMatch,
  useHistory,
  useLocation
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Village() {
  const [minHeight, setMinHeight] = useState(window.innerHeight);
  const match = useRouteMatch();
  const location = useLocation();

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
        <Route path={`${match.path}/invite`} component={Invite} />
        <Route path={`${match.path}/checkin`} component={Checkin} />
        <Route path={`${match.path}/visitors`} component={AllVisitors} />
        <Route path={`${match.path}/fans`} component={AllFans} />
        <Route path={`${match.path}/rank`} component={AllRank} />
        {util.common.isMobile() && !location.pathname.includes("/stories") ? (
          <FootNavi />
        ) : null}
      </div>
    </div>
  );
}

function Home() {
  const nowStation = useSelector(state => state.station.nowStation);
  const dispatch = useDispatch();

  useEffect(() => {
    setChannelKey("allSeries", dispatch);
  }, [dispatch]);

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
  const location = useLocation();
  const history = useHistory();
  const nowStation = useSelector(state => state.station.nowStation);
  return (
    <div className="village-navi">
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home`
              ? "url(/image/icon/village/home-fill.svg)"
              : "url(/image/icon/village/home.svg)"
        }}
        onClick={() => history.push(`/${nowStation.domain}/home`)}
      ></i>
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home/invite`
              ? "url(/image/icon/village/invite-fill.svg)"
              : "url(/image/icon/village/invite.svg)"
        }}
        onClick={() => history.push(`/${nowStation.domain}/home/invite`)}
      ></i>
      <AddButton />
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home/checkin`
              ? "url(/image/icon/village/sign-fill.svg)"
              : "url(/image/icon/village/sign.svg)"
        }}
        onClick={() => history.push(`/${nowStation.domain}/home/checkin`)}
      ></i>
      <i
        style={{ backgroundImage: "url(/image/icon/village/people.svg)" }}
        onClick={() => history.push(`/${nowStation.domain}/me`)}
      ></i>
    </div>
  );
}
