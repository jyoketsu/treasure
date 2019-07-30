import React, { Component } from 'react';
import './Content.css';
import { withRouter } from "react-router-dom";
import { Tabs, Modal, } from 'antd';
import StoryList from '../story/StoryList';
import Story from '../story/Story';
import ArticlePreview from '../story/Article';
import EditArticle from '../story/EditArticle';
import StoryEdit from '../story/StoryEdit';
import { connect } from 'react-redux';
import {
    getStoryList,
    readyToRefresh,
    clearStoryList,
    getStoryDetail,
    clearStoryDetail,
} from '../../actions/app';
import CheckArticle from '../common/CheckArticle';
import util from '../../services/Util';
const { TabPane } = Tabs;

const mapStateToProps = state => ({
    waiting: state.common.waiting,
    nowStationKey: state.station.nowStationKey,
    sortType: state.story.sortType,
    sortOrder: state.story.sortOrder,
    storyListLength: state.story.storyList.length,
    storyNumber: state.story.storyNumber,
    storyType: state.story.story.type,
    nowStoryNumber: state.story.storyList.length,
});

class Content extends Component {
    constructor(props) {
        super(props);
        this.state = { visible: false, isEdit: false }
        this.curPage = 1;
        this.perPage = 30;
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.showMore = this.showMore.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.switchVisible = this.switchVisible.bind(this);
        this.handleClickEdit = this.handleClickEdit.bind(this);
    }

    switchVisible(key) {
        if (util.common.isMobile()) {
            this.setState((prevState) => ({
                visible: !prevState.visible,
                isEdit: false
            }));
        } else {
            this.setState({ isEdit: false });
        }

        if (key) {
            this.props.clearStoryDetail();
            this.props.getStoryDetail(key);
        }
    }

    handleClickEdit() {
        this.setState({
            isEdit: true,
        });
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
        if (!this.contentRef) { return }
        let top = this.contentRef.scrollTop;
        if (
            nowStoryNumber < storyNumber &&
            !waiting &&
            (top + this.contentRef.clientHeight === this.contentRef.scrollHeight)
        ) {
            this.curPage++;
            getStoryList(
                this.filterType,
                nowStationKey,
                null,
                'allSeries',
                sortType,
                sortOrder,
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
            sortType,
            sortOrder,
        } = this.props;

        this.curPage++;
        getStoryList(
            this.filterType,
            nowStationKey,
            null,
            'allSeries',
            sortType,
            sortOrder,
            '',
            '',
            this.curPage,
            this.perPage
        );
    }

    handleTabChange(key) {
        const { getStoryList, sortType, sortOrder, nowStationKey, clearStoryList, } = this.props;
        clearStoryList();
        this.curPage = 1;
        switch (key) {
            case 'wait':
                this.filterType = 7;
                getStoryList(
                    this.filterType,
                    nowStationKey,
                    null,
                    'allSeries',
                    sortType,
                    sortOrder,
                    '',
                    '',
                    this.curPage,
                    this.perPage
                );
                break;
            case 'passed':
                this.filterType = 6;
                getStoryList(
                    this.filterType,
                    nowStationKey,
                    null,
                    'allSeries',
                    sortType,
                    sortOrder,
                    '',
                    '',
                    this.curPage,
                    this.perPage
                );
                break;
            case 'unpass':
                this.filterType = 8;
                getStoryList(
                    this.filterType,
                    nowStationKey,
                    null,
                    'allSeries',
                    sortType,
                    sortOrder,
                    '',
                    '',
                    this.curPage,
                    this.perPage
                );
                break;
            default:
                break;
        }
    }

    render() {
        const { storyType } = this.props;
        const { isEdit, visible, } = this.state;
        const storyComp = storyType === 9 ?
            (isEdit ? <EditArticle inline={true} /> : <ArticlePreview readOnly={true} hideMenu={true} inline={true} />) :
            (isEdit ? <StoryEdit keep={true} inline={true} /> : <Story readOnly={true} inline={true} />);
        return (
            <div className="content-manage" ref={node => this.auditRef = node}>
                <div ref={node => this.contentRef = node}>
                    <h2>内容管理</h2>
                    <Tabs defaultActiveKey="wait" onChange={this.handleTabChange}>
                        <TabPane tab="待审核" key="wait">
                            <StoryList showMore={this.showMore} handleCoverClick={this.switchVisible} />
                        </TabPane>
                        <TabPane tab="已审核" key="passed">
                            <StoryList showMore={this.showMore} handleCoverClick={this.switchVisible} />
                        </TabPane>
                        <TabPane tab="审核不通过" key="unpass">
                            <StoryList showMore={this.showMore} handleCoverClick={this.switchVisible} />
                        </TabPane>
                    </Tabs>
                </div>
                <div>
                    <CheckArticle handleClickEdit={this.handleClickEdit} />
                    {storyComp}
                </div>
                <Modal
                    className="story-preview-modal"
                    title="文章预览"
                    footer={null}
                    style={{ top: 0, right: 0, bottom: 0 }}
                    visible={visible}
                    onCancel={this.switchVisible.bind(this, null)}
                    width={util.common.isMobile() ? '100%' : `${window.innerWidth * (2 / 3)}px`}
                >
                    <CheckArticle handleClickEdit={this.handleClickEdit} />
                    {storyComp}
                </Modal>
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
            getStoryList(
                this.filterType,
                nowStationKey,
                null,
                'allSeries',
                sortType,
                sortOrder,
                '',
                '',
                this.curPage,
                this.perPage
            );
        }

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

export default withRouter(connect(
    mapStateToProps,
    {
        getStoryList,
        readyToRefresh,
        clearStoryList,
        getStoryDetail,
        clearStoryDetail,
    },
)(Content));