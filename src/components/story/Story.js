import React, { Component } from "react";
import "./Story.css";
import LoginTip from "../common/LoginTip";
import StoryAction from "./StoryActions";
import Comments from "./Comments";
import util from "../../services/Util";
import api from "../../services/Api";
import moment from "moment";
import { Radio } from "antd";
import { connect } from "react-redux";
import {
  getStoryDetail,
  updateExif,
  setStatusTag,
  statisticsStatusTag
} from "../../actions/app";

const mapStateToProps = state => ({
  user: state.auth.user,
  userId: state.auth.user ? state.auth.user._key : null,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey,
  channelInfo: state.station.nowStation
    ? state.station.nowStation.seriesInfo
    : [],
  loading: state.common.loading,
  statusTagStats: state.story.statusTagStats
});

class Story extends Component {
  constructor(props) {
    super(props);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.handleToEdit = this.handleToEdit.bind(this);
    this.handleClickSite = this.handleClickSite.bind(this);
    this.state = { propsKey: null };
  }

  handleClickImage(url) {
    if (!util.common.isMiniProgram()) {
      window.open(url, "_blank");
    }
  }

  handleToEdit() {
    const { history, location, story, channelInfo } = this.props;
    let nowChannel;
    for (let i = 0; i < channelInfo.length; i++) {
      if (story.series._key === channelInfo[i]._key) {
        nowChannel = channelInfo[i];
        break;
      }
    }
    if (!nowChannel) {
      return;
    }
    history.push(`editStory${location.search}`);
  }

  handleClickSite() {
    const { history, nowStation } = this.props;
    history.push(`/${nowStation.domain}/home`);
  }

  render() {
    const {
      user,
      story,
      userId,
      nowStationKey,
      nowStation,
      readOnly,
      inline,
      loading,
      channelInfo,
      setStatusTag,
      statusTagStats
    } = this.props;
    const {
      userKey,
      title,
      creator = {},
      richContent = [],
      address,
      memo
    } = story;
    const role = nowStation ? nowStation.role : 8;
    let avatar = creator.avatar
      ? `${creator.avatar}?imageView2/1/w/160/h/160`
      : "/image/icon/avatar.svg";

    const nowChannelId = story.series
      ? story.series._key
      : util.common.getSearchParamValue(window.location.search, "channel");

    let nowChannel = {};

    for (let i = 0; i < channelInfo.length; i++) {
      if (channelInfo[i]._key === nowChannelId) {
        nowChannel = channelInfo[i];
        break;
      }
    }

    const { statusTag, allowPublicStatus, showSetting } = nowChannel;
    const showAuthor = showSetting
      ? showSetting.indexOf("author") === -1
        ? false
        : true
      : true;

    return (
      <div
        className={`app-content story-container ${inline ? "inline" : ""}`}
        style={{
          backgroundColor: inline ? "unset" : "#f5f5f5"
        }}
      >
        {!loading ? (
          <div
            className="main-content story-content"
            style={{
              minHeight: `${window.innerHeight - 70}px`,
              backgroundColor: inline ? "unset" : "white",
              boxShadow: inline ? "unset" : "0 0 3px rgba(0, 0, 0, .1)"
            }}
          >
            <div className="story-head-title">
              <div className="story-title">{title}</div>
              <div className="story-head-info">
                <div className="story-head-other">
                  <div
                    className="story-station-channel"
                    onClick={this.handleClickSite}
                  >
                    {`${story ? story.starName : ""} / ${
                      story.series ? story.series.name : ""
                    }`}
                  </div>
                  <div className="story-head-date">
                    {showAuthor
                      ? [
                          <i
                            key="story-head-avatar"
                            className="story-head-avatar"
                            style={{
                              backgroundImage: `url('${avatar ||
                                "/image/icon/avatar.svg"}')`
                            }}
                            onClick={() =>
                              (window.location.href = `https://baoku.qingtime.cn/${story.creator.domain}/home`)
                            }
                          ></i>,
                          <div
                            key="story-card-name"
                            className="story-card-name"
                            onClick={() =>
                              (window.location.href = `https://baoku.qingtime.cn/${story.creator.domain}/home`)
                            }
                          >
                            {`${creator.name || creator.mobile || ""}${
                              story.creator && story.creator.relationDesc
                                ? `（${story.creator.relationDesc}）`
                                : ""
                            }`}
                          </div>
                        ]
                      : null}

                    <div className="story-card-time">
                      {moment(story.updateTime).format("l")}
                    </div>
                    <div className="story-card-number">{`阅读：${story.clickNumber}`}</div>
                  </div>
                </div>
                {/* {story.tag ? <div>标签：{story.tag}</div> : null} */}
                {address ? (
                  <div className="story-head-address">{address}</div>
                ) : null}
              </div>
            </div>
            {/<iframe.*?(?:>|\/>)/gi.test(story.backGroundMusic) ? (
              <div
                className="story-edit-music"
                dangerouslySetInnerHTML={{ __html: story.backGroundMusic }}
              ></div>
            ) : null}
            {!readOnly &&
            (userId === userKey || (role && role <= 3)) &&
            nowStationKey !== "all" ? (
              <span className="to-edit-story" onClick={this.handleToEdit}>
                编辑
              </span>
            ) : null}
            {story.statusTag ? (
              <span className="preview-status">{story.statusTag}</span>
            ) : null}
            {memo ? <pre className="story-memo">{memo}</pre> : null}
            {richContent
              ? richContent.map((content, index) => {
                  const { url, memo } = content;
                  let result = null;
                  let regex1 = /[^()]+(?=\))/g;
                  switch (content.metaType) {
                    case "html":
                      result = <pre className="story-content-view">{memo}</pre>;
                      break;
                    case "header":
                      result = (
                        <span className="story-text-title-show">{memo}</span>
                      );
                      break;
                    case "image": {
                      let exifStr = "";
                      if (content.exif) {
                        const model = content.exif.Model
                          ? `${content.exif.Model.val}，  `
                          : "";
                        const shutterSpeedValue = content.exif.ShutterSpeedValue
                          ? `${content.exif.ShutterSpeedValue.val.match(
                              regex1
                            )}，  `
                          : "";
                        const apertureValue = content.exif.ApertureValue
                          ? `${content.exif.ApertureValue.val.match(
                              regex1
                            )}，  `
                          : "";
                        const iSOSpeedRatings = content.exif.ISOSpeedRatings
                          ? `${content.exif.ISOSpeedRatings.val}`
                          : "";
                        exifStr =
                          model +
                          shutterSpeedValue +
                          apertureValue +
                          iSOSpeedRatings;
                      }

                      result = (
                        <div className="story-imageGroup">
                          <div className="story-image-box">
                            <img
                              className="story-image lozad"
                              src={`${url}?imageView2/2/w/900/`}
                              alt="story"
                              onClick={this.handleClickImage.bind(this, url)}
                            />
                            {exifStr ? (
                              <div className="img-exif">{exifStr}</div>
                            ) : null}
                          </div>
                          <div className="image-memo">{memo}</div>
                        </div>
                      );
                      break;
                    }
                    case "video":
                      result = (
                        <video
                          className="story-video"
                          src={url}
                          controls="controls"
                          loop="loop"
                        >
                          Your browser does not support the video tag.
                        </video>
                      );
                      break;
                    default:
                      break;
                  }
                  return (
                    <div className="story-content-edit-box" key={index}>
                      {result}
                    </div>
                  );
                })
              : null}
            {!inline &&
            statusTag &&
            (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ? (
              <StatusTagRadio
                storyKey={story._key}
                statusTag={statusTag}
                status={story.statusTag}
                setStatusTag={setStatusTag}
                stats={statusTagStats}
              />
            ) : null}
            <StoryAction />
            <Comments />
          </div>
        ) : null}
        {user && user.isGuest && util.common.isMobile() ? <LoginTip /> : null}
      </div>
    );
  }

  componentDidMount() {
    const { location, getStoryDetail } = this.props;
    if (location) {
      let storyKey = util.common.getSearchParamValue(location.search, "key");
      if (storyKey) {
        getStoryDetail(storyKey);
      }
    }
  }

  componentDidUpdate(prevPros) {
    const {
      story,
      updateExif,
      channelInfo,
      statisticsStatusTag,
      nowStationKey
    } = this.props;
    const prevStoryKey = prevPros.story ? prevPros.story._key : null;
    // 获取到故事详情后
    if (prevStoryKey !== story._key) {
      // 当前频道
      const nowChannelId = story.series
        ? story.series._key
        : util.common.getSearchParamValue(window.location.search, "channel");
      let nowChannel = {};
      for (let i = 0; i < channelInfo.length; i++) {
        if (channelInfo[i]._key === nowChannelId) {
          nowChannel = channelInfo[i];
          break;
        }
      }

      if (nowChannel.showExif) {
        let richContent = story.richContent;
        const promises = [];
        for (let i = 0; i < richContent.length; i++) {
          if (richContent[i].metaType === "image") {
            promises.push(api.requests.get(`${richContent[i].url}?exif`));
          }
        }

        Promise.all(promises)
          .then(function(posts) {
            let postsIndex = 0;
            for (let i = 0; i < richContent.length; i++) {
              if (richContent[i].metaType === "image") {
                if (!posts[postsIndex].error) {
                  richContent[i].exif = posts[postsIndex];
                }
                postsIndex++;
              }
            }
            updateExif(JSON.parse(JSON.stringify(story)));
          })
          .catch(function(reason) {
            console.log(reason);
          });
      }

      if (nowChannelId && nowChannel.statusTag) {
        statisticsStatusTag(
          nowStationKey,
          nowChannelId && nowChannelId === "allSeries" ? "" : nowChannelId,
          nowChannel.statusTag
        );
      }
    }
  }
}

export default connect(mapStateToProps, {
  getStoryDetail,
  updateExif,
  setStatusTag,
  statisticsStatusTag
})(Story);

class StatusTagRadio extends Component {
  render() {
    const { statusTag, status, setStatusTag, storyKey, stats } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };
    return (
      <div className="status-tag-radio">
        <Radio.Group
          value={status}
          onChange={e => setStatusTag(storyKey, e.target.value)}
        >
          <Radio style={radioStyle} value="">
            无
          </Radio>
          {statusTag.split(" ").map((item, index) => (
            <Radio key={index} style={radioStyle} value={item}>
              {this.getStats(item, stats)
                ? `${item}（${this.getStats(item, stats)}）`
                : item}
            </Radio>
          ))}
        </Radio.Group>
      </div>
    );
  }

  getStats(tag, stats) {
    for (let i = 0; i < stats.length; i++) {
      const nowStats = stats[i];
      if (nowStats.statusTag === tag) {
        return nowStats.length;
      }
    }
  }
}
