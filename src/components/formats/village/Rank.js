import React, { useEffect } from "react";
import "./Rank.css";
import TitleHead from "./TitleHead";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { getSubStationList, changeStation } from "../../../actions/app";

export default function Rank() {
  const subStationList = useSelector(state => state.station.subStationList);
  const nowStation = useSelector(state => state.station.nowStation);
  const dispatch = useDispatch();

  useEffect(() => {
    getSubStationList(nowStation._key, dispatch);
  }, [nowStation, dispatch]);

  return (
    <div className="village-sub-sites">
      <TitleHead icon="/image/icon/village/sitemap.svg" text="子站点" />
      <div className="village-sub-site-list">
        {subStationList.map((station, index) => (
          <SubSite key={index} station={station} />
        ))}
        {subStationList.length === 0 ? (
          <div className="no-sub-site">暂无子站点</div>
        ) : null}
      </div>
    </div>
  );
}

function SubSite({ station }) {
  const dispatch = useDispatch();
  const history = useHistory();
  function toStation(station) {
    history.push(`/${station.domain}/home`);
    changeStation(station._key, station.domain, dispatch);
  }
  return (
    <div className="sub-site-wrapper">
      <div className="sub-site-list-logo">
        <i
          style={{
            backgroundImage: `url(${
              station.logo ? station.logo : "/image/background/logo.svg"
            })`
          }}
        ></i>
      </div>
      <div className="sub-site-info">
        <div className="sub-site-name" onClick={() => toStation(station)}>
          {station.name}
        </div>
        <div className="sub-site-stat-wrapper">
          <div className="sub-site-stat">
            <span>投稿数</span>
            <span>{station.albumNumber}</span>
          </div>
          <div className="sub-site-stat">
            <span>粉丝数</span>
            <span>{station.fansNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
