import React, { useEffect } from "react";
import "./StoryList.css";
import moment from "moment";
import { useRouteMatch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStoryList } from "../../../actions/app";

export default function StoryList() {
  const perPage = 20;
  const match = useRouteMatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const storyList = useSelector(state => state.story.storyList);
  const sortType = useSelector(state => state.story.sortType);
  const sortOrder = useSelector(state => state.story.sortOrder);
  const tag = useSelector(state => state.story.tag);
  const statusTag = useSelector(state => state.story.statusTag);
  const dispatch = useDispatch();
  useEffect(() => {
    getStoryList(
      1,
      nowStation._key,
      null,
      match.params.channelKey,
      sortType,
      sortOrder,
      tag,
      statusTag,
      1,
      perPage,
      false,
      false,
      dispatch
    );
  }, [nowStation, match, sortType, sortOrder, tag, statusTag, dispatch]);
  return (
    <div className="village-story-list">
      <div className="header">头部</div>
      {storyList.map((story, index) => (
        <Story key={index} story={story} />
      ))}
    </div>
  );
}

function Story({ story }) {
  return (
    <div className="village-story-cover">
      <div className="user-info">
        <i
          style={{
            backgroundImage: `url(${story.creator.avatar}?imageView2/2/w/90)`
          }}
        ></i>
        <div>
          <span>{story.creator.name}</span>
          <span>{moment(story.updateTime).fromNow()}</span>
        </div>
      </div>
      <div
        className="cover"
        style={{ backgroundImage: `url(${story.cover}?imageView2/2/w/900)` }}
      ></div>
      <div className="foot">
        <div className="story-action">
          <span>{`${story.likeNumber}次赞`}</span>
          <div>
            <i
              className="like"
              style={{ backgroundImage: "url(/image/icon/village/like.svg)" }}
            ></i>
            <i
              className="comment"
              style={{
                backgroundImage: "url(/image/icon/village/comment.svg)"
              }}
            ></i>
          </div>
        </div>
        <div className="story-title">{story.title}</div>
      </div>
    </div>
  );
}
