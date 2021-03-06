import React, { useEffect } from "react";
import "./FansAll.css";
import Head from "./Head";
import { useDispatch, useSelector } from "react-redux";
import { groupMember } from "../../../actions/app";

export default function AllFans() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const userList = useSelector(state => state.station.userList);
  useEffect(() => {
    if (nowStation) {
      groupMember(nowStation.fansGroupKey, nowStation._key, dispatch);
    }
  }, [nowStation, dispatch]);

  useEffect(() => {
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }
  }, []);

  return (
    <div className="village-all-fans">
      <Head title="订阅用户" />
      <div className="village-all-fans-content">
        {userList.map((user, index) => (
          <User key={index} user={user} />
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
    <div className="all-fans-item">
      <i
        style={{
          backgroundImage: `url(${user.avatar ||
            "https://iupac.org/wp-content/uploads/2018/05/default-avatar.png"})`
        }}
        onClick={() => toHomePage()}
      ></i>
      <div>
        <span className="all-fans-item-name" onClick={() => toHomePage()}>
          {user.nickName}
        </span>
        <span>{`投稿数:${user.albumCount}`}</span>
      </div>
    </div>
  );
}
