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
    storyListLength: state.story.storyList.length,
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
            (document.scrollingElement.scrollTop + document.body.clientHeight === document.body.scrollHeight)
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
            storyListLength,
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
            <div className="app-content homepage" ref={node => this.homepage = node}>
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
                                        className={`station-item ${nowStationKey === station._key ? 'selected' : ''}`}
                                        onClick={changeStation.bind(this, station._key)}
                                    >
                                        {station.name}
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
                            storyListLength={storyListLength}
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
        const { getStationList, stationList, nowStationKey, getStoryList,
            location, changeStation, sortType, sortOrder, storyListLength, } = this.props;

        // 监听滚动，查看更多
        document.body.addEventListener('wheel', this.handleMouseWheel, true);

        let targetStationKey = util.common.getSearchParamValue(location.search, 'stationKey');
        if (stationList.length === 0) {
            getStationList();
        }
        if (this.homepage) {
            let scrollTop = sessionStorage.getItem('home-scroll');
            this.homepage.scrollTop = scrollTop;
        }

        if (targetStationKey && targetStationKey !== nowStationKey) {
            changeStation(targetStationKey);
        } else {
            if (!targetStationKey && nowStationKey === 'all') {
                // 订阅的所有微站的频道故事
                getStoryList(4, null, null, 1, 1, 1, this.perPage);
            } else if (storyListLength === 0) {
                // 获取微站全部故事
                getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, this.perPage);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const { nowStationKey, stationMap, getStationDetail, getStoryList, clearStoryList, sortType, sortOrder, } = this.props;
        // 切换微站时
        if (nowStationKey !== prevProps.nowStationKey) {
            clearStoryList();
            this.curPage = 1;
            if (nowStationKey !== 'all') {
                if (!stationMap[nowStationKey]) {
                    getStationDetail(nowStationKey);
                }
                // 获取微站全部故事
                getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, this.perPage);
            } else {
                // 订阅的所有微站的频道故事
                getStoryList(4, null, null, 1, 1, 1, this.perPage);
            }
        }
    }

    componentWillUnmount() {
        // 保存scrollTop的值
        sessionStorage.setItem('home-scroll', this.homepage.scrollTop);
        // 移除滚动事件
        document.body.removeEventListener('wheel', this.handleMouseWheel);
    }
}

class Station extends React.Component {
    constructor(props) {
        super(props);
    }

    scrolltop() {
        document.scrollingElement.scrollTop = 0;
    }

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
        const { seriesInfo = [] } = content;
        return (
            <div className="station-home">
                <div
                    className="station-cover"
                    style={{ backgroundImage: `url(${content.cover})` }}
                ></div>
                <div className="main-content">
                    <span className="station-name">{content.name}</span>
                    <div className="station-memo">
                        {/* <span className="station-memo-title">概述</span> */}
                        <pre>{content.memo}</pre>
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
                <HomeFooter stationName={content.name} />
                <div className="operation-panel">
                    <Tooltip title="回到顶部" placement="left">
                        <div className="story-tool scrolltop" onClick={this.scrolltop}>
                            <i></i>
                        </div>
                    </Tooltip>
                    <Tooltip title="排序" placement="left">
                        <div className="story-tool sort-story" onClick={switchSortModal}>
                            <i></i>
                            {/* <span>作品排序</span> */}
                        </div>
                    </Tooltip>
                    <Tooltip title="投稿" placement="left">
                        <div className="story-tool add-story" onClick={this.handleClickAdd.bind(this)}>
                            <i></i>
                            {/* <span>上传作品</span> */}
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

    componentDidUpdate(prevProps) {
        const { content = {}, } = this.props;
        const { content: prevContent = {}, nowStationKey: prevStationKey } = prevProps;

        // 切换微站
        if (content._key !== prevContent._key) {
            let tarStationName = util.common.getSearchParamValue(window.location.search, 'station');
            if (!tarStationName) {
                document.title = content.name ? content.name : '时光宝库'
            }
        }
        // 从订阅切换到微站
        if (prevStationKey === 'all') {
            alert('从订阅切换到微站');
        }
    }
}

class HomeFooter extends React.Component {
    render() {
        const { stationName } = this.props;
        const isMobile = util.common.isMobile();
        return (
            <div className="home-footer">
                {
                    !isMobile ? (
                        <span>
                            <span>版权所有</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>2019-2029</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>{stationName}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <span>All Rights Reserved</span>
                        </span>
                    ) : [
                            <span key="1">版权所有 2019-2029</span>,
                            <span key="2">{`${stationName} All Rights Reserved`}</span>
                        ]
                }

                <span>{`Powered by 时光宝库`}</span>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    { getStationList, changeStation, getStationDetail, getStoryList, clearStoryList },
)(Home);