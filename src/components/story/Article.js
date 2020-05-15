import React, { Component } from "react";
import "./Article.css";
import LoginTip from "../common/LoginTip";
import FroalaEditor from "../common/FroalaEditor";
import util from "../../services/Util";
import { connect } from "react-redux";
import { getStoryDetail } from "../../actions/app";
import lozad from "lozad";

const mapStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.user ? state.auth.user._key : null,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey,
  loading: state.common.loading,
  channelInfo: state.station.nowStation
    ? state.station.nowStation.seriesInfo
    : [],
});

class Article extends Component {
  handleToEdit() {
    const { history, location } = this.props;
    history.push(`editArticle${location.search}`);
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
      hideMenu,
      inline,
      loading,
      channelInfo,
    } = this.props;
    const { userKey } = story;
    const role = nowStation ? nowStation.role : 8;

    let str;
    if (story && story.content) {
      let regex = /<img src=/gi;
      str = story.content.replace(regex, "<img class='lozad' data-src=");
    }

    // 文章所在频道
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
    const { commentType } = nowChannel;

    return (
      <div
        className={`app-content story-container article-display  ${
          inline ? "inline" : ""
        }`}
        ref={(eidtStory) => (this.eidtStoryRef = eidtStory)}
      >
        <div
          className={`main-content story-content article-show ${
            hideMenu ? "hide-menu" : ""
          }`}
          style={{
            minHeight: `${window.innerHeight}px`,
          }}
        >
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
            ref={(node) => (this.editorRef = node)}
          >
            {!loading ? (
              <FroalaEditor
                previewMode={true}
                hideMenu={hideMenu}
                data={str}
                inline={inline}
                commentType={commentType}
                story={story}
              >
                <div
                  className="story-station-channel"
                  onClick={this.handleClickSite.bind(this)}
                >
                  {`${nowStation ? nowStation.name : ""} / ${
                    story.series ? story.series.name : ""
                  }`}
                </div>
              </FroalaEditor>
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

  componentDidUpdate(prevPros) {
    // lazy loads elements with default selector as '.lozad'
    const observer = lozad();
    observer.observe();
    const { nowStation, story } = this.props;
    const prevStoryKey = prevPros.story ? prevPros.story._key : null;
    // 获取到故事详情后
    if (prevStoryKey !== story._key) {
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

export default connect(mapStateToProps, { getStoryDetail })(Article);
