import React, { Component } from "react";
import "./EditArticle.css";
import api from "../../services/Api";
import { withRouter } from "react-router-dom";
import { Form, Button, Input, message, Modal, Select, Calendar } from "antd";
import FroalaEditor from "../common/FroalaEditor";
import util from "../../services/Util";
import { connect } from "react-redux";
import {
  getStoryDetail,
  addStory,
  modifyStory,
  deleteStory,
  switchEditLinkVisible,
} from "../../actions/app";
import moment from "moment";
const confirm = Modal.confirm;
const Option = Select.Option;
const { TextArea } = Input;

const mapStateToProps = (state) => ({
  seriesInfo: state.station.nowStation
    ? state.station.nowStation.seriesInfo
    : [],
  user: state.auth.user,
  story: state.story.story,
  nowStation: state.station.nowStation,
  nowChannelKey:
    state.story.nowChannelKey !== "allSeries"
      ? state.story.nowChannelKey
      : undefined,
  nowStationKey: state.station.nowStationKey,
  loading: state.common.loading,
  flag: state.common.flag,
});

class EditArticle extends Component {
  constructor(props) {
    super(props);
    let type = util.common.getSearchParamValue(props.location.search, "type");
    let story =
      type === "new"
        ? {
            content:
              '<p><span class="text-huge"><strong><span style="font-size: 36px;">请输入标题</span></strong></span></p><hr><p>请输入正文</p>',
            series: {
              _key:
                util.common.getSearchParamValue(
                  window.location.search,
                  "channel"
                ) || props.nowChannelKey,
            },
          }
        : props.story;
    if (story._key) {
      story.content = `<p style="text-align:center;"><span class="text-huge"><strong><span style="font-size: 36px;">${story.title}</span></strong></span></p>${story.content}`;
    }
    this.state = {
      story: story,
      uptoken: null,
      moreVisible: false,
      postVisible: false,
      codeEditorVisible: false,
      customTimeVisible: false,
      ready: type === "new" ? true : false,
      customTime: null,
    };
    this.handleCommit = this.handleCommit.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);

    this.getEditor = this.getEditor.bind(this);
    this.handleAticleChange = this.handleAticleChange.bind(this);
    this.switchMoreVisible = this.switchMoreVisible.bind(this);
    this.switchPostVisible = this.switchPostVisible.bind(this);
    this.switchCodeEditor = this.switchCodeEditor.bind(this);
    this.switchCustomTime = this.switchCustomTime.bind(this);

    this.handleSetTag = this.handleSetTag.bind(this);
    this.handleSetStatus = this.handleSetStatus.bind(this);
    this.handleSelectChannel = this.handleSelectChannel.bind(this);

    this.handleSelect = this.handleSelect.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.onSelect = this.onSelect.bind(this);
  }

  handleSetTag(value) {
    this.setState((prevState) => {
      let { story: prevStory = {} } = prevState;
      prevStory.tag = value;
      return { story: prevStory };
    });
  }

  handleSetStatus(value) {
    this.setState((prevState) => {
      let { story: prevStory = {} } = prevState;
      prevStory.statusTag = value;
      return { story: prevStory };
    });
  }

  handleSelectChannel(value) {
    this.setState((prevState) => {
      let { story: prevStory = {} } = prevState;
      prevStory.series = { _key: value };
      prevStory.tag = undefined;
      return { story: prevStory };
    });
  }

  handleAticleChange(model) {
    const { story = {} } = this.state;
    let changedStory = JSON.parse(JSON.stringify(story));
    changedStory.content = model;
    this.setState({ story: changedStory });
  }

  switchMoreVisible() {
    this.setState((prevState) => ({
      moreVisible: !prevState.moreVisible,
    }));
  }

  switchPostVisible(visible) {
    this.setState({
      postVisible: visible,
    });
  }

  switchCodeEditor() {
    this.setState((prevState) => ({
      codeEditorVisible: !prevState.codeEditorVisible,
    }));
  }

  switchCustomTime() {
    this.setState((prevState) => ({
      customTimeVisible: !prevState.customTimeVisible,
    }));
  }

  async handleCommit(e) {
    const {
      nowStation,
      user,
      nowStationKey,
      addStory,
      modifyStory,
      seriesInfo,
      finishCallback,
    } = this.props;
    const { story: orginal, customTime } = this.state;
    e.preventDefault();

    let story = JSON.parse(JSON.stringify(orginal));

    if (!story.series._key) {
      return message.info("请选择投稿主题！");
    }

    let channelInfo = {};
    const nowChannelId = story.series._key;
    for (let i = 0; i < seriesInfo.length; i++) {
      if (seriesInfo[i]._key === nowChannelId) {
        channelInfo = seriesInfo[i];
        break;
      }
    }

    const { tag, allowPublicTag } = channelInfo;

    // 门户版式，标签为必填项
    if (nowStation.style === 2) {
      if (tag && !story.tag) {
        message.info("请选择一个标签！");
        return;
      }
    } else {
      // 其他版式，当标签允许公众设置时，标签为必填项
      if (tag && !story.tag && allowPublicTag) {
        message.info("请选择一个标签！");
        return;
      }
    }

    let imgReg = /<img.*?(?:>|\/>)/gi; //匹配图片中的img标签
    let srcReg = /src=['"]?([^'"]*)['"]?/i; // 匹配图片中的src
    let str = story.content;
    if (str.indexOf("blob:http") !== -1) {
      message.info("图片正在上传，请稍后");
      return;
    }
    let arr = str.match(imgReg); //筛选出所有的img
    if (arr) {
      let src = arr[0].match(srcReg);
      story.cover = src[1];
      // 封面大小
      const res = await util.common.getImageInfo(story.cover);
      if (res) {
        story.size = res;
      } else {
        story.cover = null;
        story.size = null;
      }
    } else {
      story.cover = null;
      story.size = null;
    }

    // 文章标题（文章内容的第1行为标题）
    let title = util.common.getDomFirstChild(story.content);
    if (title) {
      story.title = title.innerText;
      story.content = story.content.replace(title.htmlStr, "");
    }
    if (customTime) {
      story.time = moment(customTime).valueOf();
    }

    // memo
    // 去除标签
    str = story.content;
    let sectionStr = str.replace(/<\/?.+?>/g, "");
    sectionStr = sectionStr.replace(/&nbsp;/g, "");
    story.memo = sectionStr.substr(0, 200);

    if (typeof story.series === "object") {
      story.series = story.series._key;
    }

    // 编辑
    if (story._key) {
      story.key = story._key;
      modifyStory(story);
    } else {
      Object.assign(story, {
        userKey: user._key,
        type: 9,
        starKey: nowStationKey,
      });
      let nodeType = util.common.getSearchParamValue(
        this.props.location.search,
        "nodeType"
      );
      let nodeKey = util.common.getSearchParamValue(
        this.props.location.search,
        "nodeKey"
      );
      addStory(story, nodeType, nodeKey);
    }

    // 跳转
    if (finishCallback) {
      finishCallback();
    } else {
      // 返回到首页
      this.toHome = true;
    }
  }

  showDeleteConfirm(key) {
    const { deleteStory, finishCallback, nowStation, history } = this.props;
    confirm({
      title: "删除",
      content: `确定要删除吗？`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteStory(key);
        // 跳转
        if (finishCallback) {
          finishCallback();
        } else {
          // 返回到首页
          history.push(`/${nowStation.domain}/home`);
        }
      },
    });
  }

  getEditor(editor) {
    this.editor = editor;
  }

  handleSelect(value) {
    this.type = value;
  }

  onSelect(value) {
    this.setState({
      customTime: value,
    });
  }

  handleOk() {
    const { history, location, nowStation, switchEditLinkVisible } = this.props;
    const stationDomain = nowStation ? nowStation.domain : "";
    let channelKey = util.common.getSearchParamValue(
      location.search,
      "channel"
    );
    if (!this.type) {
      return message.info("请选择投稿方式！");
    }
    switch (this.type) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: `?type=new&channel=${channelKey}`,
        });
        break;
      case "page":
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&stationKey=${nowStation._key}&channelKey=${channelKey}`,
          "_blank"
        );
        break;
      case "link":
        history.goBack();
        switchEditLinkVisible();
        break;
      default:
        break;
    }
  }

  render() {
    const { seriesInfo, inline, hideMenu, nowStation } = this.props;
    const { story = {}, uptoken, ready } = this.state;
    let channelInfo = {};
    const nowChannelId = story.series
      ? story.series._key
      : util.common.getSearchParamValue(window.location.search, "channel");
    for (let i = 0; i < seriesInfo.length; i++) {
      if (seriesInfo[i]._key === nowChannelId) {
        channelInfo = seriesInfo[i];
        break;
      }
    }
    const {
      tag,
      allowPublicTag,
      statusTag,
      allowPublicStatus,
      allowPublicUpload,
      role,
    } = channelInfo;
    const isMobile = util.common.isMobile();
    return (
      <div
        className={`app-content edit-story ${inline ? "inline" : ""}`}
        ref={(eidtStory) => (this.eidtStoryRef = eidtStory)}
      >
        <div
          className="main-content story-content edit-article"
          style={{
            minHeight: `${window.innerHeight}px`,
          }}
        >
          <div
            className="editor-container"
            ref={(node) => (this.editorRef = node)}
          >
            {uptoken && ready ? (
              <FroalaEditor
                data={story ? story.content : ""}
                handleChange={this.handleAticleChange}
                uptoken={uptoken}
                handleClickMore={this.switchMoreVisible}
                handleClickMoreStyle={this.switchPostVisible}
                openCodeEditor={this.switchCodeEditor}
                openCustomTime={this.switchCustomTime}
                inline={inline}
                hideMenu={hideMenu}
              />
            ) : null}
          </div>
          <div className="article-footer">
            {story._key && !inline ? (
              <Button
                type="danger"
                onClick={this.showDeleteConfirm.bind(this, story._key)}
              >
                删除
              </Button>
            ) : null}
            <Button type="primary" onClick={this.handleCommit}>
              保存
            </Button>
          </div>
        </div>
        <Modal
          className="article-options-modal"
          title="文章设定"
          visible={this.state.moreVisible}
          onOk={this.switchMoreVisible}
          onCancel={this.switchMoreVisible}
        >
          <Select
            style={{ width: 200 }}
            placeholder="请选择频道"
            value={
              (role && role <= 5) || allowPublicUpload
                ? nowChannelId
                : undefined
            }
            onChange={this.handleSelectChannel}
          >
            {seriesInfo.map((item, index) =>
              (item.role && item.role <= 5) || item.allowPublicUpload ? (
                <Option key={index} value={item._key}>
                  {item.name}
                </Option>
              ) : null
            )}
          </Select>
          {tag && (allowPublicTag || (!allowPublicTag && role && role < 4)) ? (
            <Select
              style={{ width: 200 }}
              placeholder="请选择标签"
              value={story.tag}
              onChange={this.handleSetTag}
            >
              {tag.split(" ").map((item, index) => {
                let tagName = item;
                let tagValue = item;
                let disabled = false;
                if (util.common.isJSON(item)) {
                  const obj = JSON.parse(item);
                  tagName = obj.name;
                  tagValue = obj.id;
                  disabled = obj.disabled;
                }
                return disabled ? null : (
                  <Option key={index} index={index} value={tagValue}>
                    {tagName}
                  </Option>
                );
              })}
            </Select>
          ) : null}
          {statusTag &&
          (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ? (
            <Select
              style={{ width: 200 }}
              placeholder="请选择状态"
              value={story.statusTag}
              onChange={this.handleSetStatus}
            >
              <Option key="none" index="" value="">
                无
              </Option>
              {statusTag.split(" ").map((item, index) => (
                <Option key={index} index={index} value={item}>
                  {item}
                </Option>
              ))}
            </Select>
          ) : null}
        </Modal>
        <Modal
          title="更多投稿方式"
          visible={this.state.postVisible}
          okText="选择"
          cancelText="取消"
          onOk={this.handleOk}
          onCancel={() => this.switchPostVisible(false)}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="请选择投稿方式"
            onChange={this.handleSelect}
          >
            <Option key={0} value="album">
              图文
            </Option>
            {/* 手机端、非站长、主站隐藏链接和网站 */}
            {isMobile ||
            (nowStation && nowStation.role > 1) ||
            (nowStation && nowStation.isMainStar) ? null : (
              <Option key={0} value="link">
                链接
              </Option>
            )}
            {isMobile ||
            (nowStation && nowStation.role > 1) ||
            (nowStation && nowStation.isMainStar) ? null : (
              <Option key={0} value="page">
                网页
              </Option>
            )}
          </Select>
        </Modal>
        <Modal
          title="文章源码编辑"
          visible={this.state.codeEditorVisible}
          width={document.body.clientWidth - 50}
          okText="确定"
          cancelText="取消"
          onOk={() => this.switchCodeEditor()}
          onCancel={() => this.switchCodeEditor()}
        >
          <TextArea
            rows={20}
            value={story ? story.content : ""}
            onChange={(e) => {
              this.handleAticleChange(e.target.value);
            }}
          />
        </Modal>
        <Modal
          title="自定义时间"
          visible={this.state.customTimeVisible}
          onOk={this.switchCustomTime}
          onCancel={() => {
            this.setState({
              customTime: null,
            });
            this.switchCustomTime();
          }}
        >
          <Calendar
            fullscreen={false}
            onSelect={this.onSelect}
            onPanelChange={this.onSelect}
          />
        </Modal>
      </div>
    );
  }

  async componentDidMount() {
    const { location, story, getStoryDetail } = this.props;
    // 获取七牛token
    let res = await api.auth.getUptoken(localStorage.getItem("TOKEN"));
    if (res.msg === "OK") {
      this.setState({ uptoken: res.result });
    } else {
      message.info({ text: res.msg });
    }

    if (location && !story._key) {
      let storyKey = util.common.getSearchParamValue(location.search, "key");
      if (storyKey) {
        getStoryDetail(storyKey);
      }
    }
    if (story._key && story.updateTime) {
      const res = await api.story.applyEdit(story._key, story.updateTime);
      if (res.statusCode === "200") {
        this.setState({ ready: true });
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { loading, history, story, nowStation } = this.props;
    // 编辑完成后返回首页
    if (prevProps.loading && !loading && this.toHome) {
      history.push(`/${nowStation.domain}/home`);
    }
    // 获取到故事详情后
    const prevStoryKey = prevProps.story ? prevProps.story._key : null;
    if (prevStoryKey !== story._key) {
      this.setState({
        story: story,
      });
      // api.story.applyEdit(story._key, story.updateTime);
    }
  }

  componentWillUnmount() {
    const { story } = this.props;
    if (story._key) {
      api.story.exitEdit(story._key);
    }
  }
}

export default withRouter(
  connect(mapStateToProps, {
    getStoryDetail,
    addStory,
    modifyStory,
    deleteStory,
    switchEditLinkVisible,
  })(Form.create({ name: "create-station" })(EditArticle))
);
