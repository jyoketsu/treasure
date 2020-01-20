import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubStationList } from "../../../actions/app";

export default function AllRank() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const subStationList = useSelector(state => state.station.subStationList);
  useEffect(() => {
    getSubStationList(nowStation._key, dispatch);
  }, [nowStation, dispatch]);
  return <div className="village-all-visitors">全部子站点</div>;
}
