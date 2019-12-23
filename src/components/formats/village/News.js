import React, { useEffect } from "react";
import "./News.css";
import TitleHead from "./TitleHead";
import useStoryClick from "../../common/useStoryClick";
import { useSelector, useDispatch } from "react-redux";
import { getStoryList } from "../../../actions/app";

export default function News() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const storyList = useSelector(state => state.story.storyList);
  const storyClick = useStoryClick();
  // 站点频道
  const seriesInfo = nowStation ? nowStation.seriesInfo : [];
  // 新闻频道key（将第1个频道作为新闻频道）
  const newsChannelKey = seriesInfo[0] ? seriesInfo[0]._key : "";

  useEffect(() => {
    if (nowStation) {
      getStoryList(
        1,
        nowStation._key,
        null,
        newsChannelKey,
        1,
        1,
        "",
        "",
        1,
        30,
        false,
        false,
        dispatch
      );
    }
  }, [nowStation, newsChannelKey, dispatch]);

  function handleClick(story) {
    storyClick(story);
  }

  return (
    <div className="village-news">
      <TitleHead
        icon="/image/icon/village/volume-up-outline.svg"
        text={seriesInfo[0] ? seriesInfo[0].name : ""}
      />
      <div className="village-news-list">
        {storyList.map((story, index) => (
          <NewsItem
            key={index}
            news={story}
            showContent={index === 0 ? true : false}
            onClick={handleClick}
          />
        ))}
      </div>
    </div>
  );
}

function NewsItem({ news, showContent, onClick }) {
  return (
    <div className="news-item">
      <div className="news-item-title" onClick={() => onClick(news)}>{`${
        showContent ? "" : "・"
      }${news.title}`}</div>
      {showContent ? (
        <div className="news-item-content">{news.descript}</div>
      ) : null}
    </div>
  );
}
