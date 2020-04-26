import React, { useState } from "react";
import "./Im.css";
import { useSelector } from "react-redux";
import ClickOutside from "./ClickOutside";
import util from "../../services/Util";

export default function Im() {
  const isMobile = util.common.isMobile();
  const user = useSelector((state) => state.auth.user);
  const [open, setopen] = useState(false);
  const token = localStorage.getItem("TOKEN");

  if (
    user &&
    !user.isGuest &&
    user.rocketChat &&
    user.rocketChat.authToken &&
    window.location.hostname !== "localhost"
  ) {
    return (
      <ClickOutside onClickOutside={() => setopen(false)}>
        <div className="im-wrapper">
          <i
            className={`im-button ${open ? "closed" : "opened"}`}
            onClick={() => setopen((prevOpen) => !prevOpen)}
          ></i>
          <iframe
            className="im-iframe"
            title="im"
            src={`https://im.qingtime.cn/#/rooms?token=${token}`}
            frameBorder="0"
            width={isMobile ? "100%" : "350px"}
            height={isMobile ? "100%" : document.body.clientHeight - 150}
            style={{ display: open ? "block" : "none" }}
          ></iframe>
        </div>
      </ClickOutside>
    );
  } else {
    return null;
  }
}
