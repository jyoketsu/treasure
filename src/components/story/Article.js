import React, { Component } from "react";
import "./Article.css";
import LoginTip from "../common/LoginTip";
import FroalaEditor from "../common/FroalaEditor";
import util from "../../services/Util";
import { connect } from "react-redux";
import { getStoryDetail } from "../../actions/app";
import lozad from "lozad";

const mapStateToProps = state => ({
  user: state.auth.user,
  userId: state.auth.user ? state.auth.user._key : null,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey,
  loading: state.common.loading
});

class Article extends Component {
  handleToEdit() {
    const { history, location } = this.props;
    history.push(`editArticle${location.search}`);
  }

  render() {
    const {
      user,
      story,
      userId,
      nowStationKey,
      nowStation,
      readOnly,
      hideMenu,
      inline,
      loading
    } = this.props;
    const { userKey, title, creator = {} } = story;
    const role = nowStation ? nowStation.role : 8;
    let avatar = creator.avatar
      ? `${creator.avatar}?imageView2/1/w/160/h/160`
      : "/image/icon/avatar.svg";

    let str;
    if (story && story.content) {
      let regex = /<img src=/gi;
      str = story.content.replace(regex, "<img class='lozad' data-src=");
    }

    return (
      <div
        className={`app-content story-container article-display  ${
          inline ? "inline" : ""
        }`}
        ref={eidtStory => (this.eidtStoryRef = eidtStory)}
      >
        <div
          className={`main-content story-content article-show ${
            hideMenu ? "hide-menu" : ""
          }`}
          style={{
            minHeight: `${window.innerHeight - 70}px`
          }}
        >
          <div className="story-head-title" style={{ border: "unset" }}>
            <div className="story-title">{title}</div>
            <div className="story-head-info">
              <div className="story-head-other">
                <div>频道：{story.series ? story.series.name : ""}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <i
                    className="story-head-avatar"
                    style={{
                      backgroundImage: `url('${avatar ||
                        "/image/icon/avatar.svg"}')`
                    }}
                  ></i>
                  <div className="story-card-name">{creator.name}</div>
                  <div className="story-card-time">
                    {util.common.timestamp2DataStr(
                      story.updateTime,
                      "yyyy-MM-dd"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {!readOnly &&
          (userId === userKey || (role && role <= 3)) &&
          nowStationKey !== "all" ? (
            <span
              className="to-edit-story"
              onClick={this.handleToEdit.bind(this)}
            >
              编辑
            </span>
          ) : null}
          <div
            className="editor-container"
            ref={node => (this.editorRef = node)}
          >
            {!loading ? (
              <FroalaEditor previewMode={true} hideMenu={hideMenu} data={str} />
            ) : null}
          </div>
        </div>
        {user && user.isGuest && util.common.isMobile() ? <LoginTip /> : null}
      </div>
    );
  }

  componentDidMount() {
    const { location, getStoryDetail, story } = this.props;
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }

    if (location) {
      let storyKey = util.common.getSearchParamValue(location.search, "key");
      if (storyKey) {
        getStoryDetail(storyKey);
      }
    }

    if (story) {
      const observer = lozad();
      observer.observe();
    }
  }

  componentDidUpdate() {
    // lazy loads elements with default selector as '.lozad'
    const observer = lozad();
    observer.observe();
  }
}

export default connect(mapStateToProps, { getStoryDetail })(Article);
