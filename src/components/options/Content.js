import React, { Component } from "react";
import "./Content.css";
import { withRouter } from "react-router-dom";
import { Tabs, Modal, Pagination } from "antd";
import StoryList from "../story/StoryList";
import Story from "../story/Story";
import ArticlePreview from "../story/Article";
import EditArticle from "../story/EditArticle";
import StoryEdit from "../story/StoryEdit";
import StroyLink from "../story/Link";
import { connect } from "react-redux";
import {
  getStoryList2,
  getSubscribeStories,
  clearStoryList2,
  getStoryDetail,
  clearStoryDetail,
  switchEditLinkVisible,
  passAll
} from "../../actions/app";
import CheckArticle from "../common/CheckArticle";
import util from "../../services/Util";
const { TabPane } = Tabs;
const confirm = Modal.confirm;

const mapStateToProps = state => ({
  user: state.auth.user,
  waiting: state.common.waiting,
  nowStationKey: state.station.nowStationKey,
  storyList: state.story.storyList2,
  storyNumber: state.story.storyNumber2,
  storyType: state.story.story.type,
  story: state.story.story,
  eidtLinkVisible: state.story.eidtLinkVisible
});

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, isEdit: false };
    this.curPage = 1;
    this.perPage = 30;
    this.handleTabChange = this.handleTabChange.bind(this);
    this.switchVisible = this.switchVisible.bind(this);
    this.handleClickEdit = this.handleClickEdit.bind(this);
    this.confirmPassAll = this.confirmPassAll.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  switchVisible(key) {
    const { singleColumn } = this.props;
    if (util.common.isMobile() || singleColumn) {
      this.setState(prevState => ({
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
    const { story, switchEditLinkVisible } = this.props;
    switch (story.type) {
      case 6:
      case 9:
        this.setState({
          isEdit: true
        });
        break;
      case 12:
        break;
      case 15:
        switchEditLinkVisible();
        break;
      default:
        break;
    }
  }

  onChange = page => {
    const { paginationCallback, nowStationKey, getStoryList2 } = this.props;
    this.curPage = page;

    getStoryList2(
      this.filterType,
      nowStationKey,
      null,
      this.curPage,
      this.perPage
    );

    if (paginationCallback) {
      paginationCallback();
    } else {
      if (document.body.scrollTop !== 0) {
        document.body.scrollTop = 0;
      } else {
        document.documentElement.scrollTop = 0;
      }
    }
  };

  handleTabChange(key) {
    const {
      user,
      getStoryList2,
      getSubscribeStories,
      nowStationKey,
      clearStoryList2
    } = this.props;
    clearStoryList2();
    this.curPage = 1;
    switch (key) {
      case "wait":
        this.filterType = 7;
        getStoryList2(
          this.filterType,
          nowStationKey,
          null,
          this.curPage,
          this.perPage
        );
        break;
      case "passed":
        this.filterType = 6;
        getStoryList2(
          this.filterType,
          nowStationKey,
          null,
          this.curPage,
          this.perPage
        );
        break;
      case "unpass":
        this.filterType = 8;
        getStoryList2(
          this.filterType,
          nowStationKey,
          null,
          this.curPage,
          this.perPage
        );
        break;
      case "wait_all":
        this.filterType = 10;
        getStoryList2(this.filterType, "", null, this.curPage, this.perPage);
        break;
      case "my":
        this.filterType = 2;
        getStoryList2(
          this.filterType,
          "",
          user._key,
          this.curPage,
          this.perPage
        );
        break;
      case "coop":
        this.filterType = 9;
        getStoryList2(
          this.filterType,
          "",
          user._key,
          this.curPage,
          this.perPage
        );
        break;
      case "subscribe":
        this.filterType = null;
        getSubscribeStories(this.curPage, this.perPage);
        break;
      default:
        break;
    }
  }

  confirmPassAll() {
    const { passAll, nowStationKey } = this.props;
    confirm({
      title: "全部通过",
      content: `确定要全部通过吗？`,
      okText: "通过",
      cancelText: "取消",
      onOk() {
        passAll(nowStationKey);
      }
    });
  }

  render() {
    const {
      storyType,
      story,
      eidtLinkVisible,
      storyList,
      storyNumber,
      singleColumn
    } = this.props;
    const { isEdit, visible } = this.state;
    let storyComp;
    switch (storyType) {
      case 6:
        storyComp = isEdit ? (
          <StoryEdit
            inline={true}
            finishCallback={() => this.setState({ isEdit: false })}
          />
        ) : (
          <Story readOnly={true} inline={true} />
        );
        break;
      case 9:
        storyComp = isEdit ? (
          <EditArticle
            inline={true}
            hideMenu={true}
            finishCallback={() => this.setState({ isEdit: false })}
          />
        ) : (
          <ArticlePreview readOnly={true} hideMenu={true} inline={true} />
        );
        break;
      case 12: {
        const token = localStorage.getItem("TOKEN");
        storyComp = (
          <iframe
            title={story.title}
            src={`https://editor.qingtime.cn?token=${token}&key=${story._key}`}
            frameBorder="0"
            width="100%"
          ></iframe>
        );
        break;
      }
      case 15:
        storyComp = (
          <iframe
            title={story.title}
            src={story.url}
            frameBorder="0"
            width="100%"
          ></iframe>
        );
        break;
      default:
        break;
    }
    const containerStyle = singleColumn
      ? { display: "block", position: "relative", top: 0, left: 0, right: 0 }
      : {};
    let showCheck = true;
    if (this.filterType === 2 || this.filterType === 9) {
      showCheck = false;
    }
    return (
      <div
        className="content-manage"
        style={containerStyle}
        ref={node => (this.auditRef = node)}
      >
        <div
          className="content-manage-grid"
          ref={node => (this.contentRef = node)}
        >
          <h2>{singleColumn ? null : "内容管理"}</h2>
          <Tabs defaultActiveKey="wait" onChange={this.handleTabChange}>
            {!singleColumn
              ? [
                  <TabPane tab="待审核" key="wait">
                    <span className="pass-all" onClick={this.confirmPassAll}>
                      全部通过
                    </span>
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                    />
                  </TabPane>,
                  <TabPane tab="已审核" key="passed">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                    />
                  </TabPane>,
                  <TabPane tab="审核不通过" key="unpass">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                    />
                  </TabPane>
                ]
              : [
                  <TabPane tab="订阅" key="subscribe">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                      showSiteName={true}
                    />
                  </TabPane>,
                  <TabPane tab="我的" key="my">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                      showSiteName={true}
                    />
                  </TabPane>,
                  <TabPane tab="待审核" key="wait_all">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                      showSiteName={true}
                    />
                  </TabPane>,
                  <TabPane tab="协作" key="coop">
                    <StoryList
                      storyList={storyList}
                      storyNumber={storyNumber}
                      handleCoverClick={this.switchVisible}
                      hideFoot={true}
                      showSiteName={true}
                    />
                  </TabPane>
                ]}
          </Tabs>
          <Pagination
            style={{ margin: "15px 0" }}
            current={this.curPage}
            pageSize={this.perPage}
            total={storyNumber}
            onChange={this.onChange}
          />
        </div>
        {util.common.isMobile() || singleColumn ? null : (
          <div className="content-manage-grid">
            <CheckArticle
              handleClickEdit={this.handleClickEdit}
              showCheck={showCheck}
            />
            {storyComp}
          </div>
        )}
        {visible ? (
          <div className="view-story-modal">
            <div className="view-story-modal-head">
              <i onClick={this.switchVisible.bind(this, null)}></i>
            </div>
            {this.filterType ? (
              <CheckArticle
                handleClickEdit={this.handleClickEdit}
                showCheck={showCheck}
              />
            ) : null}
            <div className="container">{storyComp}</div>
          </div>
        ) : null}
        {eidtLinkVisible ? <StroyLink /> : null}
      </div>
    );
  }

  componentDidMount() {
    const {
      user,
      getStoryList2,
      getSubscribeStories,
      nowStationKey,
      singleColumn
    } = this.props;
    if (nowStationKey) {
      this.curPage = 1;
      if (singleColumn) {
        getSubscribeStories(this.curPage, this.perPage);
      } else {
        this.filterType = 7;
        getStoryList2(
          this.filterType,
          singleColumn ? "" : nowStationKey,
          singleColumn ? user._key : null,
          this.curPage,
          this.perPage
        );
      }
    }
  }
  componentWillUnmount() {
    const { clearStoryList2 } = this.props;
    clearStoryList2();
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getStoryList2,
    getSubscribeStories,
    clearStoryList2,
    getStoryDetail,
    clearStoryDetail,
    switchEditLinkVisible,
    passAll
  })(Content)
);
