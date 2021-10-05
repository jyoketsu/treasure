import React, { Component } from "react";
import "./Story.css";
import "swiper/swiper-bundle.min.css";
import LoginTip from "../common/LoginTip";
import StoryAction from "./StoryActions";
import Comments from "./Comments";
import SubStory from "./SubStory";
import Next from "./NextStory";
import util from "../../services/Util";
import api from "../../services/Api";
import moment from "moment";
import { connect } from "react-redux";
import { Icon } from "antd";
//https://swiperjs.com/react/#usage
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper";
import {
  getStoryDetail,
  updateExif,
  statisticsStatusTag,
} from "../../actions/app";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y, Autoplay]);

const mapStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.user ? state.auth.user._key : null,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey,
  channelInfo: state.station.nowStation
    ? state.station.nowStation.seriesInfo
    : [],
  loading: state.common.loading,
});

class Story extends Component {
  constructor(props) {
    super(props);
    this.handleClickImage = this.handleClickImage.bind(this);
    this.handleToEdit = this.handleToEdit.bind(this);
    this.handleClickSite = this.handleClickSite.bind(this);
    this.state = { propsKey: null, playMode: false };
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
    } = this.props;
    const {
      userKey,
      title,
      creator = {},
      richContent = [],
      address,
      memo,
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

    const { showSetting, commentType } = nowChannel;
    const showAuthor = showSetting
      ? showSetting.indexOf("author") === -1
        ? false
        : true
      : true;

    let images = [];
    for (let index = 0; index < richContent.length; index++) {
      const element = richContent[index];
      if (element.metaType === "image") {
        images.push(element);
      }
    }

    return (
      <div
        className={`app-content story-container ${inline ? "inline" : ""}`}
        style={{
          backgroundColor: inline ? "unset" : "#f5f5f5",
          overflow: this.state.playMode ? "hidden" : "auto",
          height: this.state.playMode ? "100%" : "unset",
        }}
      >
        {!loading ? (
          <div
            className="main-content story-content"
            style={{
              minHeight: `${window.innerHeight - 70}px`,
              backgroundColor: inline ? "unset" : "white",
              boxShadow: inline ? "unset" : "0 0 3px rgba(0, 0, 0, .1)",
            }}
          >
            <div className="story-head-title">
              <div className="story-title">{title}</div>
              <div className="story-head-info">
                <div className="story-head-other">
                  <div className="story-head-date">
                    {showAuthor
                      ? [
                          <i
                            key="story-head-avatar"
                            className="story-head-avatar"
                            style={{
                              backgroundImage: `url('${
                                avatar || "/image/icon/avatar.svg"
                              }')`,
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
                          </div>,
                        ]
                      : null}

                    <div className="story-card-time">
                      {moment( story.time || story.updateTime).format("l")}
                    </div>
                    <div className="story-card-number">{`阅读：${story.clickNumber}`}</div>
                  </div>
                </div>
                {/* {story.tag ? <div>标签：{story.tag}</div> : null} */}
                <div
                  className="story-station-channel"
                  onClick={this.handleClickSite}
                >
                  {`${story ? story.starName : ""} / ${
                    story.series ? story.series.name : ""
                  }`}
                </div>
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
            <span
              className="play-images"
              onClick={() => this.setState({ playMode: true })}
            >
              播放
            </span>
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
                              src={`${url}?imageView2/2/w/1400/`}
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
            <StoryAction />

            {!story.fatherAlbumKey && commentType === 2 ? <SubStory /> : null}
            {commentType === 1 ? <Comments /> : null}

            {!inline ? <Next /> : null}
          </div>
        ) : null}
        {user && user.isGuest && util.common.isMobile() ? <LoginTip /> : null}
        {this.state.playMode ? (
          <div className="carousel-wrapper">
            {images.length ? (
              <Swiper
                navigation
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
              >
                {images.map((content, index) => (
                  <SwiperSlide key={index} pagination={{ clickable: true }}>
                    <div
                      className="carousel-item"
                      style={{
                        backgroundImage: `url(${content.url}?imageView2/2/h/${window.innerHeight})`,
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : null}
            <Icon
              type="close"
              style={{
                color: "#FFF",
                fontSize: "18px",
                position: "absolute",
                top: "15px",
                right: "15px",
                zIndex: 999,
              }}
              onClick={() => this.setState({ playMode: false })}
            />
          </div>
        ) : null}
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
      nowStation,
      story,
      updateExif,
      channelInfo,
      statisticsStatusTag,
      nowStationKey,
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
          .then(function (posts) {
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
          .catch(function (reason) {
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

      // 微信分享
      const shareInfo = util.operation.getShareInfo(nowStation, "", story);
      if (shareInfo) {
        util.operation.initWechat(
          shareInfo.url,
          shareInfo.title,
          shareInfo.desc,
          shareInfo.imgUrl
        );
      }
    }
  }
}

export default connect(mapStateToProps, {
  getStoryDetail,
  updateExif,
  statisticsStatusTag,
})(Story);
