import React, { Component } from 'react';
import './Content.css';
import { withRouter } from "react-router-dom";
import StoryList from '../story/StoryList';
import { connect } from 'react-redux';
import { getStoryList } from '../../actions/app';

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
        this.curPage = 1;
        this.perPage = 30;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
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
            getStoryList(7, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
        }
    }

    render() {
        return (
            <div className="content-manage" ref={node => this.auditRef = node}>
                <h2>内容管理</h2>
                <StoryList audit={true} />
            </div>
        );
    };

    componentDidMount() {
        const { getStoryList, sortType, sortOrder, nowStationKey, storyListLength, } = this.props;
        if (nowStationKey && storyListLength === 0) {
            getStoryList(7, nowStationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
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
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getStoryList },
)(Content));