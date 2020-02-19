import React, { Component } from "react";
import "./StoryEntry.css";
import { withRouter } from "react-router-dom";
import util from "../../services/Util";
import { Modal } from "antd";
import { connect } from "react-redux";
import {
  deleteStory,
  switchEditLinkVisible,
  getStoryDetail
} from "../../actions/app";
const confirm = Modal.confirm;

const mapStateToProps = state => ({
  userKey: state.auth.user ? state.auth.user._key : "",
  role: state.station.nowStation ? state.station.nowStation.role : null
});

class StoryEntry extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.deletePage = this.deletePage.bind(this);
    this.handleEditLink = this.handleEditLink.bind(this);
  }

  handleClick(story) {
    const { _key, type, openType, url } = story;
    const { history, match } = this.props;
    switch (type) {
      case 12:
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&key=${_key}`,
          "_blank"
        );
        break;
      case 15:
        if (openType === 1) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
        break;
      default: {
        const path = type === 9 ? "article" : "story";
        history.push({
          pathname: `/${match.params.id}/${path}`,
          search: `?key=${_key}`
        });
        break;
      }
    }
  }

  handleEditLink(e) {
    e.stopPropagation();
    const { story, getStoryDetail, switchEditLinkVisible } = this.props;
    getStoryDetail(story._key);
    switchEditLinkVisible();
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
      }
    });
  }

  render() {
    const { story, userKey, role, showSetting, handleCoverClick } = this.props;
    const isMyStory = userKey === story.userKey ? true : false;
    const isMobile = util.common.isMobile() ? "mobile" : "desktop";
    let avatar = (story.creator && story.creator.avatar) || "";
    let name = story.creator ? story.creator.name : "";
    let coverUrl = story.cover
      ? story.cover.indexOf("cdn-icare.qingtime.cn") !== -1
        ? story.cover.indexOf("vframe") === -1
          ? `${story.cover}?imageView2/2/w/576/`
          : story.cover
        : story.cover
      : "/image/icon/icon-article.svg";
    let coverStyle = {
      backgroundImage: `url('${coverUrl}')`,
      backgroundSize: story.cover ? "cover" : "30%"
    };
    let storyType =
      story.type === 6 ? "story" : story.type === 9 ? "article" : null;
    let status = "";
    let statusStyle = {};
    if (isMyStory && role && role > 2) {
      switch (story.pass) {
        case 1:
          status = "待审核";
          statusStyle = { color: "#9F353A" };
          break;
        case 2:
          status = "审核通过";
          statusStyle = { color: "#7BA23F" };
          break;
        case 3:
          status = "审核不通过";
          statusStyle = { color: "#CB1B45" };
          break;
        default:
          break;
      }
    }

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

    return (
      <div className={`story-entry type-${storyType}`}>
        <div
          className="story-entry-cover"
          style={coverStyle}
          onClick={
            handleCoverClick
              ? handleCoverClick.bind(this, story._key)
              : this.handleClick.bind(this, story)
          }
        ></div>
        <div className="story-entry-info">
          <div
            className="story-entry-title"
            onClick={
              handleCoverClick
                ? handleCoverClick.bind(this, story._key)
                : this.handleClick.bind(this, story)
            }
          >
            {showTitle ? (
              <span className="story-entry-title-span">{story.title}</span>
            ) : null}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {story.type === 15 && (isMyStory || (role && role <= 3)) ? (
                <span
                  className={`card-link ${isMobile}`}
                  onClick={this.handleEditLink}
                >
                  编辑
                </span>
              ) : null}
              {(story.type === 12 || story.type === 15) &&
              (isMyStory || (role && role <= 3)) ? (
                <span
                  className={`card-link ${isMobile}`}
                  onClick={this.deletePage}
                >
                  删除
                </span>
              ) : null}
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

          <div className="story-entry-memo">{story.memo}</div>

          <div className="story-entry-stat">
            {showAuthor ? (
              <div
                className="story-card-user"
                onClick={() =>
                  (window.location.href = `https://baoku.qingtime.cn/${story.creator.domain}/home`)
                }
              >
                <i
                  className="story-card-avatar"
                  style={{
                    backgroundImage: `url('${avatar ||
                      "/image/icon/avatar.svg"}?imageView2/1/w/60/h/60')`
                  }}
                ></i>
                <span className="story-card-name">{`${name}${
                  story.creator && story.creator.relationDesc
                    ? `（${story.creator.relationDesc}）`
                    : ""
                }`}</span>
              </div>
            ) : null}
            <div>
              <span style={statusStyle}>{status}</span>
              {showClickNumber ? (
                <span className="story-card-record">
                  <i
                    className="story-card-icon"
                    style={{
                      backgroundImage: "url(/image/icon/readNum.svg)",
                      width: "18px"
                    }}
                  ></i>
                  <span>{story.clickNumber}</span>
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
                      }.svg)`
                    }}
                  ></i>
                  <span>{story.likeNumber}</span>
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, {
    deleteStory,
    switchEditLinkVisible,
    getStoryDetail
  })(StoryEntry)
);
