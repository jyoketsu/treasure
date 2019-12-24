import React, { useEffect } from "react";
// import "./SubSite.css";
import { StationCard } from "../common/Common";
import { Input, message, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  searchStation,
  getSubStationList,
  addSubSite,
  removeSubSite
} from "../../actions/app";

export default function SubSite() {
  const confirm = Modal.confirm;
  const Search = Input.Search;
  const dispatch = useDispatch();
  const matchedStationList = useSelector(
    state => state.station.matchedStationList
  );
  const subStationList = useSelector(state => state.station.subStationList);
  const nowStation = useSelector(state => state.station.nowStation);

  useEffect(() => {
    getSubStationList(dispatch);
  }, [dispatch]);

  function showConfirm(station) {
    confirm({
      title: "删除子站",
      content: "确定要删除子站吗？",
      onOk() {
        removeSubSite(nowStation._key, station, dispatch);
      }
    });
  }

  return (
    <div className="sub-site">
      <h2>添加子站</h2>
      <Search
        placeholder="请搜索要添加的站点"
        onSearch={value => searchStation(value, 1, 100, dispatch)}
        style={{ width: 200 }}
      />
      <div className="member-search-result">
        {matchedStationList.map((station, index) => {
          let inList = false;
          for (let i = 0; i < subStationList.length; i++) {
            if (station._key === subStationList[i]._key) {
              inList = true;
              break;
            }
          }
          return (
            <StationCard
              key={index}
              type={inList ? "added" : "add"}
              station={station}
              onClick={() =>
                inList
                  ? message.info("已经存在该站，不能重复添加！")
                  : addSubSite(nowStation._key, station, dispatch)
              }
            />
          );
        })}
      </div>
      <h2>子站列表</h2>
      <div className="member-search-result">
        {subStationList.map((station, index) => (
          <StationCard
            key={index}
            type="list"
            station={station}
            onClick={() => showConfirm(station)}
          />
        ))}
      </div>
    </div>
  );
}
