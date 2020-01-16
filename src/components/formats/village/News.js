import React, { useEffect } from "react";
import "./News.css";
import TitleHead from "./TitleHead";
import useStoryClick from "../../common/useStoryClick";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getHomeStories,
  clearStoryList,
  clearStoryDetail
} from "../../../actions/app";

export default function News() {
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const homeStories = useSelector(state => state.story.homeStories);
  const storyClick = useStoryClick();

  useEffect(() => {
    if (nowStation) {
      // 站点频道
      const seriesInfo = nowStation ? nowStation.seriesInfo : [];
      let channelKeys = [];

      for (let i = 0; i < seriesInfo.length; i++) {
        if (seriesInfo[i].inHome) {
          channelKeys.push(seriesInfo[i]._key);
        }
      }
      getHomeStories(nowStation._key, channelKeys, dispatch);
    }
  }, [nowStation, dispatch]);

  function handleClick(story) {
    storyClick(story);
  }

  return (
    <div className="village-news">
      {homeStories.map((result, index) => (
        <NewsSection
          key={index}
          channel={
            result.statusCode === "200" && result.result[0]
              ? result.result[0].series
              : null
          }
          storyList={result.statusCode === "200" ? result.result : []}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}

function NewsSection({ channel, storyList, onClick }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const nowStation = useSelector(state => state.station.nowStation);

  function toChannel(channelKey) {
    clearStoryList(dispatch);
    clearStoryDetail(dispatch);
    history.push(`/${nowStation.domain}/home/stories/${channelKey}`);
  }

  return (
    <div>
      {storyList.length ? (
        <div>
          <TitleHead
            icon="/image/icon/village/volume-up-outline.svg"
            text={channel ? channel.name : ""}
            onClick={
              channel
                ? () => {
                    toChannel(channel._key);
                  }
                : () => {}
            }
          />
          <div className="village-news-list">
            {storyList.map((story, index) => (
              <NewsItem
                key={index}
                news={story}
                showContent={index === 0 ? true : false}
                onClick={onClick}
              />
            ))}
          </div>
        </div>
      ) : null}
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
