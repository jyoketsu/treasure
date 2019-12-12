import React, { useState, useEffect } from "react";
import "./Channels.css";
import { useSelector } from "react-redux";

export default function Channels() {
  const nowStation = useSelector(state => state.station.nowStation);
  const channels = nowStation ? nowStation.seriesInfo : [];

  return (
    <div className="village-channels">
      {channels.map((channel, index) => (
        <Channel key={index} channel={channel} />
      ))}
    </div>
  );
}

function Channel({ channel }) {
  return (
    <div className="village-channel">
      <i style={{ backgroundImage: `url(${channel.logo})` }}></i>
      <span>{channel.name}</span>
    </div>
  );
}
