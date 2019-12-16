import React, { useState, useEffect } from "react";
import "./Rank.css";
import util from "../../../services/Util";
import TitleHead from "./TitleHead";
import { useSelector, useDispatch } from "react-redux";
import { getSubStationList } from "../../../actions/app";

export default function Rank() {
  const subStationList = useSelector(state => state.station.subStationList);
  const dispatch = useDispatch();

  useEffect(() => {
    getSubStationList(dispatch);
  }, [dispatch]);

  return (
    <div className="village-sub-sites">
      <TitleHead icon="/image/icon/village/sitemap.svg" text="子站点" />
      <div className="village-sub-site-list">
        {subStationList.map((station, index) => (
          <SubSite station={station} />
        ))}
        {subStationList.length === 0 ? (
          <div className="no-sub-site">暂无子站点</div>
        ) : null}
      </div>
    </div>
  );
}

function SubSite({ station }) {
  const [logoSize, setLogoSize] = useState(null);
  useEffect(() => {
    async function getLogoInfo() {
      const logoSize = await util.common.getImageInfo(station.logo);
      setLogoSize(logoSize);
    }
    getLogoInfo();
  }, [station]);
  return (
    <div className="sub-site-wrapper">
      <i
        style={{
          backgroundImage: `url(${
            station.logo ? station.logo : "/image/background/logo.svg"
          })`,
          // width: logoSize
          //   ? `${Math.ceil(68 * (logoSize.width / logoSize.height))}px`
          //   : "68px"
        }}
      ></i>
      <div className="sub-site-info">
        <div className="sub-site-name">{station.name}</div>
        <div className="sub-site-stat-wrapper">
          <div className="sub-site-stat">
            <span>投稿数</span>
            <span>11</span>
          </div>
          <div className="sub-site-stat">
            <span>粉丝数</span>
            <span>11</span>
          </div>
        </div>
      </div>
    </div>
  );
}
