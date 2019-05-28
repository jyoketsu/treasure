import React, { Component } from 'react';
import './Home.css';
import StoryList from './story/StoryList';
import HomeSubscribe from './HomeSubscribe';
import util from '../services/Util';
import { Modal, Tooltip, message } from 'antd';
import { connect } from 'react-redux';
import { getStationList, changeStation, getStationDetail, getStoryList, clearStoryList } from '../actions/app';

const mapStateToProps = state => ({
    user: state.auth.user,
    waiting: state.common.waiting,
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    stationMap: state.station.stationMap,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
    nowChannelKey: state.story.nowChannelKey,
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
        this.state = {
            showSort: false,
        }
        this.switchSortModal = this.switchSortModal.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.changeChannel = this.changeChannel.bind(this);
    }

    // 滚动查看更多故事
    handleMouseWheel(e) {
        const {
            nowStationKey,
            getStoryList,
            waiting,
            nowStoryNumber,
            storyNumber,
            sortType,
            sortOrder,
            nowChannelKey, } = this.props;
        if (
            nowStoryNumber < storyNumber &&
            !waiting &&
            (this.homepage.scrollTop + this.homepage.clientHeight === this.homepage.scrollHeight)
        ) {
            this.curPage++;
            if (nowStationKey === 'all') {
                getStoryList(4, null, null, 1, 1, this.curPage, this.perPage);
            } else {
                getStoryList(1, nowStationKey, nowChannelKey, sortType, sortOrder, this.curPage, this.perPage);
            }
        }
    }

    changeChannel(channelKey) {
        const {
            nowStationKey,
            getStoryList,
            clearStoryList,
            sortType,
            sortOrder,
        } = this.props;
        this.curPage = 1;
        clearStoryList();
        getStoryList(1, nowStationKey, channelKey, sortType, sortOrder, this.curPage, this.perPage);
    }

    switchSortModal() {
        this.setState((prevState) => ({
            showSort: !prevState.showSort
        }));
    }

    handleSort(sortType, sortOrder) {
        const {
            getStoryList,
            nowStationKey,
            nowChannelKey,
        } = this.props;
        this.curPage = 1;
        this.setState({
            showSort: false,
        });
        getStoryList(1, nowStationKey, nowChannelKey, sortType, sortOrder, this.curPage, this.perPage);
    }

    render() {
        const {
            user,
            location,
            changeStation,
            getStoryList,
            stationList,
            nowStationKey,
            stationMap,
            history,
            sortType,
            sortOrder,
            nowChannelKey } = this.props;
        const { showSort } = this.state;
        let targetStationKey = util.common.getSearchParamValue(location.search, 'stationKey');

        return (
            <div className="app-content homepage" ref={node => this.homepage = node} onWheel={this.handleMouseWheel}>
                {
                    // 微站列表
                    !targetStationKey ?
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
                            {/* <div className={`station-item`}>查看所有</div> */}
                        </div> : null
                }

                {
                    nowStationKey !== 'all' ?
                        <Station
                            user={user}
                            nowStationKey={nowStationKey}
                            nowChannelKey={nowChannelKey}
                            content={stationMap[nowStationKey]}
                            sortType={sortType}
                            sortOrder={sortOrder}
                            getStoryList={getStoryList}
                            handleSort={this.handleSort}
                            changeChannel={this.changeChannel}
                            switchSortModal={this.switchSortModal}
                            history={history}
                            showSort={showSort}
                            curPage={this.curPage}
                            perPage={this.perPage}
                        /> :
                        <HomeSubscribe
                            getStoryList={getStoryList}
                            curPage={this.curPage}
                            perPage={this.perPage}
                        />
                }
            </div>
        );
    };

    componentDidMount() {
        const { getStationList, stationList, nowStationKey, getStoryList, location, changeStation, } = this.props;
        let targetStationKey = util.common.getSearchParamValue(location.search, 'stationKey');

        if (stationList.length === 0) {
            getStationList();
        }
        if (this.homepage) {
            let scrollTop = sessionStorage.getItem('home-scroll');
            this.homepage.scrollTop = scrollTop;
        }
        if (!targetStationKey && nowStationKey === 'all') {
            // 订阅的所有微站的频道故事
            getStoryList(4, null, null, 1, 1, 1, this.perPage);
        }

        if (targetStationKey) {
            changeStation(targetStationKey);
        }
    }

    componentDidUpdate(prevProps) {
        const { nowStationKey, stationMap, getStationDetail, getStoryList } = this.props;
        // 切换微站时
        if (nowStationKey !== prevProps.nowStationKey) {
            this.curPage = 1;
            if (!stationMap[nowStationKey]) {
                if (nowStationKey !== 'all') {
                    getStationDetail(nowStationKey);
                } else {
                    // 订阅的所有微站的频道故事
                    getStoryList(4, null, null, 1, 1, 1, this.perPage);
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
        const { history, user, } = this.props;
        if (!user.profile) {
            message.error('请先完善个人信息！');
            return;
        }
        const stationKey = util.common.getSearchParamValue(window.location.search, 'stationKey');
        history.push({
            pathname: '/contribute',
            search: stationKey ? `?stationKey=${stationKey}&type=new` : `?type=new`,
        });
    }

    toChannelOption() {
        const { history } = this.props;
        history.push({
            pathname: '/channel',
        });
    }

    render() {
        const {
            content = {},
            sortType,
            sortOrder,
            handleSort,
            showSort,
            switchSortModal,
            nowChannelKey,
            changeChannel
        } = this.props;
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
                        {/* <span className="station-memo-title">概述</span> */}
                        <pre>{starInfo.memo}</pre>
                    </div>
                    <div className="series-container">
                        <div className="series-tabs">
                            <div
                                className={`channel-item ${nowChannelKey === 'allSeries' ? 'selected' : ''}`}
                                onClick={changeChannel.bind(this, 'allSeries')}
                            >
                                全部
                            </div>
                            {seriesInfo.map((serie, index) => (
                                <div
                                    key={index}
                                    className={`channel-item ${nowChannelKey === serie._key ? 'selected' : ''}`}
                                    onClick={changeChannel.bind(this, serie._key)}
                                >
                                    {serie.name}
                                </div>
                            ))}
                        </div>
                        {
                            content.editRight ?
                                <div className="series-options" onClick={this.toChannelOption.bind(this)}></div> :
                                null
                        }

                    </div>
                    <StoryList />
                </div>
                <div className="operation-panel">
                    {/* <div className="share-station">分享</div> */}
                    <Tooltip title="排序" placement="left">
                        <div className="story-tool sort-story" onClick={switchSortModal}>
                            <i></i>
                            <span>作品排序</span>
                        </div>
                    </Tooltip>
                    <Tooltip title="投稿" placement="left">
                        <div className="story-tool add-story" onClick={this.handleClickAdd.bind(this)}>
                            <i></i>
                            <span>上传作品</span>
                        </div>
                    </Tooltip>
                </div>
                <Modal
                    title="排序"
                    visible={showSort}
                    onCancel={switchSortModal}
                    width="320px"
                    footer={null}
                >
                    <p
                        className={`sortType ${sortType === 1 && sortOrder === 1 ? 'active' : ''}`}
                        onClick={handleSort.bind(this, 1, 1)}
                    >
                        时间倒序
                    </p>
                    <p
                        className={`sortType ${sortType === 1 && sortOrder === 2 ? 'active' : ''}`}
                        onClick={handleSort.bind(this, 1, 2)}
                    >
                        时间正序
                    </p>
                    <p
                        className={`sortType ${sortType === 2 && sortOrder === 1 ? 'active' : ''}`}
                        onClick={handleSort.bind(this, 2, 1)}
                    >
                        点赞（投票）数
                    </p>
                    {/* <p className={sortType === 3 && sortOrder === 1 ? 'active' : ''}>阅读数</p> */}
                </Modal>
            </div>
        );
    }

    componentDidMount() {
        const { content = {}, getStoryList, sortType, sortOrder, perPage, nowStationKey } = this.props;
        const { starInfo = {}, seriesInfo = [] } = content;
        if (starInfo._key && seriesInfo.length !== 0) {
            // 获取第一个专辑的故事
            getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, perPage);
        }
    }

    componentDidUpdate(prevProps) {
        const { content = {}, getStoryList, sortType, sortOrder, perPage, nowStationKey, } = this.props;
        const { starInfo = {}, seriesInfo = [] } = content;

        const { content: prevContent = {}, nowStationKey: prevStationKey } = prevProps;
        const { starInfo: prevStarInfo = {} } = prevContent;

        // 切换微站
        if (starInfo._key !== prevStarInfo._key) {
            let tarStationName = util.common.getSearchParamValue(window.location.search, 'station');
            if (!tarStationName) {
                document.title = starInfo.name ? starInfo.name : '时光宝库'
            }

            // 获取微站全部故事
            if (seriesInfo[0]) {
                getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, perPage);
            }
        }
        // 从订阅切换到微站
        if (prevStationKey === 'all') {
            alert('从订阅切换到微站');
        }
    }
}

export default connect(
    mapStateToProps,
    { getStationList, changeStation, getStationDetail, getStoryList, clearStoryList },
)(Home);