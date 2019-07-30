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
        this.curPage = 1;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.showMore = this.showMore.bind(this);
        this.switchVisible = this.switchVisible.bind(this);
        this.perPage = 30;
        this.sortType = 1;
        this.sortOrder = 1;
        this.type = 9;
    }

    switchVisible(key) {
        if (util.common.isMobile()) {
            this.setState((prevState) => ({ visible: !prevState.visible }))
        }
        if (key) {
            this.props.clearStoryDetail();
            this.props.getStoryDetail(key);
        }
    }

    render() {
        const { storyType } = this.props;
        return (
            <div className="member-story-list">
                <div ref={node => this.contentRef = node}>
                    <StoryList
                        showMore={this.showMore}
                        handleCoverClick={this.switchVisible}
                    />
                </div>
                <div>
                    {storyType === 9 ?
                        <ArticlePreview readOnly={true} hideMenu={true} inline={true} /> :
                        <Story readOnly={true} inline={true} />}
                </div>
                <Modal
                    className="story-preview-modal"
                    title="文章预览"
                    footer={null}
                    style={{ top: 0, right: 0, bottom: 0 }}
                    visible={this.state.visible}
                    onCancel={this.switchVisible.bind(this, null)}
                    width={util.common.isMobile() ? '100%' : `${window.innerWidth * (2 / 3)}px`}
                >
                    {storyType === 9 ? <ArticlePreview readOnly={true} hideMenu={true} /> : <Story readOnly={true} />}
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
        if (!this.contentRef) { return }
        let top = this.contentRef.scrollTop;
        if (
            !visible &&
            nowStoryNumber < storyNumber &&
            !waiting &&
            (top + this.contentRef.clientHeight === this.contentRef.scrollHeight)
        ) {
            this.curPage++;
            getStoryList(
                this.type,
                nowStationKey,
                this.userId,
                'allSeries',
                this.sortType,
                this.sortOrder,
                '',
                '',
                this.curPage,
                this.perPage
            );
        }
    }

    showMore() {
        const {
            nowStationKey,
            getStoryList,
        } = this.props;

        this.curPage++;
        getStoryList(
            this.type,
            nowStationKey,
            this.userId,
            'allSeries',
            this.sortType,
            this.sortOrder,
            '',
            '',
            this.curPage,
            this.perPage
        );
    }

    componentDidMount() {
        const { nowStationKey, getStoryList, readyToRefresh } = this.props;
        readyToRefresh();
        this.curPage = 1;
        getStoryList(
            this.type,
            nowStationKey,
            null,
            'allSeries',
            this.sortType,
            this.sortOrder,
            '',
            '',
            this.curPage,
            this.perPage
        );

        // 监听滚动，查看更多
        if (!util.common.isMobile()) {
            document.body.addEventListener('wheel', this.handleMouseWheel);
        }
    }

    componentWillUnmount() {
        // 移除滚动事件
        if (!util.common.isMobile()) {
            document.body.removeEventListener('wheel', this.handleMouseWheel);
        }
    }
}

export default connect(
    mapStateToProps,
    { getStoryList, readyToRefresh, getStoryDetail, clearStoryDetail, },
)(Coop);