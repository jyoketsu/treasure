import React, { useEffect } from "react";
import "./Fans.css";
import TitleHead from "./TitleHead";
import { useSelector, useDispatch } from "react-redux";
import { groupMember } from "../../../actions/app";

export default function Fans() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const userList = useSelector(state => state.station.userList);

  useEffect(() => {
    if (nowStation) {
      groupMember(nowStation.fansGroupKey, nowStation._key, dispatch);
    }
  }, [nowStation, dispatch]);

  return (
    <div className="village-fans">
      <TitleHead icon="/image/icon/village/eye.svg" text="关注本站的人" />
      <div className="village-fans-list">
        {userList.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
    </div>
  );
}

function User({ user }) {
  return (
    <div className="village-fans-item">
      <i
        style={{
          backgroundImage: `url(${
            user.avatar
              ? `${user.avatar}?imageView2/1/w/80/h/80`
              : "/image/icon/avatar.svg"
          })`
        }}
      ></i>
      <div>{user.nickName || ""}</div>
      <div>{`投稿数:${user.albumCount}`}</div>
    </div>
  );
}
