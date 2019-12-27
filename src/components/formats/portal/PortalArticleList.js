import React, { Component } from "react";
import "./PortalArticleList.css";
import { withRouter } from "react-router-dom";
import { StoryLoading } from "../../story/StoryCard";
import { Pagination } from "antd";
import { connect } from "react-redux";
import { getStoryList } from "../../../actions/app";
import Util from "../../../services/Util";
const mapStateToProps = state => ({
  nowStationKey: state.station.nowStationKey,
  storyList: state.story.storyList,
  storyNumber: state.story.storyNumber,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder,
  waiting: state.common.waiting
});

class PortalArticleList extends Component {
  constructor(props) {
    super(props);
    const sessionCurpage = sessionStorage.getItem("portal-curpage");
    this.perPage = 10;
    this.curPage = sessionCurpage ? parseInt(sessionCurpage, 10) : 1;
    this.viewArticle = this.viewArticle.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  viewArticle(story) {
    const { history, location } = this.props;
    const { tagId, tagName } = location.state;
    switch (story.type) {
      case 6:
      case 9:
        history.push({
          pathname: location.pathname,
          state: { tagId: tagId, tagName: tagName },
          search: `?id=${story._key}`
        });
        break;
      case 12:
        const token = localStorage.getItem("TOKEN");
        if (!Util.common.isMobile()) {
          window.open(
            `https://editor.qingtime.cn?token=${token}&key=${story._key}`,
            "_blank"
          );
        } else {
          window.location.href = `https://editor.qingtime.cn?token=${token}&key=${story._key}`;
        }
        break;
      case 15:
        if (story.openType === 1 && !Util.common.isMobile()) {
          window.open(story.url, "_blank");
        } else {
          window.location.href = story.url;
        }
        break;
      default:
        break;
    }
  }

  onChange = page => {
    const {
      location,
      match,
      sortType,
      sortOrder,
      nowStationKey,
      getStoryList
    } = this.props;
    const channelKey = match.params.id;
    const { tagName } = location.state;
    sessionStorage.setItem("portal-curpage", page);
    this.curPage = page;

    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
    }

    getStoryList(
      1,
      nowStationKey,
      null,
      channelKey,
      sortType,
      sortOrder,
      tagName,
      "",
      page,
      this.perPage,
      false,
      true
    );
  };

  render() {
    const { waiting, storyList, storyNumber } = this.props;
    return (
      <div className="portal-article">
        {waiting ? <StoryLoading /> : null}
        {storyList.length ? (
          storyList.map((story, index) => (
            <ArticleItem
              key={index}
              article={story}
              onClick={this.viewArticle}
            />
          ))
        ) : (
          <div className="no-portal-article">暂无内容</div>
        )}
        {storyList.length ? (
          <div className="portal-pagination-container">
            <Pagination
              current={this.curPage}
              pageSize={this.perPage}
              total={storyNumber}
              onChange={this.onChange}
            />
          </div>
        ) : null}
      </div>
    );
  }
  componentDidUpdate() {
    const sessionCurpage = sessionStorage.getItem("portal-curpage");
    this.curPage = sessionCurpage ? parseInt(sessionCurpage, 10) : 1;
  }
}

export default withRouter(
  connect(mapStateToProps, { getStoryList })(PortalArticleList)
);

class ArticleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1
    };
  }

  render() {
    const { article, onClick } = this.props;
    const { scale } = this.state;
    return (
      <div className="portal-article-item">
        <div
          className="portal-article-cover"
          onMouseEnter={() => this.setState({ scale: 1.2 })}
          onMouseLeave={() => this.setState({ scale: 1 })}
          onClick={() => onClick(article)}
        >
          <img
            src={article.cover || "/image/background/Bitmap@1x.png"}
            style={{
              transform: `scale(${scale})`
            }}
            alt="文章封面"
          />
        </div>
        <div className="portal-article-name" onClick={() => onClick(article)}>
          <h3>{article.title}</h3>
          <span>{article.descript || article.memo}</span>
        </div>
      </div>
    );
  }
}
