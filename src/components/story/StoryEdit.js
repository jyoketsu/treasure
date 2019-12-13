import React, { Component } from "react";
import "./StoryEdit.css";
import { withRouter } from "react-router-dom";
import { Button, Tooltip, message, Input, Modal, Select } from "antd";
import { FileUpload } from "../common/Form";
import util from "../../services/Util";
import api from "../../services/Api";
import DragSortableList from "react-drag-sortable";
import { connect } from "react-redux";
import { addStory, modifyStory, deleteStory } from "../../actions/app";
const confirm = Modal.confirm;
const Option = Select.Option;

const mapStateToProps = state => ({
  seriesInfo: state.station.nowStation
    ? state.station.nowStation.seriesInfo
    : [],
  user: state.auth.user,
  story: state.story.story,
  nowChannelKey: state.story.nowChannelKey,
  nowStation: state.station.nowStation,
  nowStationKey: state.station.nowStationKey,
  storyList: state.story.storyList,
  loading: state.common.loading,
  flag: state.common.flag
});

class StoryEdit extends Component {
  constructor(props) {
    super(props);
    let type = util.common.getSearchParamValue(props.location.search, "type");
    let story =
      type === "new"
        ? {
            series: {
              _key:
                util.common.getSearchParamValue(
                  window.location.search,
                  "channel"
                ) || props.nowChannelKey
            }
          }
        : props.story;
    this.state = {
      story: story,
      selectedItemId: null,
      selectedItemIndex: null,
      musicPanelvisible: false,
      musicAddress: story.backGroundMusic
    };
    this.addContent = this.addContent.bind(this);
    this.uploadImageCallback = this.uploadImageCallback.bind(this);
    this.uploadVideoCallback = this.uploadVideoCallback.bind(this);
    this.uploadCoverCallback = this.uploadCoverCallback.bind(this);
    this.deleteContent = this.deleteContent.bind(this);
    this.showDeleteContentConfirm = this.showDeleteContentConfirm.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.selectChannel = this.selectChannel.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.handleSelectItem = this.handleSelectItem.bind(this);
    this.onSort = this.onSort.bind(this);
    this.switchMusic = this.switchMusic.bind(this);
    this.handleMusicInput = this.handleMusicInput.bind(this);
    this.setMusic = this.setMusic.bind(this);
    this.handleSetTag = this.handleSetTag.bind(this);
    this.handleSetStatus = this.handleSetStatus.bind(this);
    this.handleSelectChannel = this.handleSelectChannel.bind(this);
  }

  switchMusic() {
    this.setState(prevState => ({
      musicPanelvisible: !prevState.musicPanelvisible
    }));
  }

  handleCancel() {
    this.props.history.goBack();
  }

  async handleCommit() {
    const {
      user,
      nowStationKey,
      addStory,
      modifyStory,
      seriesInfo
    } = this.props;
    const { story } = this.state;
    if (!story || (!story.series && !story._key)) {
      message.info("请选择一个频道！");
      return;
    }
    if (!story || !story.title) {
      message.info("请输入标题！");
      return;
    }
    if (!story.pictureCount && !story.videoCount) {
      message.info("请至少上传一张图片/视频！");
      return;
    }
    if (story.pictureCount > 200) {
      message.info("不能超过200张图片！");
      return;
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

    if (tag && !story.tag && allowPublicTag) {
      message.info("请选择一个标签！");
      return;
    }

    if (typeof story.series === "object") {
      story.series = story.series._key;
    }
    // 编辑
    if (story._key) {
      story.key = story._key;
      // 封面大小
      let size = await util.common.getImageInfo(story.cover);
      story.size = size;
      for (let i = 0; i < story.richContent.length; i++) {
        if (story.richContent[i].metaType === "image") {
          delete story.richContent[i].exif;
        }
      }
      modifyStory(story);
    } else {
      // 新增
      // 封面大小
      let size = await util.common.getImageInfo(story.cover);
      Object.assign(story, {
        userKey: user._key,
        type: 6,
        starKey: nowStationKey,
        publish: 1,
        size: size,
        isSimple: 0
      });
      addStory(story);
    }
  }

  /**
   * 添加内容
   * @param {Number} index 要添加的位置
   * @param {String} contentType 内容类型
   */
  addContent(index, metaType) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let { richContent: prevContent = [] } = prevStory;
      prevContent.splice(index ? index + 1 : prevContent.length, 0, {
        _id: util.common.randomStr(false, 12),
        metaType: metaType,
        memo: ""
      });
      prevStory.richContent = prevContent;
      this.scrollDown = true;
      return { story: prevStory };
    });
  }

  /**
   * 故事图片上传回调
   * @param {Array} images 图片url数组
   * @param {Object} extParams 参数
   */
  uploadImageCallback(images, extParams) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let { richContent: prevContent = [] } = prevStory;
      let index =
        extParams && extParams.index
          ? extParams.index + 1
          : prevStory.richContent
          ? prevStory.richContent.length
          : 0;

      for (let i = 0; i < images.length; i++) {
        let size = util.common.getImageInfo(images[i]);
        prevContent.splice(index, 0, {
          _id: util.common.randomStr(false, 12),
          metaType: "image",
          url: images[i],
          size: size,
          memo: ""
        });
        if (typeof prevStory.pictureCount === "number") {
          prevStory.pictureCount = prevStory.pictureCount + 1;
        } else {
          prevStory.pictureCount = 1;
        }
      }
      prevStory.richContent = prevContent;

      // 设置封面
      if (!prevStory.cover) {
        prevStory.cover = images[0];
      }
      this.scrollDown = true;
      return { story: prevStory };
    });
  }

  /**
   * 故事视频上传回调
   * @param {Array} videoUrl 视频url
   * @param {Object} extParams 参数
   */
  uploadVideoCallback(videoUrl, extParams) {
    if (videoUrl.length !== 0) videoUrl = videoUrl[0];
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let { richContent: prevContent = [] } = prevStory;

      let index =
        extParams && extParams.index
          ? extParams.index + 1
          : prevStory.richContent
          ? prevStory.richContent.length
          : 0;

      prevContent.splice(index, 0, {
        _id: util.common.randomStr(false, 12),
        metaType: "video",
        url: videoUrl,
        thumbnailUrl: `${videoUrl}?vframe/jpg/offset/1`,
        memo: ""
      });
      prevStory.richContent = prevContent;
      this.scrollDown = true;

      if (typeof prevStory.videoCount === "number") {
        prevStory.videoCount = prevStory.videoCount + 1;
      } else {
        prevStory.videoCount = 1;
      }
      // 设置封面
      if (!prevStory.cover) {
        prevStory.cover = `${videoUrl}?vframe/jpg/offset/1`;
      }

      return { story: prevStory };
    });
  }

  /**
   * 封面图片上传回调
   * @param {Array} images 图片url数组
   */
  uploadCoverCallback(images) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      // 设置封面
      prevStory.cover = images[0];
      return { story: prevStory };
    });
  }

  setMusic() {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let regex1 = /<iframe.*?(?:>|\/>)/gi;
      if (regex1.test(prevState.musicAddress)) {
        prevStory.backGroundMusic = prevState.musicAddress;
        return { story: prevStory, musicPanelvisible: false };
      } else {
        message.info("外链格式不正确！");
        return null;
      }
    });
  }

  handleSetTag(value) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      prevStory.tag = value;
      return { story: prevStory };
    });
  }

  handleSetStatus(value) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      prevStory.statusTag = value;
      return { story: prevStory };
    });
  }

  handleSelectChannel(value) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      prevStory.series = { _key: value };
      prevStory.tag = undefined;
      return { story: prevStory };
    });
  }

  /**
   * 删除内容
   * @param {Number} index 要删除的位置
   */
  deleteContent(index, metaType) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let { richContent: prevContent = [] } = prevStory;
      prevContent.splice(index, 1);
      if (metaType === "image") {
        prevStory.pictureCount = prevStory.pictureCount - 1;
      }
      if (metaType === "video") {
        prevStory.videoCount = prevStory.videoCount - 1;
      }
      prevStory.richContent = prevContent;
      return { story: prevStory };
    });
  }

  showDeleteContentConfirm(index, metaType, e) {
    e.stopPropagation();
    let that = this;
    confirm({
      title: "删除",
      content: `确定要删除吗？`,
      okText: "Yes",
      okType: "danger",

      cancelText: "No",
      onOk() {
        that.deleteContent(index, metaType, e);
      }
    });
  }

  handleInput(name, index, event) {
    const { story = {} } = this.state;
    let changedStory = JSON.parse(JSON.stringify(story));
    const value = event.target.value;
    if (name === "title") {
      changedStory.title = value;
    } else {
      let richContent = changedStory.richContent;
      richContent[index].memo = value;
    }
    this.setState({ story: changedStory });
  }

  handleMusicInput(e) {
    this.setState({ musicAddress: e.target.value });
  }

  selectChannel(value) {
    const { story = {} } = this.state;
    let changedStory = JSON.parse(JSON.stringify(story));
    changedStory.series = value;
    this.setState({ story: changedStory });
  }

  selectAddress(value) {
    const { story = {} } = this.state;
    let changedStory = JSON.parse(JSON.stringify(story));
    changedStory.address = value;
    this.setState({ story: changedStory });
  }

  showDeleteConfirm(key) {
    const { deleteStory } = this.props;
    confirm({
      title: "删除",
      content: `确定要删除吗？`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        deleteStory(key);
      }
    });
  }

  onSort(sortedList) {
    this.setState(prevState => {
      let { story: prevStory = {} } = prevState;
      let richContent = [];
      for (let i = 0; i < sortedList.length; i++) {
        richContent.push(sortedList[i].content.props.content);
      }
      prevStory.richContent = richContent;
      return { story: prevStory };
    });
  }

  handleSelectItem(index, id, dragable, e) {
    if (!dragable) {
      e.stopPropagation();
      this.setState({ selectedItemId: id, selectedItemIndex: index });
    }
  }

  render() {
    const { seriesInfo, inline } = this.props;
    const {
      story = {},
      selectedItemId,
      selectedItemIndex,
      musicAddress
    } = this.state;
    const { cover, title = "", richContent = [], address, time } = story;
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
      role
    } = channelInfo;

    let items = [];
    if (!inline) {
      for (let i = 0; i < richContent.length; i++) {
        items.push({
          content: (
            <EditItem
              index={i}
              content={richContent[i]}
              handleSelect={this.handleSelectItem}
              handleDelete={this.showDeleteContentConfirm}
              selectedId={selectedItemId}
            />
          )
        });
      }
    } else {
      items = (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap"
          }}
        >
          {richContent.map((item, index) => (
            <EditItem
              key={index}
              index={index}
              content={item}
              handleSelect={this.handleSelectItem}
              handleDelete={this.showDeleteContentConfirm}
              selectedId={selectedItemId}
            />
          ))}
        </div>
      );
    }

    let placeholder = <div className="placeholderContent">拖放到这里</div>;

    return (
      <div className={`app-content story-edit ${inline ? "inline" : ""}`}>
        <div className="story-edit-head-buttons">
          <Button onClick={this.handleCancel}>取消</Button>
          {story._key ? (
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
        <div
          className="story-edit-head"
          style={{
            backgroundImage: cover
              ? `url(${cover}?imageView2/2/w/960/)`
              : "url(/image/background/background.png)",
            backgroundSize: cover ? "cover" : "contain",
            backgroundPosition: cover ? "center" : "bottom"
          }}
        >
          <div className="top-right-buttons">
            {seriesInfo.length ? (
              <Select
                style={{ width: 120 }}
                placeholder="请选择频道"
                value={nowChannelId}
                onChange={this.handleSelectChannel}
              >
                {seriesInfo.map((item, index) =>
                  (item.role && item.role < 5) || item.allowPublicUpload ? (
                    <Option key={index} value={item._key}>
                      {item.name}
                    </Option>
                  ) : null
                )}
              </Select>
            ) : null}
          </div>
          <div className="left-bottom-buttons">
            {tag &&
            (allowPublicTag || (!allowPublicTag && role && role < 4)) ? (
              <Select
                style={{ width: 120 }}
                placeholder="请选择标签"
                value={story.tag}
                onChange={this.handleSetTag}
              >
                {tag.split(" ").map((item, index) => {
                  let tagName = item;
                  let tagValue = item;
                  if (util.common.isJSON(item)) {
                    tagName = JSON.parse(item).name;
                    tagValue = JSON.parse(item).id;
                  }
                  return (
                    <Option key={index} index={index} value={tagValue}>
                      {tagName}
                    </Option>
                  );
                })}
              </Select>
            ) : null}
          </div>
          <div className="left-top-buttons">
            {statusTag &&
            (allowPublicStatus || (!allowPublicStatus && role && role < 4)) ? (
              <Select
                style={{ width: 120 }}
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
          </div>
          <div className="story-edit-cover-buttons">
            <FileUpload
              className="story-image-icon"
              style={{
                width: "84px",
                height: "32px",
                lineHeight: "32px",
                color: "#fff",
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "4px",
                fontStyle: "normal",
                textAlign: "center"
              }}
              text="设置封面"
              maxSize={10000000}
              callback={this.uploadCoverCallback}
            />
            <Button type="primary" onClick={this.switchMusic}>
              设置音乐
            </Button>
          </div>
        </div>
        <StoryEditTitle
          title={title}
          address={address}
          time={time}
          handleInput={this.handleInput}
        />
        <div className="main-content story-content story-edit-container">
          <div className="drag-item-container">
            {inline ? (
              items
            ) : (
              <DragSortableList
                items={items}
                dropBackTransitionDuration={0.3}
                onSort={this.onSort}
                type="grid"
                placeholder={placeholder}
              />
            )}
          </div>
          <ItemPreview
            addContent={this.addContent}
            uploadImageCallback={this.uploadImageCallback}
            uploadVideoCallback={this.uploadVideoCallback}
            index={selectedItemIndex}
            itemContent={richContent[selectedItemIndex]}
            handleInput={this.handleInput}
          />
        </div>
        <Modal
          title="设置音乐"
          visible={this.state.musicPanelvisible}
          onOk={this.setMusic}
          onCancel={this.switchMusic}
        >
          <Input
            placeholder="请粘贴音乐外链"
            value={musicAddress}
            onChange={this.handleMusicInput}
          />
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    const { seriesInfo, history, story } = this.props;
    if (seriesInfo.length === 0) {
      history.push(`/${window.location.search}`);
    }
    // 申请编辑
    if (story._key) {
      api.story.applyEdit(story._key, story.updateTime);
    }
    // 位置定位
    if (
      !story.address &&
      (story.address !== "获取位置失败" || story.address !== "")
    ) {
      util.common.getLocation(
        data => {
          console.log("定位信息：", data);
          const address =
            data && data.addressComponent
              ? `${data.addressComponent.province}${data.addressComponent.city}${data.addressComponent.district}${data.addressComponent.township}${data.addressComponent.street}`
              : "地址错误";
          this.selectAddress(address);
        },
        () => {
          this.selectAddress("");
        }
      );
    }
  }

  async componentDidUpdate(prevProps) {
    const { nowStation, history, loading, flag, keep } = this.props;
    const { story } = this.state;
    if (!loading && prevProps.loading && !keep) {
      if (story._key) {
        if (flag === "deleteStory") {
          window.location.href = `${window.location.protocol}//${window.location.host}/${nowStation.domain}`;
        } else {
          history.goBack();
        }
      } else {
        history.goBack();
      }
    }
  }

  static getDerivedStateFromProps(props, state) {
    let type = util.common.getSearchParamValue(props.location.search, "type");

    if (type !== "new" && props.story._key !== state.story._key) {
      console.log("切换了故事");
      return {
        story: props.story,
        selectedItemId: null,
        selectedItemIndex: null,
        musicPanelvisible: false,
        musicAddress: props.story.backGroundMusic
      };
    } else {
      return null;
    }
  }

  componentWillUnmount() {
    const { story } = this.props;
    api.story.exitEdit(story._key);
  }
}

class StoryEditTitle extends Component {
  render() {
    const { address, time, title, handleInput } = this.props;
    return (
      <div className="story-edit-title">
        <input
          className="story-text-title"
          placeholder="点击输入标题"
          value={title}
          onChange={handleInput.bind(this, "title", 0)}
        />
        <div className="story-edit-title-ext">
          <div>
            <i className="story-edit-icon address-icon"></i>
            <span>{address}</span>
          </div>
          <div>
            <i className="story-edit-icon time-icon"></i>
            <span>
              {util.common.timestamp2DataStr(time || new Date(), "yyyy-MM-dd")}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

class EditItem extends Component {
  render() {
    const {
      content,
      handleSelect,
      selectedId,
      handleDelete,
      index
    } = this.props;
    const imageUrl =
      content.metaType !== "video"
        ? content.url
          ? `${content.url}?imageView2/2/w/200/`
          : "/image/icon/icon-article.svg"
        : content.thumbnailUrl;
    const isSelected = selectedId === content._id ? true : false;
    return (
      <div
        className={`story-edit-item ${isSelected ? "selected" : "no-drag"}`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: content.url ? "cover" : "50%"
        }}
        onClick={handleSelect.bind(this, index, content._id, isSelected)}
        onTouchStart={handleSelect.bind(this, index, content._id, isSelected)}
      >
        <div
          className="delete-story-item"
          onClick={handleDelete.bind(this, index, content.metaType)}
          onTouchStart={handleDelete.bind(this, index, content.metaType)}
        ></div>
      </div>
    );
  }
}

class ItemPreview extends Component {
  render() {
    const {
      addContent,
      index,
      uploadImageCallback,
      uploadVideoCallback,
      itemContent,
      handleInput
    } = this.props;
    let result;
    if (itemContent) {
      switch (itemContent.metaType) {
        case "html":
          result = (
            <textarea
              className="story-content-textArea"
              placeholder="点击输入文本"
              value={itemContent.memo}
              onChange={handleInput.bind(this, "richContent", index)}
            />
          );
          break;
        case "header":
          result = (
            <input
              className="story-text-title"
              placeholder="点击输入标题"
              value={itemContent.memo}
              onChange={handleInput.bind(this, "richContent", index)}
            />
          );
          break;
        case "image":
          result = (
            <div className="story-imageGroup" style={{ padding: "5px" }}>
              <Input
                placeholder="请输入图片描述"
                value={itemContent.memo}
                onChange={handleInput.bind(this, "richContent", index)}
              />
              <div className="story-image-box">
                <img
                  className="story-image"
                  src={`${itemContent.url}?imageView2/2/w/600/`}
                  alt="story"
                />
              </div>
            </div>
          );
          break;
        case "video":
          result = (
            <video
              className="story-video"
              src={itemContent.url}
              controls="controls"
            >
              Your browser does not support the video tag.
            </video>
          );
          break;
        default:
          break;
      }
    } else {
      result = <div className="no-selected-item">没有选择内容</div>;
    }

    return (
      <div className="item-preview">
        <div className="item-actions">
          <Tooltip title="添加小标题">
            <div
              className="story-edit-button"
              onClick={addContent.bind(this, index, "header")}
            >
              <i
                style={{ backgroundImage: "url(/image/icon/story-title.png)" }}
                className="story-title-icon"
              ></i>
              <span>标题</span>
            </div>
          </Tooltip>
          <Tooltip title="添加文本">
            <div
              className="story-edit-button"
              onClick={addContent.bind(this, index, "html")}
            >
              <i
                style={{ backgroundImage: "url(/image/icon/story-text.png)" }}
                className="story-text-icon"
              ></i>
              <span>文本</span>
            </div>
          </Tooltip>
          <Tooltip title="点击上传图片">
            <div className="story-edit-button">
              <FileUpload
                className="story-image-icon"
                style={{
                  backgroundImage: "url(/image/icon/story-image.png)",
                  display: "block",
                  width: "24px",
                  height: "24px"
                }}
                maxSize={10000000}
                multiple="multiple"
                extParam={{ index: index }}
                callback={uploadImageCallback}
              />
              <span>图片</span>
            </div>
          </Tooltip>
          <Tooltip title="点击上传视频">
            <div className="story-edit-button">
              <FileUpload
                className="story-video-icon"
                style={{
                  backgroundImage: "url(/image/icon/story-video.png)",
                  display: "block",
                  width: "24px",
                  height: "24px"
                }}
                metaType="video"
                maxSize={200000000}
                extParam={{ index: index }}
                callback={uploadVideoCallback}
              />
              <span>视频</span>
            </div>
          </Tooltip>
        </div>
        <div className="item-preview-editor">{result}</div>
      </div>
    );
  }
}

export default withRouter(
  connect(mapStateToProps, { addStory, modifyStory, deleteStory })(StoryEdit)
);
