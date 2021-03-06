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
import { Carousel } from "antd";
import AddButton from "../../AddArticleButton";
import Signin from "../../common/Signin";
import util from "../../../services/Util";
import { setChannelKey } from "../../../actions/app";
import {
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Village() {
  const [minHeight, setMinHeight] = useState(window.innerHeight);
  const match = useRouteMatch();
  const location = useLocation();
  const nowStation = useSelector((state) => state.station.nowStation);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!nowStation) {
      return;
    }
    const shareInfo = util.operation.getShareInfo(nowStation, null, null);
    if (shareInfo) {
      util.operation.initWechat(
        shareInfo.url,
        shareInfo.title,
        shareInfo.desc,
        shareInfo.imgUrl
      );
    }
  }, [nowStation]);

  function handleResize() {
    setMinHeight(window.innerHeight);
  }

  return (
    <div
      className="village"
      style={{
        minHeight: `${minHeight}px`,
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
        {false &&
        util.common.isMobile() &&
        !location.pathname.includes("/stories") ? (
          <FootNavi />
        ) : null}
      </div>
    </div>
  );
}

function Home() {
  const nowStation = useSelector((state) => state.station.nowStation);
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
      </div>
      <div
        className="ICPLicensing"
        onClick={() => window.open("https://beian.miit.gov.cn", "_blank")}
      >
        {`@${new Date().getFullYear()} 江苏时光信息科技有限公司 Qingtime All Rights Reserved 苏ICP备15006448号`}
      </div>
    </div>
  );
}

function Banner({ nowStation }) {
  const covers = nowStation.covers
    ? nowStation.covers
    : nowStation.cover
    ? [{ url: nowStation.cover }]
    : [];
  return (
    <div className="village-banner-wrapper">
      <Carousel autoplay>
        {covers.map((cover, index) => (
          <div key={index}>
            <div
              className="village-banner"
              style={{
                backgroundImage: `url(${cover.url})`,
              }}
            ></div>
          </div>
        ))}
      </Carousel>
      <Signin />
    </div>
  );
}

function FootNavi() {
  const location = useLocation();
  const history = useHistory();
  const nowStation = useSelector((state) => state.station.nowStation);
  return (
    <div className="village-navi">
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home`
              ? "url(/image/icon/village/home-fill.svg)"
              : "url(/image/icon/village/home.svg)",
        }}
        onClick={() => history.push(`/${nowStation.domain}/home`)}
      ></i>
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home/invite`
              ? "url(/image/icon/village/invite-fill.svg)"
              : "url(/image/icon/village/invite.svg)",
        }}
        onClick={() => history.push(`/${nowStation.domain}/home/invite`)}
      ></i>
      <AddButton />
      <i
        style={{
          backgroundImage:
            location.pathname === `/${nowStation.domain}/home/checkin`
              ? "url(/image/icon/village/sign-fill.svg)"
              : "url(/image/icon/village/sign.svg)",
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
