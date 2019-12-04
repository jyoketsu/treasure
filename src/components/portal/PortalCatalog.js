import React, { Component } from "react";
import "./PortalCatalog.css";
import Carousel from "react_carousel_comp_xujie";
import util from "../../services/Util";
import { Button } from "antd";
import { connect } from "react-redux";
const mapStateToProps = state => ({
  nowStation: state.station.nowStation
});

class Catalog extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(tag) {
    const { location, history, match } = this.props;
    const pathname = location.pathname;
    const stationDomain = pathname.split("/")[1];
    const channelKey = match.params.id;
    history.push({
      pathname: `/${stationDomain}/home/detail/${channelKey}`,
      state: { tagId: tag.id, tagName: tag.name }
    });
  }

  render() {
    const { nowStation, match } = this.props;
    const channelList = nowStation ? nowStation.seriesInfo : [];
    const channelkey = match.params.id;
    let nowChannel;
    for (let i = 0; i < channelList.length; i++) {
      if (channelList[i]._key === channelkey) {
        nowChannel = channelList[i];
        break;
      }
    }

    const { tag } = nowChannel;
    let tagList = tag ? tag.split(" ") : [];

    return (
      <div className="portal-catalog">
        <div className="portal-title">
          <div></div>
          <span>{nowChannel.name}</span>
        </div>
        <div className="portal-catalog-container">
          {tagList.length ? (
            <Carousel>
              {tagList.map((tagItem, index) => (
                <CatalogCover
                  key={index}
                  catalog={tagItem}
                  onClick={this.handleClick}
                />
              ))}
            </Carousel>
          ) : (
            <div className="no-tag">暂无内容</div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(Catalog);

class CatalogCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: 1
    };
  }

  render() {
    const { catalog, onClick } = this.props;
    const { scale } = this.state;
    let obj;
    if (util.common.isJSON(catalog)) {
      obj = JSON.parse(catalog);
    } else {
      obj = { id: catalog, name: catalog };
    }

    return (
      <div
        className="catalog-container"
        onMouseEnter={() => this.setState({ scale: 1.2 })}
        onMouseLeave={() => this.setState({ scale: 1 })}
      >
        <div
          className="catalog-cover"
          style={{
            backgroundImage: `url(${obj.logo})`,
            transform: `scale(${scale})`
          }}
        ></div>
        <div className="catalog-name">{obj.name}</div>
        <div className="catalog-shadow">
          <div className="catalog-shadow-name">{obj.name}</div>
          <div className="catalog-shadow-info">{obj.info}</div>
          <Button
            className="catalog-shadow-button"
            onClick={() => onClick(obj)}
          >
            立即查看
          </Button>
        </div>
      </div>
    );
  }
}
