import React from "react";
import "./StoryActions.css";
import util from "../../services/Util";
import { Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { like, setStatusTag } from "../../actions/app";

export default function StoryAction({ children }) {
  return (
    <div className="story-action">
      <div className="left-section">{children}</div>
      <div className="right-section">
        <StatusTag />
        <Like />
      </div>
    </div>
  );
}

function StatusTag() {
  const { Option } = Select;
  const dispath = useDispatch();
  const nowStation = useSelector((state) => state.station.nowStation);
  const channelInfo = useSelector((state) =>
    state.station.nowStation ? state.station.nowStation.seriesInfo : []
  );
  const story = useSelector((state) => state.story.story);
  const stats = useSelector((state) => state.story.statusTagStats);
  const nowChannelId =
    story && story.series
      ? story.series._key
      : util.common.getSearchParamValue(window.location.search, "channel");
  const role = nowStation ? nowStation.role : 8;

  let nowChannel = {};
  for (let i = 0; i < channelInfo.length; i++) {
    if (channelInfo[i]._key === nowChannelId) {
      nowChannel = channelInfo[i];
      break;
    }
  }

  const { allowPublicStatus, statusTag } = nowChannel;

  function getStats(tag, stats) {
    for (let i = 0; i < stats.length; i++) {
      const nowStats = stats[i];
      if (nowStats.statusTag === tag) {
        return nowStats.length;
      }
    }
  }

  return stats &&
    statusTag &&
    (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ? (
    <Select
      value={story.statusTag}
      style={{ width: 120 }}
      onChange={(value) => setStatusTag(story._key, value, dispath)}
    >
      <Option key="notag" value="">
        无
      </Option>
      {statusTag.split(" ").map((item, index) => (
        <Option key={index} value={item}>
          {getStats(item, stats) ? `${item}（${getStats(item, stats)}）` : item}
        </Option>
      ))}
    </Select>
  ) : null;
}

function Like() {
  const dispath = useDispatch();
  const story = useSelector((state) => state.story.story);

  function handleLike() {
    like(story._key, story.type, dispath);
  }

  return (
    <div className="story-action-like-wrapper">
      <i
        className="story-action-like"
        style={{
          backgroundImage: `url(${
            story && story.islike
              ? "/image/icon/like.svg"
              : "/image/icon/like2.svg"
          })`,
        }}
        onClick={handleLike}
      ></i>
      <span className="story-action-number">
        {story ? story.likeNumber : 0}
      </span>
    </div>
  );
}
