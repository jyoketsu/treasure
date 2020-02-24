import React, { Component } from "react";
import "./MemberStoryList.css";
import StoryList from "../story/StoryList";
import util from "../../services/Util";
import { connect } from "react-redux";
import { getStoryList, readyToRefresh } from "../../actions/app";

const mapStateToProps = state => ({
  nowStationKey: state.station.nowStationKey,
  searchUserList: state.station.searchUserList,
  userList: state.station.userList,
  groupKey: state.station.nowStation
    ? state.station.nowStation.fansGroupKey
    : null,
  waiting: state.common.waiting,
  storyList: state.story.storyList,
  storyNumber: state.story.storyNumber,
  nowStoryNumber: state.story.storyList.length
});

class MemberStoryList extends Component {
  constructor(props) {
    super(props);
    this.curPage = this.curPage = sessionStorage.getItem("member-story-curpage")
      ? parseInt(sessionStorage.getItem("member-story-curpage"), 10)
      : 1;
    this.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.showMore = this.showMore.bind(this);
    this.perPage = 30;
    this.sortType = 1;
    this.sortOrder = 1;
    this.type = 11;
  }
  render() {
    const { storyList, storyNumber } = this.props;
    return (
      <div className="member-story-list">
        <StoryList
          showMore={this.showMore}
          storyList={storyList}
          storyNumber={storyNumber}
        />
      </div>
    );
  }

  // 滚动查看更多故事
  handleMouseWheel(e) {
    const {
      nowStationKey,
      getStoryList,
      waiting,
      nowStoryNumber,
      storyNumber
    } = this.props;

    let top = document.body.scrollTop || document.documentElement.scrollTop;
    if (
      nowStoryNumber < storyNumber &&
      !waiting &&
      top + document.body.clientHeight === document.body.scrollHeight
    ) {
      this.curPage++;
      getStoryList(
        this.type,
        nowStationKey,
        this.userId,
        "allSeries",
        this.sortType,
        this.sortOrder,
        "",
        "",
        this.curPage,
        this.perPage
      );
    }
  }

  showMore() {
    const { nowStationKey, getStoryList } = this.props;

    this.curPage++;
    getStoryList(
      this.type,
      nowStationKey,
      this.userId,
      "allSeries",
      this.sortType,
      this.sortOrder,
      "",
      "",
      this.curPage,
      this.perPage
    );
  }

  componentDidMount() {
    const {
      nowStationKey,
      getStoryList,
      location,
      readyToRefresh,
      storyNumber
    } = this.props;
    this.userId = util.common.getSearchParamValue(location.search, "key");
    if (!storyNumber) {
      readyToRefresh();
      this.curPage = 1;
      sessionStorage.setItem("member-story-curpage", this.curPage);
      getStoryList(
        this.type,
        nowStationKey,
        this.userId,
        "allSeries",
        this.sortType,
        this.sortOrder,
        "",
        "",
        this.curPage,
        this.perPage
      );
    }

    // 监听滚动，查看更多
    document.body.addEventListener("wheel", this.handleMouseWheel);
  }

  componentWillUnmount() {
    // 移除滚动事件
    document.body.removeEventListener("wheel", this.handleMouseWheel);
    let top = document.body.scrollTop || document.documentElement.scrollTop;
    sessionStorage.setItem("member-story-scroll", top);
    sessionStorage.setItem("member-story-curpage", this.curPage);
  }
}

export default connect(mapStateToProps, { getStoryList, readyToRefresh })(
  MemberStoryList
);
