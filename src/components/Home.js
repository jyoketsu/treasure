import React, { Component } from 'react';
import './Home.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import StoryList from './story/StoryList';
import HomeSubscribe from './HomeSubscribe';
import util from '../services/Util';
import { Modal, Tooltip, message, Input, } from 'antd';
import { connect } from 'react-redux';
import ClickOutside from './common/ClickOutside';
import {
    changeStation,
    getStationDetail,
    getStoryList,
    clearStoryList,
    seePlugin,
    seeChannel
} from '../actions/app';

const mapStateToProps = state => ({
    user: state.auth.user,
    waiting: state.common.waiting,
    stationList: state.station.stationList,
    nowStationKey: state.station.nowStationKey,
    nowStation: state.station.nowStation,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
    nowChannelKey: state.story.nowChannelKey,
    storyListLength: state.story.storyList.length,
    refresh: state.story.refresh,
});

class Home extends Component {
    constructor(props) {
        super(props);
        this.curPage = this.curPage = sessionStorage.getItem('home-curpage') ?
            parseInt(sessionStorage.getItem('home-curpage'), 10) : 1;
        this.perPage = 32;
        this.state = {
            showSort: false,
        }
        this.switchSortModal = this.switchSortModal.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.showMore = this.showMore.bind(this);
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
        let top = document.body.scrollTop || document.documentElement.scrollTop;
        if (
            nowStoryNumber < storyNumber &&
            !waiting &&
            (top + document.body.clientHeight === document.body.scrollHeight)
        ) {
            this.curPage++;
            if (nowStationKey === 'all') {
                getStoryList(4, null, null, 1, 1, this.curPage, this.perPage);
            } else {
                getStoryList(1, nowStationKey, nowChannelKey, sortType, sortOrder, this.curPage, this.perPage);
            }
        }
    }

    // 查看更多
    showMore(e) {
        const {
            nowStationKey,
            getStoryList,
            sortType,
            sortOrder,
            nowChannelKey, } = this.props;
        this.curPage++;
        getStoryList(1, nowStationKey, nowChannelKey, sortType, sortOrder, this.curPage, this.perPage);
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
        sessionStorage.setItem('home-curpage', 1);
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
            getStoryList,
            storyListLength,
            nowStationKey,
            nowStation,
            history,
            match,
            sortType,
            sortOrder,
            nowChannelKey,
            seePlugin,
            seeChannel, } = this.props;
        const { showSort } = this.state;

        return (
            <div className="app-content homepage">
                {
                    nowStationKey !== 'all' ?
                        <Station
                            user={user}
                            nowStationKey={nowStationKey}
                            nowChannelKey={nowChannelKey}
                            channelInfo={nowStation ? nowStation.seriesInfo : []}
                            content={nowStation || {}}
                            sortType={sortType}
                            sortOrder={sortOrder}
                            storyListLength={storyListLength}
                            getStoryList={getStoryList}
                            handleSort={this.handleSort}
                            changeChannel={this.changeChannel}
                            switchSortModal={this.switchSortModal}
                            history={history}
                            match={match}
                            showSort={showSort}
                            curPage={this.curPage}
                            perPage={this.perPage}
                            showMore={this.showMore}
                            seePlugin={seePlugin}
                            seeChannel={seeChannel}
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
        // 监听滚动，查看更多
        document.body.addEventListener('wheel', this.handleMouseWheel);
        let scrollTop = sessionStorage.getItem('home-scroll');
        if (document.body.scrollTop !== 0) {
            document.body.scrollTop = scrollTop;
        } else {
            document.documentElement.scrollTop = scrollTop;
        }

        const {
            nowStationKey,
            sortType,
            sortOrder,
            getStoryList,
            getStationDetail,
            storyListLength,
            refresh,
        } = this.props;

        if (nowStationKey) {
            getStationDetail(nowStationKey);
        }
        if (nowStationKey && storyListLength === 0) {
            // 获取微站全部故事
            getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, this.perPage);
            sessionStorage.setItem('home-curpage', 1);
        }

        if (refresh) {
            getStoryList(1, nowStationKey, 'allSeries', sortType, sortOrder, 1, this.perPage, true);
            sessionStorage.setItem('home-curpage', 1);
        }
    }

    componentWillUnmount() {
        // if (document.body.scrollTop !== 0) {
        //     document.body.scrollTop = 0;
        // } else {
        //     document.documentElement.scrollTop = 0;
        // }
        let top = document.body.scrollTop || document.documentElement.scrollTop;
        sessionStorage.setItem('home-curpage', this.curPage);
        // 保存scrollTop的值
        sessionStorage.setItem('home-scroll', top);
        // 移除滚动事件
        document.body.removeEventListener('wheel', this.handleMouseWheel);
    }
}

class Station extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showExtButton: false,
            xAxis: 0,
            questionVisible: false,
            question: '',
            answer: '',
        }
        this.handleClickAdd = this.handleClickAdd.bind(this);
        this.switchExtButton = this.switchExtButton.bind(this);
        this.handleClickChannel = this.handleClickChannel.bind(this);
        this.switchPluginVisible = this.switchPluginVisible.bind(this);
        this.handleInputAnswer = this.handleInputAnswer.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
    }
    /**
     * 回到顶部，动画效果
     * 由快到慢动画效果，体验较好
     */
    scrolltop() {
        let scrollToptimer = setInterval(() => {
            let top = document.body.scrollTop || document.documentElement.scrollTop;
            let speed = top / 4;
            if (document.body.scrollTop !== 0) {
                document.body.scrollTop -= speed;
            } else {
                document.documentElement.scrollTop -= speed;
            }
            if (top === 0) {
                clearInterval(scrollToptimer);
            }
        }, 30);
    }

    handleClickAdd(channel, type) {
        const { history, user, nowChannelKey, match, content } = this.props;
        const stationDomain = match.params.id;
        if (user.isGuest) {
            message.info('请先登录！');
            return;
        }
        if (!user.profile) {
            message.info('请先完善个人信息！');
            return;
        }
        if (nowChannelKey === 'allSeries') {
            message.info('请先选择要发布的频道！');
            return;
        }
        if (!channel.allowPublicUpload && !content.editRight) {
            message.info('您没有权限发布到当前频道中！');
            return;
        }

        switch (type) {
            case 'album':
                let path = channel && channel.albumType === 'normal' ? 'editStory' : 'contribute';
                history.push({
                    pathname: `/${stationDomain}/${path}`,
                    search: '?type=new',
                });
                break;
            case 'article':
                history.push({
                    pathname: `/${stationDomain}/editArticle`,
                    search: '?type=new',
                });
                break;
            default:
                switch (channel.contributeType[0]) {
                    case 1:
                        let path = channel && channel.albumType === 'normal' ? 'editStory' : 'contribute';
                        history.push({
                            pathname: `/${stationDomain}/${path}`,
                            search: '?type=new',
                        });
                        break;
                    case 2:
                        history.push({
                            pathname: `/${stationDomain}/editArticle`,
                            search: '?type=new',
                        });
                        break;
                    default: break;
                }
                break;
        }
    }

    switchExtButton() {
        this.setState((prevState) => ({
            showExtButton: !prevState.showExtButton
        }));
    }

    handleClickChannel(index, key, answered) {
        const { changeChannel, content, user, } = this.props;
        const { seriesInfo = [] } = content;
        let nowChannel;
        for (let i = 0; i < seriesInfo.length; i++) {
            if (key === seriesInfo[i]._key) {
                nowChannel = seriesInfo[i];
                break;
            }
        }

        if (user.isGuest && nowChannel && nowChannel.publish === 3) {
            message.info('请登录');
            return;
        }
        if (
            (!content.role && nowChannel && !nowChannel.isSeeSeries) &&
            nowChannel && nowChannel.publish === 3
            && !answered
        ) {
            this.rightAnswer = nowChannel.answer;
            this.question = {
                type: 'album',
                param: { index: index, key: key },
            }
            this.switchPluginVisible(nowChannel.question, '');
            return;
        }

        changeChannel(key);

        const { clientWidth: containerWidth } = this.tabContainer;
        const { clientWidth: tabsWidth } = this.tabs;
        const nowX = index * 80;
        // 容器中点位置
        const middleX = containerWidth / 2;
        // 内容长度与容器长度的差
        const differ = tabsWidth - containerWidth;
        if (tabsWidth > containerWidth) {
            if (nowX > middleX && nowX < differ) {
                this.setState({ xAxis: -(nowX - middleX) });
            } else if (nowX > differ) {
                this.setState({ xAxis: -differ });
            } else {
                this.setState({ xAxis: 0 });
            }
        }
    }

    switchPluginVisible(question, answer) {
        this.setState((prevState) => ({
            question: question ? question : '',
            answer: answer ? answer : '',
            questionVisible: !prevState.questionVisible
        }));
    }

    handleInputAnswer(e) {
        this.setState({
            answer: e.target.value
        });
    }

    handleAnswer() {
        const { seePlugin, seeChannel } = this.props;
        const { answer } = this.state;
        if (answer === this.rightAnswer) {
            if (this.question.type === 'plugin') {
                window.open(this.question.param.url, '_blank');
                seePlugin(this.question.param.key);
            } else if (this.question.type === 'album') {
                this.handleClickChannel(
                    this.question.param.index,
                    this.question.param.key,
                    true
                );
                seeChannel(this.question.param.key);
            }
            this.setState({
                questionVisible: false
            });
        } else {
            message.error('回答错误');
        }
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
            channelInfo,
            showMore,
            user,
        } = this.props;
        const { seriesInfo = [], pluginInfo = [], } = content;
        const { isCareStar } = content;
        const {
            xAxis,
            questionVisible,
            question,
            answer,
        } = this.state;

        const token = localStorage.getItem('TOKEN');
        let nowChannel;
        for (let i = 0; i < channelInfo.length; i++) {
            if (nowChannelKey === channelInfo[i]._key) {
                nowChannel = channelInfo[i];
                break;
            }
        }

        let channelList = [];
        if (isCareStar) {
            for (let i = 0; i < seriesInfo.length; i++) {
                if (seriesInfo[i].isCareSeries) {
                    channelList.push(seriesInfo[i]);
                }
            }
        } else {
            channelList = seriesInfo;
        }

        return (
            <div className="station-home">
                <div
                    className="station-cover"
                    style={{
                        backgroundImage: `url(${content.cover ?
                            content.cover : '/image/background/banner.png'})`
                    }}
                ></div>
                <div className="main-content station-home-page">
                    <div className="station-plugin-container">
                        {
                            pluginInfo.map((plugin, index) => (
                                <div
                                    key={index}
                                    className="station-plugin"
                                    onClick={
                                        () => {
                                            switch (plugin.publish) {
                                                case 1: window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                                                    break;
                                                case 2: content.role > 2 ?
                                                    message.info('没有权限访问！') :
                                                    window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                                                    break;
                                                case 3:
                                                    if (content.role || plugin.isSeePlugin) {
                                                        window.open(`${plugin.url}/${content.domain}?token=${token}`, '_blank');
                                                    } else {
                                                        if (user.isGuest) {
                                                            message.info('请登录');
                                                            return;
                                                        } else {
                                                            this.rightAnswer = plugin.answer;
                                                            this.question = {
                                                                type: 'plugin',
                                                                param: {
                                                                    url: `${plugin.url}/${content.domain}?token=${token}`,
                                                                    key: plugin._key,
                                                                },
                                                            }
                                                            this.switchPluginVisible(plugin.question, '');
                                                        }
                                                    }
                                                    break;
                                                default: break;
                                            }
                                        }
                                    }
                                >
                                    <i style={{ backgroundImage: `url(${plugin.icon})` }}></i>
                                    <span>{plugin.name}</span>
                                </div>
                            ))
                        }
                    </div>
                    <span className="station-name">{content.name}</span>
                    <div className="station-memo">
                        {/* <span className="station-memo-title">概述</span> */}
                        <pre>{content.memo}</pre>
                    </div>
                    <div className="series-container" ref={node => this.tabContainer = node}>
                        <div
                            className="series-tabs"
                            ref={node => this.tabs = node}
                            style={{ transform: `translate(${xAxis}px, 0)` }}
                        >
                            <div
                                className={`channel-item ${nowChannelKey === 'allSeries' ? 'selected' : ''}`}
                                onClick={this.handleClickChannel.bind(this, 0, 'allSeries', false)}
                            >
                                全部
                            </div>
                            {channelList.map((serie, index) => (
                                <div
                                    key={index}
                                    className={`channel-item ${nowChannelKey === serie._key ? 'selected' : ''}`}
                                    onClick={this.handleClickChannel.bind(this, index + 1, serie._key, false)}
                                >
                                    {serie.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <StoryList
                        showStyle={nowChannel ? nowChannel.showStyle : 2}
                        showSetting={nowChannel ? nowChannel.showSetting : null}
                        showMore={showMore}
                    />
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
                        </div>
                    </Tooltip>
                    {
                        (nowChannelKey === 'allSeries') || (nowChannel && nowChannel.contributeType && nowChannel.contributeType.length === 1) ?
                            <Tooltip title="投稿" placement="left">
                                <div className="story-tool add-story" onClick={this.handleClickAdd.bind(this, nowChannel, '')}>
                                    <i></i>
                                </div>
                            </Tooltip> : null
                    }
                    {
                        nowChannel && nowChannel.contributeType && nowChannel.contributeType.length > 1 ?
                            <div className="multi-button">
                                <Tooltip title="投稿" placement="bottom">
                                    <div className="story-tool add-story-multi" onClick={this.switchExtButton}>
                                        <i></i>
                                    </div>
                                </Tooltip>
                                <ReactCSSTransitionGroup transitionName="myFade" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                                    {this.state.showExtButton ? (
                                        <ClickOutside onClickOutside={this.switchExtButton}>
                                            <div className="ext-buttons">
                                                <Tooltip title="创建相册" placement="top">
                                                    <div
                                                        className="story-tool add-album"
                                                        onClick={this.handleClickAdd.bind(this, nowChannel, 'album')}
                                                    >
                                                        <i></i>
                                                    </div>
                                                </Tooltip>
                                                <Tooltip title="创建文章" placement="top">
                                                    <div
                                                        className="story-tool add-article"
                                                        onClick={this.handleClickAdd.bind(this, nowChannel, 'article')}
                                                    >
                                                        <i></i>
                                                    </div>
                                                </Tooltip>
                                            </div>
                                        </ClickOutside>
                                    ) : null}
                                </ReactCSSTransitionGroup>
                            </div> : null
                    }
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
                <Modal
                    title="回答问题"
                    visible={questionVisible}
                    onOk={this.handleAnswer}
                    onCancel={this.switchPluginVisible.bind(this, '', '')}
                >
                    <p>{question}</p>
                    <Input placeholder="请输入答案" value={answer} onChange={this.handleInputAnswer} />
                </Modal>
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        const { content = {}, } = this.props;
        const { content: prevContent = {}, nowStationKey: prevStationKey } = prevProps;

        // 切换微站
        if (content._key !== prevContent._key) {
            sessionStorage.setItem('DOMAIN', content.domain);
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
    {
        changeStation,
        getStationDetail,
        getStoryList,
        clearStoryList,
        seePlugin,
        seeChannel
    },
)(Home);