import React, { useEffect } from "react";
import "./VisitorsAll.css";
import Head from "./Head";
import { useDispatch, useSelector } from "react-redux";
import { getLatestVisitors } from "../../../actions/app";

export default function AllVisitors() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const latestVisitors = useSelector(state => state.station.latestVisitors);

  useEffect(() => {
    getLatestVisitors(nowStation._key, dispatch);
  }, [nowStation, dispatch]);

  useEffect(() => {
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, []);

  return (
    <div className="village-all-visitors">
      <Head />
      <div className="village-all-visitor-content">
        {latestVisitors.map((visitor, index) => (
          <User key={index} user={visitor} />
        ))}
      </div>
    </div>
  );
}

function User({ user }) {
  function toHomePage() {
    if (user.domain) {
      window.location.href = `https://baoku.qingtime.cn/${user.domain}/home`;
    }
  }

  return (
    <div className="all-visitor-item">
      <i
        style={{
          backgroundImage: `url(${user.avatar ||
            "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"})`
        }}
        onClick={() => toHomePage()}
      ></i>
      <div>
        <span className="all-visitor-item-name" onClick={() => toHomePage()}>
          {user.nickName}
        </span>
      </div>
    </div>
  );
}
