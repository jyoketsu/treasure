import React, { Component } from 'react';
import './PortalDetail.css';
import util from '../../services/Util';
import CatalogTitle from './CatalogTitle';
import PortalArticle from './PortalArticle';
import PortalArticleList from './PortalArticleList';
import { connect } from 'react-redux';
import { getStoryList, } from '../../actions/app';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
    storyList: state.story.storyList,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
});

class PortalDetail extends Component {
    constructor(props) {
        super(props);
        this.perPage = 10;
    }

    render() {
        const { storyList, location, nowStation, match } = this.props;
        const { tagName } = location.state;
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
        let tagList = tag.split(' ');
        return (
            <div className="portal-detail">
                <div className="portal-detail-head">
                    <CatalogBanner
                        channelName={nowChannel.name}
                        stationLogo={
                            nowStation && nowStation.logo !== null
                                ? nowStation.logo
                                : '/image/background/logo.svg'}
                        tagName={tagName}
                    />
                    <CatalogList tagList={tagList} />
                </div>
                <div className="portal-detail-content">
                    <CatalogTitle title={tagName} />
                    {
                        storyList.length === 1
                            ? <PortalArticle id={storyList[0]._key} />
                            : <PortalArticleList />
                    }
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { nowStation, sortType, sortOrder, getStoryList, match, location, } = this.props;
        const channelkey = match.params.id;
        const { tagName } = location.state;
        getStoryList(
            1,
            nowStation._key,
            null,
            channelkey,
            sortType,
            sortOrder,
            tagName,
            '',
            1,
            this.perPage
        );
    }
}

export default connect(
    mapStateToProps,
    { getStoryList }
)(PortalDetail);

class CatalogBanner extends Component {
    render() {
        const { channelName, stationLogo, tagName } = this.props;
        return (
            <div className="catalog-banner">
                <div className="catalog-name-info">
                    <div className="channel-catalog-name">
                        <span>{channelName}</span>
                        <span>{tagName}</span>
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
        const { tagList } = this.props;
        return (
            <div className="catalog-list">
                {
                    tagList.map((catalog, index) => (
                        <CatalogItem key={index} catalog={catalog} />
                    ))
                }
            </div>
        );
    }
}

class CatalogItem extends Component {
    render() {
        const { catalog } = this.props;
        let obj;
        if (util.common.isJSON(catalog)) {
            obj = JSON.parse(catalog);
        } else {
            obj = { name: catalog }
        }
        return (
            <div className="catalog-item">{obj.name}</div>
        );
    }
}
