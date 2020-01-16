import React from "react";
import "./Invite.css";
import { useSelector } from "react-redux";
export default function Invite() {
  const nowStation = useSelector(state => state.station.nowStation);
  const user = useSelector(state => state.auth.user);
  const url = `https://village.qingtime.cn/card?n=${nowStation.name}&domain=${
    nowStation._key
  }&name=${user.profile.nickName || user.profile.trueName}&avatar=${
    user.profile.avatar
  }`;
  return (
    <div
      className="village-invite"
      style={{ height: `${document.body.clientHeight}px` }}
    >
      <iframe
        title="邀请"
        src={url}
        frameBorder="0"
        width="100%"
        height="100%"
      ></iframe>
    </div>
  );
}
