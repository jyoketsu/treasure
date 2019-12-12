import React, { Component } from "react";
import Story from "../../story/Story";
import Article from "../../story/Article";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getStoryDetail, switchEditLinkVisible } from "../../../actions/app";
const mapStateToProps = state => ({
  user: state.auth.user,
  userId: state.auth.user ? state.auth.user._key : null,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey
});

class PortalArticle extends Component {
  render() {
    const { userId, story, nowStationKey, nowStation } = this.props;
    const { userKey } = story;
    const role = nowStation ? nowStation.role : 8;
    const token = localStorage.getItem("TOKEN");
    let content;
    switch (story.type) {
      case 6:
        content = <Story readOnly={true} inline={true} />;
        break;
      case 9:
        content = <Article readOnly={true} inline={true} />;
        break;
      case 15:
        if (story.openType === 2) {
          content = (
            <iframe
              title={story.title}
              src={
                story.url.includes("puku.qingtime.cn") ||
                story.url.includes("bless.qingtime.cn") ||
                story.url.includes("exp.qingtime.cn")
                  ? `${story.url}/${nowStation.domain}?token=${token}`
                  : story.url
              }
              frameBorder="0"
              width="100%"
              height={document.body.clientHeight}
            ></iframe>
          );
        }
        break;
      default:
        break;
    }
    return (
      <div className={`portal-article ${story.type === 15 ? "link" : ""}`}>
        {content}
        {(userId === userKey || (role && role <= 3)) &&
        nowStationKey !== "all" ? (
          <span
            className="catalog-title-edit"
            onClick={this.handleClick.bind(this)}
          >
            编辑
          </span>
        ) : null}
      </div>
    );
  }

  componentDidMount() {
    const { getStoryDetail, id } = this.props;
    getStoryDetail(id);
  }

  componentDidUpdate(prevProps) {
    const { getStoryDetail, id } = this.props;
    if (id !== prevProps.id) {
      getStoryDetail(id);
    }
  }

  handleClick() {
    const { history, match, story, switchEditLinkVisible } = this.props;
    const { _key, type } = story;
    switch (type) {
      case 12:
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&key=${_key}`,
          "_blank"
        );
        break;
      case 15:
        switchEditLinkVisible();
        break;
      default: {
        const path = type === 9 ? "editArticle" : "editStory";
        history.push({
          pathname: `/${match.params.id}/${path}`,
          search: `?key=${_key}`
        });
        break;
      }
    }
  }
}

export default withRouter(
  connect(mapStateToProps, { getStoryDetail, switchEditLinkVisible })(
    PortalArticle
  )
);
