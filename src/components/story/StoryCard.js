import React, { Component } from "react";
import "./StoryCard.css";
import { withRouter } from "react-router-dom";
import util from "../../services/Util";
import { Spin, Modal, Tooltip } from "antd";
import { connect } from "react-redux";
import {
  deleteStory,
  switchEditLinkVisible,
  getStoryDetail,
  auditStory,
} from "../../actions/app";
const confirm = Modal.confirm;

const mapStateToProps = (state) => ({
  nowStation: state.station.nowStation,
  userKey: state.auth.user ? state.auth.user._key : "",
  role: state.station.nowStation ? state.station.nowStation.role : null,
  nowChannelKey: state.story.nowChannelKey,
  groupKey: state.station.nowStation
    ? state.station.nowStation.intimateGroupKey
    : null,
});

class Card extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.handleEditLink = this.handleEditLink.bind(this);
  }

  handleClick(story) {
    const { _key, type, openType, url } = story;
    const { history, match, nowStation } = this.props;
    const token = localStorage.getItem("TOKEN");
    switch (type) {
      case 12:
        window.open(
          `https://editor.qingtime.cn?token=${token}&key=${_key}`,
          "_blank"
        );
        break;
      case 15: {
        let targetUri = url;
        if (
          targetUri.includes("puku.qingtime.cn") ||
          targetUri.includes("bless.qingtime.cn") ||
          targetUri.includes("exp.qingtime.cn")
        ) {
          if (targetUri.includes("puku.qingtime.cn")) {
            targetUri = `${url}/${nowStation.domain}/genealogySearch?token=${token}`;
          } else {
            targetUri = `${url}/${nowStation.domain}?token=${token}`;
          }
        }
        if (url.includes("treesite.qingtime.cn")) {
          targetUri = `https://treesite.qingtime.cn/login?token=${token}`;
        }

        if (openType === 1) {
          window.open(targetUri, "_blank");
        } else {
          window.location.href = targetUri;
        }
        break;
      }
      default: {
        const path = type === 9 ? "article" : "story";
        history.push({
          pathname: `/${match.params.id}/${path}`,
          search: `?key=${_key}`,
        });
        break;
      }
    }
  }

  deletePage(e) {
    e.stopPropagation();
    const { deleteStory, story } = this.props;
    confirm({
      title: "删除",
      content: `确定要删除吗？`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteStory(story._key);
      },
    });
  }

  handleEditLink(e) {
    e.stopPropagation();
    const { story, getStoryDetail, switchEditLinkVisible } = this.props;
    getStoryDetail(story._key);
    switchEditLinkVisible();
  }

  render() {
    const {
      story,
      userKey,
      showSetting,
      height,
      role,
      inline,
      nowChannelKey,
      handleCoverClick,
      auditStory,
      groupKey,
      nowStation,
    } = this.props;
    const isMyStory = userKey === story.userKey ? true : false;
    const isMobile = util.common.isMobile() ? "mobile" : "desktop";
    // 卡片所在的频道
    const storyChannel = nowStation.seriesInfo.find(
      (series) => series._key === story.series._key
    );
    const noThumbnail = storyChannel.noThumbnail;

    // 显示项目设定
    const showAuthor = showSetting
      ? showSetting.indexOf("author") === -1
        ? false
        : true
      : true;
    const showTitle = showSetting
      ? showSetting.indexOf("title") === -1
        ? false
        : true
      : true;
    const showLike = showSetting
      ? showSetting.indexOf("like") === -1
        ? false
        : true
      : true;
    const showClickNumber = showSetting
      ? showSetting.indexOf("clickNumber") === -1
        ? false
        : true
      : true;
    const showDate = showSetting
      ? showSetting.indexOf("date") === -1
        ? false
        : true
      : true;

    let avatar = (story.creator && story.creator.avatar) || "";
    let name = story.creator && story.creator.name ? story.creator.name : "";
    let coverUrl = story.cover
      ? story.cover.indexOf("cdn-icare.qingtime.cn") !== -1
        ? story.cover.indexOf("vframe") === -1
          ? noThumbnail
            ? story.cover
            : `${story.cover}?imageView2/2/w/576/`
          : story.cover
        : story.cover
      : "/image/icon/icon-article.svg";
    let coverStyle = {
      backgroundImage: `url('${coverUrl}')`,
      backgroundSize: story.cover ? "cover" : "30%",
      height: `${height - 85}px`,
    };
    let storyType =
      story.type === 6 ? "story" : story.type === 9 ? "article" : "page";
    let status = "";
    let statusStyle = {};

    // 审核状态
    if (!inline && (isMyStory || (role && role < 3))) {
      switch (story.pass) {
        case 1:
          status = "待审核";
          statusStyle = { color: "#9F353A", marginRight: "5px" };
          break;
        // case 2:
        //   status = "审核通过";
        //   statusStyle = { color: "#7BA23F", marginRight: "5px" };
        //   break;
        case 3:
          status = "审核不通过";
          statusStyle = { color: "#CB1B45", marginRight: "5px" };
          break;
        default:
          break;
      }
    }

    return (
      <div className={`story-card type-${storyType}`}>
        <div
          className="story-card-cover"
          style={coverStyle}
          onClick={
            handleCoverClick
              ? handleCoverClick.bind(this, story._key)
              : this.handleClick.bind(this, story)
          }
        >
          {
            // 图片数量
            story.type === 6 ? (
              <span className="picture-count">
                <i className="picture-count-icon"></i>
                <span>{story.pictureCount}</span>
              </span>
            ) : null
          }
          <div
            className="story-card-mask"
            style={{ height: `${height - 85}px` }}
          ></div>
        </div>
        <div
          className="story-card-title"
          onClick={
            handleCoverClick
              ? handleCoverClick.bind(this, story._key)
              : this.handleClick.bind(this, story)
          }
        >
          {showTitle ? (
            <span className="story-card-title-span">{story.title}</span>
          ) : null}

          <div>
            {status && !inline && role < 3 ? (
              <Tooltip title="点击快速通过" placement="bottom">
                <span
                  style={statusStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    auditStory(story._key, groupKey, 2, true);
                  }}
                >
                  {status}
                </span>
              </Tooltip>
            ) : (
              <span style={statusStyle}>{status}</span>
            )}

            {showDate ? (
              <span className="story-card-time">
                {util.common.timestamp2DataStr(
                  story.time || story.updateTime,
                  "yyyy-MM-dd"
                )}
              </span>
            ) : null}
          </div>
        </div>
        <div className="story-card-info">
          {nowChannelKey === "allSeries" ? (
            <div>
              <span className="story-card-name">{story.series.name}</span>
            </div>
          ) : showAuthor ? (
            <div className="story-card-user">
              <i
                className="story-card-avatar"
                style={{
                  backgroundImage: `url('${
                    avatar || "/image/icon/avatar.svg"
                  }?imageView2/1/w/60/h/60')`,
                }}
                onClick={() =>
                  (window.location.href = `https://baoku.qingtime.cn/${story.creator.domain}/home`)
                }
              ></i>
              <span
                className="story-card-name"
                onClick={() =>
                  (window.location.href = `https://baoku.qingtime.cn/${story.creator.domain}/home`)
                }
              >{`${name}${
                story.creator && story.creator.relationDesc
                  ? `（${story.creator.relationDesc}）`
                  : ""
              }`}</span>
            </div>
          ) : null}
          <div>
            {showClickNumber ? (
              <span className="story-card-record">
                <i
                  className="story-card-icon"
                  style={{
                    backgroundImage: "url(/image/icon/readNum.svg)",
                    width: "18px",
                  }}
                ></i>
                <span>{story.clickNumber || 1}</span>
              </span>
            ) : null}
            {showLike ? (
              <span className="story-card-record story-like">
                <i
                  className="story-card-icon"
                  onClick={() => this.props.like()}
                  style={{
                    backgroundImage: `url(/image/icon/${
                      story.islike ? "like" : "like2"
                    }.svg)`,
                  }}
                ></i>
                <span>{story.likeNumber}</span>
              </span>
            ) : null}
          </div>
        </div>
        <div className="right-area">
          {!inline &&
          story.type === 15 &&
          (isMyStory || (role && role <= 3)) ? (
            <span
              className={`card-link ${isMobile}`}
              onClick={this.handleEditLink}
            >
              编辑
            </span>
          ) : null}
          {!inline &&
          (story.type === 12 || story.type === 15) &&
          (isMyStory || (role && role <= 3)) ? (
            <span className={`card-link ${isMobile}`} onClick={this.deletePage}>
              删除
            </span>
          ) : null}
          {story.statusTag ? (
            <span className="cover-status">{story.statusTag}</span>
          ) : null}
        </div>
      </div>
    );
  }
}

class StoryLoading extends Component {
  render() {
    return (
      <div className="story-loading">
        <Spin size="large" />
      </div>
    );
  }
}
const StoryCard = withRouter(
  connect(mapStateToProps, {
    deleteStory,
    switchEditLinkVisible,
    getStoryDetail,
    auditStory,
  })(Card)
);

export { StoryCard, StoryLoading };
