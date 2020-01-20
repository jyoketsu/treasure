import React, { useEffect } from "react";
import "./RankAll.css";
import Head from "./Head";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getSubStationList, changeStation } from "../../../actions/app";

export default function AllRank() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const subStationList = useSelector(state => state.station.subStationList);
  useEffect(() => {
    getSubStationList(nowStation._key, dispatch);
  }, [nowStation, dispatch]);
  return (
    <div className="village-all-rank">
      <Head />
      <div className="village-all-rank-content">
        {subStationList.map((station, index) => (
          <SubSite key={index} station={station} />
        ))}
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
          onClick={() => toStation(station)}
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
