import React, { Component } from 'react';
import './PortalCatalog.css';
import Carousel from 'react_carousel_comp_xujie';
import util from '../../services/Util';
import { Button } from 'antd';
import { connect } from 'react-redux';
const mapStateToProps = state => ({
    nowStation: state.station.nowStation,
});

class Catalog extends Component {
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
        let tagList = tag.split(' ');

        return (
            <div className="portal-catalog">
                <div className="portal-title">
                    <div></div>
                    <span>{nowChannel.name}</span>
                </div>
                <div className="portal-catalog-container">
                    <Carousel>
                        {
                            tagList.map((tagItem, index) => (
                                <CatalogCover key={index} catalog={tagItem} />
                            ))
                        }
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    {}
)(Catalog);

class CatalogCover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scale: 1
        }
    }

    render() {
        const { catalog } = this.props;
        const { scale } = this.state;
        let obj;
        if (util.common.isJSON(catalog)) {
            obj = JSON.parse(catalog);
        } else {
            obj = { name: catalog }
        }

        return (
            <div className="catalog-container"
                onMouseEnter={() => this.setState({ scale: 1.2 })}
                onMouseLeave={() => this.setState({ scale: 1 })}
            >
                <div
                    className="catalog-cover"
                    style={{
                        backgroundImage: `url(${obj.logo})`,
                        transform: `scale(${scale})`
                    }}
                >
                </div >
                <div className="catalog-name">{obj.name}</div>
                <div className="catalog-shadow">
                    <div className="catalog-shadow-name">{obj.name}</div>
                    <div className="catalog-shadow-info">{obj.info}</div>
                    <Button className="catalog-shadow-button">立即查看</Button>
                </div>
            </div>
        )
    }
}