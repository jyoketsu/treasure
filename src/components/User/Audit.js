import React, { Component } from 'react';
import './Audit.css';
import { withRouter } from "react-router-dom";
import StoryList from '../story/StoryList';
import { connect } from 'react-redux';
import { getStoryList, clearStoryList } from '../../actions/app';
import util from '../../services/Util';

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    nowStationKey: state.station.nowStationKey,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
    storyListLength: state.story.storyList.length,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
});

class Audit extends Component {
    constructor(props) {
        super(props);
        this.curPage = 1;
        this.perPage = 30;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
    }

    // 滚动查看更多故事
    handleMouseWheel(e) {
        const {
            getStoryList,
            waiting,
            nowStoryNumber,
            storyNumber,
            sortType,
            sortOrder,
        } = this.props;
        if (
            nowStoryNumber < storyNumber &&
            !waiting &&
            (this.auditRef.scrollTop + this.auditRef.clientHeight === this.auditRef.scrollHeight)
        ) {
            this.curPage++;
            getStoryList(7, this.stationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
        }
    }

    render() {
        return (
            <div className="audit" ref={node => this.auditRef = node} onWheel={this.handleMouseWheel}>
                <div className="my-station-head">作品审核</div>
                <div className="main-content">
                    <StoryList audit={true} />
                </div>
            </div>
        );
    };

    componentDidMount() {
        const { getStoryList, sortType, sortOrder, location, storyListLength, } = this.props;
        this.stationKey = util.common.getSearchParamValue(location.search, 'key');
        if (storyListLength === 0) {
            getStoryList(7, this.stationKey, 'allSeries', sortType, sortOrder, this.curPage, this.perPage);
        }

        // 自动滚动
        if (this.auditRef) {
            let scrollTop = sessionStorage.getItem('audit-scroll');
            this.auditRef.scrollTop = scrollTop;
        }
    }

    componentWillUnmount() {
        sessionStorage.setItem('audit-scroll', this.auditRef.scrollTop);
    }
}

export default withRouter(connect(
    mapStateToProps,
    { getStoryList, clearStoryList },
)(Audit));