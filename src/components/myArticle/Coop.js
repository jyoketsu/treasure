import React, { Component } from 'react';
import './Article.css';
import StoryList from '../story/StoryList';
import Story from '../story/Story';
import ArticlePreview from '../story/Article';
import util from '../../services/Util';
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { getStoryList, readyToRefresh, getStoryDetail, clearStoryDetail, } from '../../actions/app';

const mapStateToProps = state => ({
    nowStationKey: state.station.nowStationKey,
    searchUserList: state.station.searchUserList,
    userList: state.station.userList,
    groupKey: state.station.nowStation ? state.station.nowStation.fansGroupKey : null,
    waiting: state.common.waiting,
    storyNumber: state.story.storyNumber,
    nowStoryNumber: state.story.storyList.length,
    storyType: state.story.story.type,
});

class Coop extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: false }
        this.curPage = this.curPage = sessionStorage.getItem('member-story-curpage') ?
            parseInt(sessionStorage.getItem('member-story-curpage'), 10) : 1;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.showMore = this.showMore.bind(this);
        this.switchVisible = this.switchVisible.bind(this);
        this.perPage = 3;
        this.sortType = 1;
        this.sortOrder = 1;
        this.type = 9;
    }

    switchVisible(key) {
        this.setState((prevState) => ({ visible: !prevState.visible }));
        if (key) {
            this.props.clearStoryDetail();
            this.props.getStoryDetail(key);
        }
    }

    render() {
        const { storyType } = this.props;
        return (
            <div className="member-story-list">
                <StoryList
                    showMore={this.showMore}
                    handleCoverClick={this.switchVisible}
                />
                <Modal
                    className="story-preview-modal"
                    title="文章预览"
                    footer={null}
                    style={{ top: 0, right: 0, bottom: 0 }}
                    visible={this.state.visible}
                    onCancel={this.switchVisible.bind(this, null)}
                    width={util.common.isMobile() ? '100%' : `${window.innerWidth * (2 / 3)}px`}
                >
                    {storyType === 9 ? <ArticlePreview readOnly={true} /> : <Story readOnly={true} />}
                </Modal>
            </div>
        );
    }

    // 滚动查看更多故事
    handleMouseWheel(e) {
        const {
            nowStationKey,
            getStoryList,
            waiting,
            nowStoryNumber,
            storyNumber,
        } = this.props;
        const { visible } = this.state;

        let top = document.body.scrollTop || document.documentElement.scrollTop;
        if (
            !visible &&
            nowStoryNumber < storyNumber &&
            !waiting &&
            (top + document.body.clientHeight === document.body.scrollHeight)
        ) {
            this.curPage++;
            getStoryList(this.type, nowStationKey, this.userId, 'allSeries', this.sortType, this.sortOrder, this.curPage, this.perPage);
        }
    }

    showMore() {
        const {
            nowStationKey,
            getStoryList,
        } = this.props;

        this.curPage++;
        getStoryList(this.type, nowStationKey, this.userId, 'allSeries', this.sortType, this.sortOrder, this.curPage, this.perPage);
    }

    componentDidMount() {
        const { nowStationKey, getStoryList, readyToRefresh, storyNumber } = this.props;
        readyToRefresh();
        this.curPage = 1;
        sessionStorage.setItem('member-story-curpage', this.curPage);
        getStoryList(this.type, nowStationKey, null, 'allSeries', this.sortType, this.sortOrder, this.curPage, this.perPage);

        // 监听滚动，查看更多
        document.body.addEventListener('wheel', this.handleMouseWheel);
    }

    componentWillUnmount() {
        // 移除滚动事件
        document.body.removeEventListener('wheel', this.handleMouseWheel);
        let top = document.body.scrollTop || document.documentElement.scrollTop;
        sessionStorage.setItem('member-story-scroll', top);
        sessionStorage.setItem('member-story-curpage', this.curPage);
    }
}

export default connect(
    mapStateToProps,
    { getStoryList, readyToRefresh, getStoryDetail, clearStoryDetail, },
)(Coop);