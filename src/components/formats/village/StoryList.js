import React, { useEffect } from "react";
import "./StoryList.css";
import moment from "moment";
import { Spin } from "antd";
import useStoryClick from "../../common/useStoryClick";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStoryList } from "../../../actions/app";

export default function StoryList() {
  const perPage = 20;
  const match = useRouteMatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const storyList = useSelector(state => state.story.storyList);
  const storyNumber = useSelector(state => state.story.storyNumber);
  const sortType = useSelector(state => state.story.sortType);
  const sortOrder = useSelector(state => state.story.sortOrder);
  const tag = useSelector(state => state.story.tag);
  const waiting = useSelector(state => state.common.waiting);
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

  useEffect(() => {
    function handleMouseWheel() {
      let top = document.body.scrollTop || document.documentElement.scrollTop;
      if (
        storyList.length < storyNumber &&
        !waiting &&
        top + document.body.clientHeight === document.body.scrollHeight
      ) {
        let curPage = sessionStorage.getItem("home-curpage")
          ? parseInt(sessionStorage.getItem("home-curpage"), 10)
          : 1;
        curPage++;
        getStoryList(
          1,
          nowStation._key,
          null,
          match.params.channelKey,
          sortType,
          sortOrder,
          tag,
          statusTag,
          curPage,
          perPage,
          false,
          false,
          dispatch
        );
      }
    }
    document.body.addEventListener("wheel", handleMouseWheel);
    return () => {
      document.body.removeEventListener("wheel", handleMouseWheel);
    };
  }, [
    storyList,
    storyNumber,
    waiting,
    nowStation,
    match,
    sortType,
    sortOrder,
    tag,
    statusTag,
    dispatch
  ]);
  return (
    <div className="village-story-list">
      <Head />
      {storyList.map((story, index) => (
        <Story key={index} story={story} />
      ))}
      {waiting ? (
        <Loading />
      ) : (
        <div className="show-more">
          {storyList.length < storyNumber ? "查看更多" : "到底了"}
        </div>
      )}
    </div>
  );
}

function Head() {
  const history = useHistory();
  return (
    <div className="village-stories-head">
      <i className="back" onClick={() => history.goBack()}></i>
    </div>
  );
}
function Loading(params) {
  return (
    <div className="story-loading">
      <Spin size="large" />
    </div>
  );
}

function Story({ story }) {
  const click = useStoryClick();
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
        style={{
          backgroundImage: `url(${story.cover}?imageView2/2/w/900)`,
          display: story.cover ? "block" : "none"
        }}
        onClick={() => click(story)}
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
        <div className="story-title" onClick={() => click(story)}>
          {story.title}
        </div>
      </div>
    </div>
  );
}
