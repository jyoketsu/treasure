import React, { useState, useEffect } from "react";
import "./Village.css";
import { Link } from "react-router-dom";
import Header from "./Header";
import Channels from "./Channels";
import { useSelector } from "react-redux";

function Village() {
  const nowStation = useSelector(state => state.station.nowStation);
  const user = useSelector(state => state.auth.user);
  const [minHeight, setMinHeight] = useState(window.innerHeight);

  useEffect(() => {
    console.log("Village-----useEffect");

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleResize() {
    setMinHeight(window.innerHeight);
  }

  return (
    <div
      className="village"
      style={{
        minHeight: `${minHeight}px`
      }}
    >
      <Header />
      <div
        className="village-banner"
        style={{
          backgroundImage: `url(${nowStation ? nowStation.cover : ""})`
        }}
      >
        {user &&
        !user.isGuest &&
        nowStation &&
        nowStation.role &&
        nowStation.role <= 3 ? (
          <Link to={`/${nowStation.domain}/stationOptions`}>设定</Link>
        ) : null}
      </div>
      <Channels />
    </div>
  );
}

export default Village;
