import React, { Component } from "react";
import "./PortalDetail.css";
import util from "../../../services/Util";
import PortalArticle from "./PortalArticle";
import PortalArticleList from "./PortalArticleList";
import { connect } from "react-redux";
import { getStoryList, clearStoryList } from "../../../actions/app";
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
      pathname: `/${stationDomain}/home/detail/${channelKey}`,
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
    const { tagId } = location.state;
    if (!storyList.length) {
      this.getStoryList(tagId);
    }
  }

  componentDidUpdate(prevProps) {
    const { storyList: prevStoryList } = prevProps;
    const { storyList, nowStation } = this.props;
    const prevStoryKey = prevStoryList[0] ? prevStoryList[0]._key : "";
    if (
      storyList.length === 1 &&
      (storyList[0].type === 12 || storyList[0].type === 15) &&
      storyList[0]._key !== prevStoryKey
    ) {
      this.jumpable = false;
      if (storyList[0].type === 12) {
        const token = localStorage.getItem("TOKEN");
        if (!util.common.isMobile()) {
          window.open(
            `https://editor.qingtime.cn?token=${token}&key=${storyList[0]._key}`,
            "_blank"
          );
        } else {
          window.location.href = `https://editor.qingtime.cn?token=${token}&key=${storyList[0]._key}`;
        }
      } else if (
        storyList[0].type === 15 &&
        storyList[0].openType === 1 &&
        !util.common.isMobile()
      ) {
        const token = localStorage.getItem("TOKEN");
        let url = storyList[0].url;
        if (
          storyList[0].url.includes("puku.qingtime.cn") ||
          storyList[0].url.includes("bless.qingtime.cn") ||
          storyList[0].url.includes("exp.qingtime.cn")
        ) {
          url = `${storyList[0].url}/${nowStation.domain}?token=${token}`;
        }
        window.open(url, "_blank");
      }
    }
  }

  componentWillUnmount() {
    this.props.clearStoryList();
  }
}

export default connect(mapStateToProps, {
  getStoryList,
  clearStoryList
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
