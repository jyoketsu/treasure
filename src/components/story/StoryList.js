import React, { Component } from "react";
import "./StoryList.css";
import { StoryLoading, StoryCard } from "./StoryCard";
import util from "../../services/Util";
import StoryEntry from "./StoryEntry";
import Waterfall from "react-waterfall-responsive";
import { connect } from "react-redux";
import { like } from "../../actions/app";

const mapStateToProps = state => ({
  userKey: state.auth.user ? state.auth.user._key : "",
  waiting: state.common.waiting,
  flag: state.common.flag,
  role: state.station.nowStation ? state.station.nowStation.role : null
});

class StoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnNum: null
    };
    this.setColumn = this.setColumn.bind(this);
  }

  render() {
    const {
      hideFoot,
      storyList,
      waiting,
      storyNumber,
      like,
      flag,
      userKey,
      showStyle,
      showSetting,
      role,
      showMore,
      handleCoverClick,
      showSiteName
    } = this.props;
    const { columnNum } = this.state;
    const isMobile = util.common.isMobile();

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
      if (showStyle === 2) {
        return (
          <StoryCard
            key={index}
            story={story}
            like={() => like(story._key)}
            showSetting={showSetting}
            width={290 + 5}
            height={height + 5}
          />
        );
      } else {
        return (
          <StoryEntry
            key={index}
            userKey={userKey}
            showSiteName={showSiteName}
            story={story}
            like={() => like(story._key)}
            showSetting={showSetting}
            role={role}
            inline={showStyle ? false : true}
            handleCoverClick={handleCoverClick}
          />
        );
      }
    });
    const foot =
      storyList.length !== 0 && storyList.length >= storyNumber ? (
        <div className="story-is-all">已加载全部</div>
      ) : storyList.length !== 0 ? (
        <div className="show-more-story" onClick={showMore}>
          查看更多
        </div>
      ) : null;
    return (
      <div className="story-list" ref="container">
        {columnNum &&
        children.length &&
        showStyle === 2 &&
        !isMobile &&
        this.refs.container.clientWidth >= 580 ? (
          <Waterfall columnNum={columnNum} gap={5}>
            {children}
          </Waterfall>
        ) : (
          children
        )}
        {waiting && flag !== "auditStory" ? <StoryLoading /> : null}

        {!hideFoot ? foot : null}

        {!waiting && storyList.length === 0 ? (
          <div className="story-is-all">没有内容</div>
        ) : null}
      </div>
    );
  }

  setColumn() {
    if (this.refs.container) {
      const containerWidth = this.refs.container.clientWidth;
      this.setState({
        columnNum: Math.floor(containerWidth / 290)
      });
    }
  }

  componentDidMount() {
    window.addEventListener(
      "resize",
      () => {
        this.setColumn();
      },
      false
    );
    this.setColumn();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setColumn);
  }
}

export default connect(mapStateToProps, { like })(StoryList);
