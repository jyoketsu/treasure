import React, { Component } from "react";
import StroyLink from "./story/Link";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import { Modal, Tooltip, message, Select } from "antd";
import { withRouter } from "react-router-dom";
import { switchEditLinkVisible } from "../actions/app";
import { connect } from "react-redux";
import ClickOutside from "./common/ClickOutside";

const { Option } = Select;

const mapStateToProps = state => ({
  user: state.auth.user,
  nowStation: state.station.nowStation,
  nowChannelKey: state.story.nowChannelKey,
  eidtLinkVisible: state.story.eidtLinkVisible
});

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showExtButton: false,
      showSelectChannel: false
    };
    this.handleClickAdd = this.handleClickAdd.bind(this);
    this.switchExtButton = this.switchExtButton.bind(this);
    this.switchChannelVisible = this.switchChannelVisible.bind(this);
    this.handleSelectedChannel = this.handleSelectedChannel.bind(this);
    this.handleSelectChannel = this.handleSelectChannel.bind(this);
  }
  switchExtButton() {
    this.setState(prevState => ({
      showExtButton: !prevState.showExtButton
    }));
  }

  handleClickAdd(channel, type) {
    const {
      history,
      user,
      nowChannelKey,
      match,
      nowStation,
      switchEditLinkVisible
    } = this.props;
    const stationDomain = match.params.id;
    if (user.isGuest) {
      message.info("请先登录！");
      return;
    }
    if (type !== "link" && nowChannelKey === "allSeries") {
      this.contributeType = type;
      this.switchChannelVisible();
      return;
    }
    if (!channel.allowPublicUpload && !nowStation.editRight) {
      message.info("您没有权限发布到当前频道中！");
      return;
    }

    switch (type) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: "?type=new"
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
          search: "?type=new"
        });
        break;
      case "page":
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&stationKey=${nowStation._key}&channelKey=${nowChannelKey}`,
          "_blank"
        );
        break;
      case "link":
        switchEditLinkVisible();
        break;
      default:
        break;
    }
    this.switchExtButton();
  }

  handleSelectedChannel() {
    const { match, history, nowStation, switchEditLinkVisible } = this.props;
    const stationDomain = match.params.id;
    switch (this.contributeType) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: `?type=new&channel=${this.channelKey}`
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
          search: `?type=new&channel=${this.channelKey}`
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
        break;
    }
    this.switchChannelVisible();
  }

  switchChannelVisible() {
    this.setState(prevState => ({
      showSelectChannel: !prevState.showSelectChannel
    }));
  }

  handleSelectChannel(value) {
    this.channelKey = value;
  }

  render() {
    const { nowChannel = {}, nowStation, eidtLinkVisible } = this.props;
    const { showSelectChannel } = this.state;
    const { isCareStar, seriesInfo = [] } = nowStation;

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
      <div className="multi-button">
        <Tooltip title="投稿" placement="bottom">
          <div
            className="story-tool add-story-multi"
            onClick={this.switchExtButton}
          >
            <i></i>
          </div>
        </Tooltip>
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
                      </Tooltip>
                    ]
                  : null}
              </div>
            </ClickOutside>
          ) : null}
        </ReactCSSTransitionGroup>
        <Modal
          title="请选择投稿主题"
          visible={showSelectChannel}
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
                  channel.role < 5)) ? (
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
  connect(
    mapStateToProps,
    { switchEditLinkVisible }
  )(AddButton)
);
