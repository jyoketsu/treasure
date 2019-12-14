import React, { useState, useEffect } from "react";
import "./Village.css";
// import Header from "./Header";
import Header from "../../Header";
import Channels from "./Channels";
import News from "./News";
import Fans from "./Fans";
import Rank from "./Rank";
import { useSelector } from "react-redux";

export default function Village() {
  const nowStation = useSelector(state => state.station.nowStation);
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
      <div className="village-head-wrapper">
        <Header />
      </div>
      <Banner nowStation={nowStation} />
      <div className="village-content">
        <Channels />
        <News />
        <Fans />
        <Rank />
      </div>
    </div>
  );
}

function Banner({ nowStation }) {
  return (
    <div
      className="village-banner"
      style={{
        backgroundImage: `url(${nowStation ? nowStation.cover : ""})`
      }}
    ></div>
  );
}
