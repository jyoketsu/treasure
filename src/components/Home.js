import React, { Component } from 'react';
import './Home.css';
import StoryList from './story/StoryList';
import { connect } from 'react-redux';
import { getStationList, changeStation, getStationDetail, getStoryList } from '../actions/app';

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    stationMap: state.station.stationMap,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 2;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }

    // 滚动查看更多故事
    handleMouseWheel(e) {
        const { getStoryList, waiting, stationMap, nowStationKey, nowStoryNumber, storyNumber } = this.props;
        if (nowStoryNumber < storyNumber && !waiting && (this.homepage.scrollTop + this.homepage.clientHeight === this.homepage.scrollHeight)) {
            this.curPage++;
            getStoryList(1, stationMap[nowStationKey].seriesInfo[0].seriesKey, this.curPage, this.perPage);
        }
    }

    render() {
        const { changeStation, getStoryList, stationList, nowStationKey, stationMap, history } = this.props;
        return (
            <div className="homepage" ref={node => this.homepage = node} onWheel={this.handleMouseWheel}>
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
                            curPage={this.curPage}
                            perPage={this.perPage}
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
        if (this.homepage) {
            let scrollTop = sessionStorage.getItem('home-scroll');
            this.homepage.scrollTop = scrollTop;
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

    componentWillUnmount() {
        sessionStorage.setItem('home-scroll', this.homepage.scrollTop);
    }
}

class Station extends React.Component {
    handleClickAdd() {
        const { history } = this.props;
        history.push({
            pathname: '/editStory',
            search: '?type=new',
        });
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
                    <StoryList />
                </div>
                <div className="operation-panel">
                    <div className="share-station">分享</div>
                    <div className="add-story" onClick={this.handleClickAdd.bind(this)}>添加</div>
                </div>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const { content = {}, getStoryList, curPage, perPage } = this.props;
        const { starInfo = {}, seriesInfo = [] } = content;

        const { content: prevContent = {} } = prevProps;
        const { starInfo: prevStarInfo = {} } = prevContent;

        if (starInfo._key !== prevStarInfo._key) {
            console.log('切换了微站', starInfo._key);
            // 获取第一个专辑的故事
            if (seriesInfo[0]) {
                getStoryList(1, seriesInfo[0].seriesKey, curPage, perPage);
            }
        }
    }
}

export default connect(
    mapStateToProps,
    { getStationList, changeStation, getStationDetail, getStoryList },
)(Home);