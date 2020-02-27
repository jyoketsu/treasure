import React from "react";
import "./StoryActions.css";
import { useSelector, useDispatch } from "react-redux";
import { like } from "../../actions/app";

export default function StoryAction() {
  const dispath = useDispatch();
  const story = useSelector(state => state.story.story);

  function handleLike() {
    like(story._key, dispath);
  }

  return (
    <div className="story-action">
      <i
        className="story-action-like"
        style={{
          backgroundImage: `url(${
            story && story.islike
              ? "/image/icon/like.svg"
              : "/image/icon/like2.svg"
          })`
        }}
        onClick={handleLike}
      ></i>
      <span className="story-action-number">
        {story ? story.likeNumber : 0}
      </span>
    </div>
  );
}
