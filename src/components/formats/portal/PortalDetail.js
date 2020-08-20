import React, { Component } from "react";
import "./PortalDetail.css";
import util from "../../../services/Util";
import PortalArticle from "./PortalArticle";
import PortalArticleList from "./PortalArticleList";
import { connect } from "react-redux";
import {
  getStoryList,
  clearStoryList,
  setStoryList,
  asyncStart,
  asyncEnd,
} from "../../../actions/app";
const mapStateToProps = (state) => ({
  nowStation: state.station.nowStation,
  storyList: state.story.storyList,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder,
});

class PortalDetail extends Component {
  constructor(props) {
    super(props);
    this.perPage = 10;
    this.handleClickCatalog = this.handleClickCatalog.bind(this);
    this.getStoryList = this.getStoryList.bind(this);
  }

  async handleClickCatalog(tag) {
    const {
      history,
      match,
      nowStation,
      asyncStart,
      asyncEnd,
      setStoryList,
    } = this.props;
    const channelKey = match.params.id;
    asyncStart();
    const result = await util.operation.handleClickTag(
      nowStation._key,
      nowStation.domain,
      channelKey,
      tag.id
    );
    asyncEnd();
    if (result) {
      setStoryList(result.result, result.total, tag.id, "");
      history.push({
        pathname: `/${nowStation.domain}/home/detail/${channelKey}`,
        state: { tagId: tag.id, tagName: tag.name },
      });
    }
  }

  getStoryList(tagId) {
    const { nowStation, sortType, sortOrder, getStoryList, match } = this.props;
    const channelkey = match.params.id;
    sessionStorage.setItem("portal-curpage", 1);
    getStoryList(
      1,
      nowStation._key,
      null,
      channelkey,
      sortType,
      sortOrder,
      tagId,
      "",
      1,
      this.perPage
    );
  }

  render() {
    const { storyList, location, nowStation, match } = this.props;
    const { tagId, tagName } = location.state || {};
    const channelList = nowStation ? nowStation.seriesInfo : [];
    const channelkey = match.params.id;
    const articleKey = util.common.getSearchParamValue(location.search, "id");
    let nowChannel;
    for (let i = 0; i < channelList.length; i++) {
      if (channelList[i]._key === channelkey) {
        nowChannel = channelList[i];
        break;
      }
    }
    const { tag } = nowChannel;
    let tagList = tag.split(" ");
    return (
      <div className="portal-detail">
        <div
          className="portal-detail-head"
          style={{ backgroundImage: `url(${nowChannel.cover})` }}
        >
          <CatalogBanner
            channelName={nowChannel.name}
            stationLogo={
              nowStation && nowStation.logo !== null
                ? nowStation.logo
                : "/image/background/logo.svg"
            }
            tagId={tagId}
            tagName={tagName}
            cover={nowChannel.cover}
          />
          <CatalogList
            currentTagId={tagId}
            tagList={tagList}
            onClickCatalog={this.handleClickCatalog}
          />
        </div>
        <div className="portal-detail-content">
          {/* <CatalogTitle title={tagName} /> */}
          {articleKey ? (
            <PortalArticle id={articleKey} />
          ) : storyList.length === 1 ? (
            <PortalArticle id={storyList[0]._key} />
          ) : (
            <PortalArticleList />
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { location, storyList } = this.props;
    const { tagId } = location.state || {};
    if (!storyList.length) {
      this.getStoryList(tagId);
    }
  }

  componentWillUnmount() {
    this.props.clearStoryList();
  }
}

export default connect(mapStateToProps, {
  getStoryList,
  clearStoryList,
  setStoryList,
  asyncStart,
  asyncEnd,
})(PortalDetail);

class CatalogBanner extends Component {
  render() {
    const { channelName, stationLogo } = this.props;
    return (
      <div className="catalog-banner">
        <div className="channel-cover"></div>
        <div className="catalog-name-info">
          <div className="channel-catalog-name">
            <span>{channelName}</span>
          </div>
          <div
            className="channel-station-logo"
            style={{
              backgroundImage: `url(${stationLogo})`,
            }}
          ></div>
        </div>
      </div>
    );
  }
}

class CatalogList extends Component {
  render() {
    const { tagList, currentTagId, onClickCatalog } = this.props;
    return (
      <div className="catalog-list">
        {tagList.map((catalog, index) => (
          <CatalogItem
            key={index}
            currentTagId={currentTagId}
            catalog={catalog}
            onClick={onClickCatalog}
          />
        ))}
      </div>
    );
  }
}

class CatalogItem extends Component {
  render() {
    const { currentTagId, catalog, onClick } = this.props;
    let obj;
    if (util.common.isJSON(catalog)) {
      obj = JSON.parse(catalog);
    } else {
      obj = { id: catalog, name: catalog };
    }
    return (
      <div
        className={`catalog-item ${currentTagId === obj.id ? "active" : ""}`}
        onClick={() => onClick(obj)}
      >
        {obj.name}
      </div>
    );
  }
}
