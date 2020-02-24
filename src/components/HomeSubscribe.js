import React, { Component } from "react";
import "./HomeSubscribe.css";
import StoryList from "./story/StoryList";
import util from "../services/Util";
import { connect } from "react-redux";

const mapStateToProps = state => ({
  storyList: state.story.storyList,
  storyNumber: state.story.storyNumber
});

class HomeSubscribe extends Component {
  render() {
    const { storyList, storyNumber } = this.props;
    return (
      <div className="home-subscribe">
        <div className="main-content">
          <StoryList storyList={storyList} storyNumber={storyNumber} />
        </div>
      </div>
    );
  }

  componentWillMount() {
    let tarStationName = util.common.getSearchParamValue(
      window.location.search,
      "station"
    );
    if (tarStationName) {
      document.title = tarStationName;
    } else {
      document.title = "当归";
    }
  }
}

export default connect(mapStateToProps, {})(HomeSubscribe);
