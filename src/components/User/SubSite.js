import React, { useEffect } from "react";
// import "./SubSite.css";
import { StationCard } from "../common/Common";
import { Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { searchStation, getSubStationList } from "../../actions/app";

export default function SubSite() {
  const Search = Input.Search;
  const dispatch = useDispatch();
  const matchedStationList = useSelector(
    state => state.station.matchedStationList
  );
  const subStationList = useSelector(state => state.station.subStationList);

  useEffect(() => {
    getSubStationList(dispatch);
  }, [dispatch]);

  return (
    <div className="sub-site">
      <h2>添加子站</h2>
      <Search
        placeholder="请搜索要添加的站点"
        onSearch={value => searchStation(value, 1, 100, dispatch)}
        style={{ width: 200 }}
      />
      <div className="member-search-result">
        {matchedStationList.map((station, index) => (
          <StationCard
            key={index}
            type="add"
            station={station}
            onClick={() => alert(station.name)}
          />
        ))}
      </div>
      <h2>子站列表</h2>
      <div className="member-search-result">
        {subStationList.map((station, index) => (
          <StationCard
            key={index}
            type="list"
            station={station}
            onClick={() => alert(station.name)}
          />
        ))}
      </div>
    </div>
  );
}
