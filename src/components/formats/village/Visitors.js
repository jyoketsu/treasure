import React, { useEffect } from "react";
import TitleHead from "./TitleHead";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getLatestVisitors } from "../../../actions/app";

export default function Visitors() {
  const history = useHistory();
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const latestVisitors = useSelector(state => state.station.latestVisitors);
  useEffect(() => {
    getLatestVisitors(nowStation._key, dispatch);
  }, [nowStation, dispatch]);
  return (
    <div className="village-visitors">
      <TitleHead
        icon="/image/icon/village/eye.svg"
        text="最近访问"
        onClick={() => {
          history.push(`/${nowStation.domain}/home/visitors`);
        }}
      />
      <div
        className="latest-visitors"
        style={{ display: "flex", overflow: "hidden" }}
      >
        {latestVisitors.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }) {
  return (
    <div
      className="latest-visitor-item"
      style={{
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: "0"
      }}
    >
      <i
        style={{
          backgroundImage: `url(${
            user.avatar
              ? `${user.avatar}?imageView2/1/w/80/h/80`
              : "/image/icon/avatar.svg"
          })`,
          backgroundSize: "cover",
          borderRadius: "30px",
          width: "60px",
          height: "60px"
        }}
      ></i>
    </div>
  );
}
