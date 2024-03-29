import React, { useState, useEffect, useRef } from "react";
import "./StoryList.css";
import { Spin } from "antd";
import ScrollTitle from "../../common/ScrollTitle";
import Waterfall from "react-waterfall-responsive";
import { StoryCard } from "../../story/StoryCard";
import TagCloud from "react3dtagcloud_withclick";
import util from "../../../services/Util";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStoryList, like, setNowTag } from "../../../actions/app";

export default function StoryList() {
  const perPage = 20;
  const match = useRouteMatch();
  const nowStation = useSelector((state) => state.station.nowStation);
  const storyList = useSelector((state) => state.story.storyList);
  const storyNumber = useSelector((state) => state.story.storyNumber);
  const sortType = useSelector((state) => state.story.sortType);
  const sortOrder = useSelector((state) => state.story.sortOrder);
  const tag = useSelector((state) => state.story.tag);
  const waiting = useSelector((state) => state.common.waiting);
  const statusTag = useSelector((state) => state.story.statusTag);
  const dispatch = useDispatch();
  let hideHead = util.common.getQueryString("hide-head");

  const [columnNum, setColumnNum] = useState(
    sessionStorage.getItem("VILLAGE-COLUMN-NUM")
      ? parseInt(sessionStorage.getItem("VILLAGE-COLUMN-NUM"))
      : null
  );
  const containerEl = useRef(null);

  useEffect(() => {
    if (!storyList.length) {
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
    }
  }, [
    nowStation,
    storyList.length,
    match,
    sortType,
    sortOrder,
    tag,
    statusTag,
    dispatch,
  ]);

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
    dispatch,
  ]);

  useEffect(() => {
    setColumn();
    window.addEventListener("resize", setColumn);
    return () => {
      window.removeEventListener("resize", setColumn);
    };
  }, []);

  // 获取当前所在的频道
  const channels = nowStation ? nowStation.seriesInfo : [];
  let nowChannel = null;
  for (let index = 0; index < channels.length; index++) {
    const element = channels[index];
    if (element._key === match.params.channelKey) {
      nowChannel = element;
      break;
    }
  }

  // 获取当前频道的标签列表
  const tagList = nowChannel && nowChannel.tag ? nowChannel.tag.split(" ") : [];
  let tagObjList = [];
  for (let i = 0; i < tagList.length; i++) {
    if (util.common.isJSON(tagList[i])) {
      let obj = JSON.parse(tagList[i]);
      tagObjList.push(obj);
    } else {
      tagObjList.push({
        id: tagList[i],
        name: tagList[i],
      });
    }
  }

  function handleClickTag(tag) {
    sessionStorage.setItem("home-curpage", 1);
    setNowTag(tag.id, dispatch);
  }

  function setColumn() {
    if (containerEl) {
      const containerWidth = containerEl.current.clientWidth;
      const columnNum = Math.floor(containerWidth / 290);
      sessionStorage.setItem("VILLAGE-COLUMN-NUM", columnNum);
      setColumnNum(columnNum);
    }
  }

  const children = storyList.map((story, index) => {
    let height;
    let size = story.size;
    if (!(size && size.height && size.width)) {
      if (story.type !== 6 && !story.cover) {
        height = 80;
      } else {
        height = 310;
      }
    } else {
      height = 80 + (size.height / size.width) * 290;
    }
    return (
      <StoryCard
        key={index}
        story={story}
        like={() => like(story._key, story.type, dispatch)}
        showSetting={nowChannel.showSetting}
        width={290 + 5}
        height={height + 5}
      />
    );
  });

  return (
    <div className="village-story-list">
      <Head
        nowChannel={nowChannel}
        titleList={tagObjList}
        onClick={handleClickTag}
        hideHead={hideHead}
      />
      <ScrollTitle
        titleList={tagObjList}
        nowTitle={tag}
        onClick={handleClickTag}
      />
      <div className="village-story-list-container" ref={containerEl}>
        {columnNum && columnNum > 1 && children.length ? (
          <Waterfall columnNum={columnNum} gap={5}>
            {children}
          </Waterfall>
        ) : (
          children
        )}
        {waiting ? (
          <Loading />
        ) : (
          <div className="show-more">
            {storyList.length < storyNumber ? "查看更多" : "到底了"}
          </div>
        )}
      </div>
    </div>
  );
}

function Head({ nowChannel, titleList, onClick, hideHead }) {
  const isMobile = util.common.isMobile();
  const history = useHistory();
  let data = [];

  if (titleList.length > 2) {
    for (let index = 0; index < titleList.length; index++) {
      const element = titleList[index];
      data.push({
        id: element.id,
        name: element.name,
      });
    }
    data = [...data, ...data, ...data];
  }

  return (
    <div
      className="village-stories-banner"
      style={{
        backgroundImage: `url(${nowChannel ? nowChannel.cover : ""})`,
      }}
    >
      {!hideHead ? (
        <div className="village-banner-head" style={{ height: "45px" }}>
          <i className="back" onClick={() => history.goBack()}></i>
          <span className="village-banner-title">
            {nowChannel ? nowChannel.name : ""}
          </span>
        </div>
      ) : null}
      {!isMobile ? (
        <div className="tag-cloud-wrapper">
          {titleList.length > 2 ? (
            <div
              style={{
                width: "200px",
                height: "200px",
                marginRight: "30px",
                boxSizing: "content-box",
              }}
            >
              <TagCloud tagName={data} radius={150} onClick={onClick} />
            </div>
          ) : null}
        </div>
      ) : null}
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
