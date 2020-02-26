import React, { useEffect } from "react";
import "./Visitors.css";
import TitleHead from "./TitleHead";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getLatestVisitors } from "../../../actions/app";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

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
    <div className="latest-visitor-item">
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
        onClick={() => {
          if (user.domain) {
            window.location.href = `https://baoku.qingtime.cn/${user.domain}/home`;
          }
        }}
      ></i>
      <div>{user.nickName || ""}</div>
      <div>
        {user.updateTime
          ? moment(user.updateTime)
              .startOf("hour")
              .fromNow()
          : ""}
      </div>
    </div>
  );
}
