import React from "react";
import "./Channels.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearStoryList, clearStoryDetail } from "../../../actions/app";

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
  const dispatch = useDispatch();
  const history = useHistory();
  const nowStation = useSelector(state => state.station.nowStation);

  function toChannel(channelKey) {
    clearStoryList(dispatch);
    clearStoryDetail(dispatch);
    history.push(`/${nowStation.domain}/home/stories/${channelKey}`);
  }
  
  return (
    <div className="village-channel" onClick={() => toChannel(channel._key)}>
      <i style={{ backgroundImage: `url(${channel.logo})` }}></i>
      <span>{channel.name}</span>
    </div>
  );
}
