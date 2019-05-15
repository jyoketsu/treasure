import React, { Component } from 'react';
import './Home.css';
import { connect } from 'react-redux';
import { getStationList, changeStation, getStationDetail, getStoryList } from '../actions/app';

const mapStateToProps = state => ({
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    stationMap: state.station.stationMap,
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { changeStation, getStoryList, stationList, nowStationKey, stationMap, history } = this.props;
        return (
            <div className="homepage">
                <div className="station-list">
                    <div
                        className={`station-item ${nowStationKey === 'all' ? 'selected' : ''}`}
                        onClick={changeStation.bind(this, 'all')}
                    >
                        全部
                    </div>
                    {
                        stationList.map((station, index) => (
                            <div
                                key={index}
                                className={`station-item ${nowStationKey === station.starKey ? 'selected' : ''}`}
                                onClick={changeStation.bind(this, station.starKey)}
                            >
                                {station.starName}
                            </div>
                        ))
                    }
                    <div className={`station-item`}>查看所有</div>
                </div>
                {
                    nowStationKey !== 'all' ?
                        <Station
                            content={stationMap[nowStationKey]}
                            getStoryList={getStoryList}
                            history={history}
                        /> :
                        '订阅'
                }
            </div>
        );
    };

    componentDidMount() {
        const { getStationList, stationList } = this.props;
        if (stationList.length === 0) {
            getStationList();
        }
    }

    componentDidUpdate(prevProps) {
        const { nowStationKey, stationMap, getStationDetail, } = this.props;
        // 切换微站时
        if (nowStationKey !== prevProps.nowStationKey) {
            if (!stationMap[nowStationKey]) {
                if (nowStationKey !== 'all') {
                    getStationDetail(nowStationKey);
                } else {
                    console.log('订阅');
                }
            }
        }
    }
}

class Station extends React.Component {
    handleClickAdd() {
        const { history } = this.props;
        history.push('/story');
    }

    render() {
        const { content = {} } = this.props;
        const { starInfo = {}, seriesInfo = [] } = content;
        return (
            <div className="station-home">
                <div
                    className="station-cover"
                    style={{ backgroundImage: `url(${starInfo.cover})` }}
                ></div>
                <div className="main-content">
                    <span className="station-name">{starInfo.name}</span>
                    <div className="station-memo">
                        <span className="station-memo-title">概述</span>
                        <pre>{starInfo.memo}</pre>
                    </div>
                    <div className="series-container">
                        <div className="series-tabs">
                            {seriesInfo.map((serie, index) => (
                                <div key={index}>{serie.seriesName}</div>
                            ))}
                        </div>
                        <div className="stories"></div>
                    </div>
                </div>
                <div className="operation-panel">
                    <div className="share-station">分享</div>
                    <div className="add-story" onClick={this.handleClickAdd.bind(this)}>添加</div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const { content = {}, getStoryList } = this.props;
        const { starInfo = {}, seriesInfo = [] } = content;

        const { content: prevContent = {} } = prevProps;
        const { starInfo: prevStarInfo = {} } = prevContent;

        if (starInfo._key !== prevStarInfo._key) {
            console.log('切换了微站', starInfo._key);
            // 获取第一个专辑的故事
            if (seriesInfo[0]) {
                getStoryList(1, seriesInfo[0].seriesKey, 1, 5);
            }
        }
    }
}

export default connect(
    mapStateToProps,
    { getStationList, changeStation, getStationDetail, getStoryList },
)(Home);