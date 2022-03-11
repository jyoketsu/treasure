import React, { Component } from "react";
import StroyLink from "./story/Link";
import util from "../services/Util";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Modal, Tooltip, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { switchEditLinkVisible, clearStoryDetail } from "../actions/app";
import { connect } from "react-redux";
import ClickOutside from "./common/ClickOutside";

const { Option } = Select;

const mapStateToProps = (state) => ({
  user: state.auth.user,
  nowStation: state.station.nowStation,
  eidtLinkVisible: state.story.eidtLinkVisible,
  nowChannelKey: state.story.nowChannelKey,
});

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showExtButton: false,
      showSelectChannel: false,
    };
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.switchExtButton = this.switchExtButton.bind(this);
    this.switchChannelVisible = this.switchChannelVisible.bind(this);
    this.handleSelectedChannel = this.handleSelectedChannel.bind(this);
    this.handleSelectChannel = this.handleSelectChannel.bind(this);
  }
  switchExtButton() {
    this.setState((prevState) => ({
      showExtButton: !prevState.showExtButton,
    }));
  }

  handleClickAdd(channel, type) {
    const {
      history,
      user,
      nowStation,
      switchEditLinkVisible,
      clearStoryDetail,
    } = this.props;
    const stationDomain = nowStation.domain;
    if (user.isGuest) {
      message.info("请先登录！");
      return;
    }
    if (type !== "link") {
      this.contributeType = type;
      this.switchChannelVisible();
      return;
    }
    if (!channel.allowPublicUpload && nowStation.role > 4) {
      message.info("您没有权限发布到当前频道中！");
      return;
    }

    switch (type) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: "?type=new",
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
          search: "?type=new",
        });
        break;
      case "page":
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&stationKey=${nowStation._key}&channelKey=${this.channelKey}`,
          "_blank"
        );
        break;
      case "link":
        history.push({
          pathname: `/${stationDomain}/home`,
        });
        clearStoryDetail();
        switchEditLinkVisible();
        break;
      default:
        break;
    }
    this.switchExtButton();
  }

  // 点击选择频道下一步按钮
  handleSelectedChannel() {
    if (!this.channelKey) {
      return message.info("请选择投稿主题！");
    }
    if (this.channelKey === "allSeries") {
      this.channelKey = "";
    }
    const { history, nowStation, switchEditLinkVisible } = this.props;
    const stationDomain = nowStation.domain;

    // pc端默认进入文章编辑，手机端则进入简版
    if (!util.common.isMobile()) {
      this.contributeType = "article";
    }

    switch (this.contributeType) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: `?type=new&channel=${this.channelKey}`,
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
          search: `?type=new&channel=${this.channelKey}`,
        });
        break;
      case "page":
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&stationKey=${nowStation._key}&channelKey=${this.channelKey}`,
          "_blank"
        );

        break;
      case "link":
        switchEditLinkVisible();
        break;
      default:
        history.push(
          `/${stationDomain}/create/${this.channelKey || "allSeries"}`
        );
        break;
    }
    this.setState({ showSelectChannel: false });
  }

  switchChannelVisible() {
    const { nowStation, user, nowChannelKey, clearStoryDetail } = this.props;
    clearStoryDetail();
    if (user.isGuest) {
      message.info("请先登录！");
      const redirect = `${window.location.protocol}//${window.location.host}/account/login?redirect_uri=/${nowStation.domain}/home`;
      const logo = nowStation.logo;
      window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
      return;
    }
    if (nowChannelKey !== "todoallSeries") {
      const isMobile = util.common.isMobile();
      // 网站类型是门户类型
      if (nowStation.style === 2 && !isMobile) {
        if (window.location.pathname.includes("/catalog/")) {
          this.channelKey = window.location.pathname.split("/catalog/")[1];
        } else if (window.location.pathname.includes("/detail/")) {
          this.channelKey = window.location.pathname.split("/detail/")[1];
        } else {
          this.setState((prevState) => ({
            showSelectChannel: !prevState.showSelectChannel,
          }));
          return;
        }
      } else {
        this.channelKey = nowChannelKey;
      }
      this.handleSelectedChannel();
    } else {
      this.setState((prevState) => ({
        showSelectChannel: !prevState.showSelectChannel,
      }));
    }
  }

  handleSelectChannel(value) {
    this.channelKey = value;
  }

  render() {
    const {
      location,
      nowChannel = {},
      nowStation,
      eidtLinkVisible,
    } = this.props;
    const { showSelectChannel } = this.state;
    const { isCareStar = 0, seriesInfo = [] } = nowStation;

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

    // 仅显示文章内容
    const onlyContent = util.common.getSearchParamValue(
      window.location.search,
      "onlyContent"
    );
    // 隐藏投稿按钮
    const hidePostButton = util.common.getSearchParamValue(
      window.location.search,
      "hidePostButton"
    );

    return location.pathname.includes("/editArticle") ||
      location.pathname.includes("/editStory") ||
      location.pathname.includes("/stationOptions") ||
      location.pathname.includes("/create") ? null : (
      <div className="multi-button">
        {onlyContent || hidePostButton ? null : (
          <Tooltip title="投稿" placement="left">
            <div
              className="story-tool add-story-multi"
              onClick={this.switchChannelVisible}
            >
              {/* <i></i> */}
              投稿
            </div>
          </Tooltip>
        )}

        <ReactCSSTransitionGroup
          transitionName="myFade"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.showExtButton ? (
            <ClickOutside onClickOutside={this.switchExtButton}>
              <div className="ext-buttons">
                <Tooltip title="图文形式" placement="top">
                  <div
                    className="story-tool add-album"
                    onClick={this.handleClickAdd.bind(
                      this,
                      nowChannel,
                      "album"
                    )}
                  >
                    <i></i>
                  </div>
                </Tooltip>
                <Tooltip title="文章形式" placement="top">
                  <div
                    className="story-tool add-article"
                    onClick={this.handleClickAdd.bind(
                      this,
                      nowChannel,
                      "article"
                    )}
                  >
                    <i></i>
                  </div>
                </Tooltip>
                {nowStation.role && nowStation.role <= 3
                  ? [
                      <Tooltip key="add-page" title="网页形式" placement="top">
                        <div
                          className="story-tool add-page"
                          onClick={this.handleClickAdd.bind(
                            this,
                            nowChannel,
                            "page"
                          )}
                        >
                          <i></i>
                        </div>
                      </Tooltip>,
                      <Tooltip key="add-link" title="链接形式" placement="top">
                        <div
                          className="story-tool add-link"
                          onClick={this.handleClickAdd.bind(
                            this,
                            nowChannel,
                            "link"
                          )}
                        >
                          <i></i>
                        </div>
                      </Tooltip>,
                    ]
                  : null}
              </div>
            </ClickOutside>
          ) : null}
        </ReactCSSTransitionGroup>
        <Modal
          title="请选择投稿主题"
          visible={showSelectChannel}
          okText="下一步"
          cancelText="取消"
          onOk={this.handleSelectedChannel}
          onCancel={this.switchChannelVisible}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="请选择投稿主题"
            onChange={this.handleSelectChannel}
          >
            {channelList.map((channel, index) =>
              channel.isSeeSeries &&
              (channel.allowPublicUpload ||
                (!channel.allowPublicUpload &&
                  channel.role &&
                  channel.role <= 5)) ? (
                <Option key={index} value={channel._key}>
                  {channel.name}
                </Option>
              ) : (
                <Option key={index} value={channel._key} disabled>
                  {channel.name}
                </Option>
              )
            )}
          </Select>
        </Modal>
        {eidtLinkVisible ? <StroyLink /> : null}
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, { switchEditLinkVisible, clearStoryDetail })(
    AddButton
  )
);
