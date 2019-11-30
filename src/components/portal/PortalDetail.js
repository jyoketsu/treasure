import React, { Component } from "react";
import "./PortalDetail.css";
import util from "../../services/Util";
import CatalogTitle from "./CatalogTitle";
import PortalArticle from "./PortalArticle";
import PortalArticleList from "./PortalArticleList";
import { connect } from "react-redux";
import { getStoryList } from "../../actions/app";
const mapStateToProps = state => ({
  nowStation: state.station.nowStation,
  storyList: state.story.storyList,
  sortType: state.story.sortType,
  sortOrder: state.story.sortOrder
});

class PortalDetail extends Component {
  constructor(props) {
    super(props);
    this.perPage = 10;
    this.handleClickCatalog = this.handleClickCatalog.bind(this);
    this.getStoryList = this.getStoryList.bind(this);
  }

  handleClickCatalog(tag) {
    const { location, history, match } = this.props;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    const channelKey = match.params.id;
    this.getStoryList(tag.id);
    history.push({
      pathname: `/${stationDomain}/detail/${channelKey}`,
      state: { tagId: tag.id, tagName: tag.name }
    });
    this.jumpable = true;
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
    const { tagId, tagName } = location.state;
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
            tagList={tagList}
            onClickCatalog={this.handleClickCatalog}
          />
        </div>
        <div className="portal-detail-content">
          <CatalogTitle title={tagName} />
          {articleKey ? (
            <PortalArticle id={articleKey} />
          ) : storyList.length === 1 ? (
            storyList[0].type === 12 ||
            (storyList[0].type === 15 && storyList[0].openType === 1) ? null : (
              <PortalArticle id={storyList[0]._key} />
            )
          ) : (
            <PortalArticleList />
          )}
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { location } = this.props;
    const { tagId } = location.state;
    this.getStoryList(tagId);
  }

  componentDidUpdate(prevProps) {
    const { storyList: prevStoryList } = prevProps;
    const { storyList } = this.props;
    if (
      storyList.length === 1 &&
      (storyList[0].type === 12 || storyList[0].type === 15) &&
      prevStoryList[0] &&
      storyList[0]._key !== prevStoryList[0]._key
    ) {
      this.jumpable = false;
      if (storyList[0].type === 12) {
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&key=${storyList[0]._key}`,
          "_blank"
        );
      } else {
        window.open(storyList[0].url, "_blank");
      }
    }
  }
}

export default connect(mapStateToProps, { getStoryList })(PortalDetail);

class CatalogBanner extends Component {
  render() {
    const {
      channelName,
      stationLogo,
      tagName
      // cover
    } = this.props;
    return (
      <div className="catalog-banner">
        <div
          className="channel-cover"
          // style={{ backgroundImage: `url(${cover})` }}
        ></div>
        <div className="catalog-name-info">
          <div className="channel-catalog-name">
            <span>{channelName}</span>
            <span>{tagName}</span>
          </div>
          <div
            className="channel-station-logo"
            style={{
              backgroundImage: `url(${stationLogo})`
            }}
          ></div>
        </div>
      </div>
    );
  }
}

class CatalogList extends Component {
  render() {
    const { tagList, onClickCatalog } = this.props;
    return (
      <div className="catalog-list">
        {tagList.map((catalog, index) => (
          <CatalogItem key={index} catalog={catalog} onClick={onClickCatalog} />
        ))}
      </div>
    );
  }
}

class CatalogItem extends Component {
  render() {
    const { catalog, onClick } = this.props;
    let obj;
    if (util.common.isJSON(catalog)) {
      obj = JSON.parse(catalog);
    } else {
      obj = { id: catalog, name: catalog };
    }
    return (
      <div className="catalog-item" onClick={() => onClick(obj)}>
        {obj.name}
      </div>
    );
  }
}
