import React, { Component } from 'react';
import './Content.css';
import { withRouter } from "react-router-dom";
import { Tabs } from 'antd';
import StoryList from '../story/StoryList';
import { connect } from 'react-redux';
import { getStoryList, readyToRefresh, clearStoryList, } from '../../actions/app';
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    nowStationKey: state.station.nowStationKey,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
    storyListLength: state.story.storyList.length,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
});

class Content extends Component {
    constructor(props) {
        super(props);
        this.curPage = this.curPage = sessionStorage.getItem('content-curpage') ?
            parseInt(sessionStorage.getItem('content-curpage'), 10) : 1;
        this.perPage = 30;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.showMore = this.showMore.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
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
        } = this.props;

        let top = document.body.scrollTop || document.documentElement.scrollTop;
        if (
            nowStoryNumber < storyNumber &&
            !waiting &&
            (top + document.body.clientHeight === document.body.scrollHeight)
        ) {
            this.curPage++;
            getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
        }
    }

    showMore() {
        const {
            nowStationKey,
            getStoryList,
            sortType,
            sortOrder,
        } = this.props;

        this.curPage++;
        getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
    }

    handleTabChange(key) {
        const { getStoryList, sortType, sortOrder, nowStationKey, clearStoryList, } = this.props;
        clearStoryList();
        this.curPage = 1;
        sessionStorage.setItem('content-curpage', this.curPage);
        switch (key) {
            case 'wait':
                this.filterType = 7;
                getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
                break;
            case 'passed':
                this.filterType = 6;
                getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
                break;
            case 'unpass':
                this.filterType = 8;
                getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
                break;
            default:
                break;
        }
    }

    render() {
        return (
            <div className="content-manage" ref={node => this.auditRef = node}>
                <h2>内容管理</h2>
                <Tabs defaultActiveKey="wait" onChange={this.handleTabChange}>
                    <TabPane tab="待审核" key="wait">
                        <StoryList audit={true} showMore={this.showMore} />
                    </TabPane>
                    <TabPane tab="已审核" key="passed">
                        <StoryList audit={true} showMore={this.showMore} />
                    </TabPane>
                    <TabPane tab="审核不通过" key="unpass">
                        <StoryList audit={true} showMore={this.showMore} />
                    </TabPane>
                </Tabs>
            </div>
        );
    };

    componentDidMount() {
        const { getStoryList, sortType, sortOrder, nowStationKey, readyToRefresh, clearStoryList, } = this.props;
        clearStoryList();
        readyToRefresh();
        if (nowStationKey) {
            this.curPage = 1;
            this.filterType = 7;
            sessionStorage.setItem('content-curpage', this.curPage);
            getStoryList(this.filterType, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
        }

        // 监听滚动，查看更多
        document.body.addEventListener('wheel', this.handleMouseWheel);
        if (this.homepage) {
            let scrollTop = sessionStorage.getItem('home-scroll');
            this.homepage.scrollTop = scrollTop;
        }

        // 自动滚动
        if (this.auditRef) {
            let scrollTop = sessionStorage.getItem('audit-scroll');
            this.auditRef.scrollTop = scrollTop;
        }
    }

    componentWillUnmount() {
        // 移除滚动事件
        document.body.removeEventListener('wheel', this.handleMouseWheel);
        sessionStorage.setItem('audit-scroll', this.auditRef.scrollTop);
        sessionStorage.setItem('content-curpage', this.curPage);
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getStoryList, readyToRefresh, clearStoryList, },
)(Content));