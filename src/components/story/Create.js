import React, { useState, useRef, useEffect } from "react";
import "./Create.css";
import { Select, message, Modal } from "antd";
import { FileUpload } from "../common/Form";
import StroyLink from "./Link";
import util from "../../services/Util";
import { useHistory, useRouteMatch } from "react-router-dom";
import { addStory, switchEditLinkVisible } from "../../actions/app";
import { useSelector, useDispatch } from "react-redux";

export default function Create() {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const history = useHistory();
  const eidtLinkVisible = useSelector(state => state.story.eidtLinkVisible);
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);
  const [storyTag, setStoryTag] = useState();
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);

  const seriesInfo = nowStation ? nowStation.seriesInfo : [];
  let channelInfo = {};
  const nowChannelId = match.params.channelKey;
  for (let i = 0; i < seriesInfo.length; i++) {
    if (seriesInfo[i]._key === nowChannelId) {
      channelInfo = seriesInfo[i];
      break;
    }
  }

  async function handleCommit() {
    const { tag } = channelInfo;
    if (tag && !storyTag) {
      return message.info("请选择标签");
    }
    if (!images.length) {
      return message.info("至少选择一张图片");
    }
    if (!value) {
      return message.info("请输入内容");
    }
    let size = await util.common.getImageInfo(images[0]);
    const story = {
      title: value.substr(0, 100),
      type: 6,
      cover: images[0],
      size: size,
      userKey: user._key,
      starKey: nowStation._key,
      publish: 1,
      isSimple: 1,
      series: match.params.channelKey,
      tag: storyTag,
      richContent: [
        {
          _id: util.common.randomStr(false, 12),
          metaType: "html",
          memo: value
        },
        ...images.map((image, index) => ({
          _id: util.common.randomStr(false, 12),
          metaType: "image",
          url: image
        }))
      ]
    };
    addStory(story, dispatch);
    history.goBack();
  }
  return (
    <div className="create-story">
      <Head handleCommit={handleCommit} />
      <div className="create-story-content">
        <Content
          value={value}
          setValue={setValue}
          images={images}
          setImages={setImages}
        />
      </div>
      <Action
        value={value}
        images={images}
        setImages={setImages}
        storyTag={storyTag}
        setStoryTag={setStoryTag}
        channelInfo={channelInfo}
      />
      {eidtLinkVisible ? <StroyLink /> : null}
    </div>
  );
}

function Head({ handleCommit }) {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  return (
    <div className="village-stories-head create-head">
      <div>
        <i className="back" onClick={() => history.goBack()}></i>
        <div className="right-section">
          <i className="more" onClick={() => setVisible(true)}></i>
          <span onClick={() => handleCommit()}>发布</span>
        </div>
      </div>
      <More visible={visible} setVisible={setVisible} />
    </div>
  );
}

function Action({
  value,
  storyTag,
  setStoryTag,
  images,
  setImages,
  channelInfo
}) {
  const Option = Select.Option;

  const { tag, allowPublicTag, role } = channelInfo;

  function uploadImageCallback(imgs) {
    let newImages = [...images, ...imgs];
    setImages(newImages);
  }

  function handleSetTag(value) {
    setStoryTag(value);
  }

  return (
    <div className="create-action">
      <div className="left-section">
        <FileUpload
          className="create-foot-upload"
          multiple="multiple"
          maxSize={10000000}
          callback={uploadImageCallback}
        />
        {tag && (allowPublicTag || (!allowPublicTag && role && role < 4)) ? (
          <Select
            style={{ width: 120 }}
            placeholder="请选择标签"
            value={storyTag}
            onChange={handleSetTag}
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
      <div className="right-section">
        <span>{`${value.length}字`}</span>
      </div>
    </div>
  );
}

function Content({ value, setValue, images, setImages }) {
  const imagesWrapperEl = useRef(null);
  const contentEl = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [textareaHeight, setTextareaHeight] = useState(0);

  function handleRemove(index) {
    let newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  }
  useEffect(() => {
    setItemWidth(
      imagesWrapperEl.current
        ? `${Math.floor((imagesWrapperEl.current.offsetWidth - 20) / 3)}px`
        : 0
    );
    setTextareaHeight(
      contentEl.current
        ? contentEl.current.offsetHeight > 90
          ? contentEl.current.offsetHeight + 30
          : 90 + 30
        : 0
    );
  }, []);
  function handleChange(value) {
    setValue(value);
    setTextareaHeight(
      contentEl.current
        ? contentEl.current.offsetHeight > 90
          ? contentEl.current.offsetHeight + 30
          : 90 + 30
        : 0
    );
  }
  return (
    <div className="content-wrapper">
      <div className="create-text" style={{ height: `${textareaHeight}px` }}>
        <div className="text-wrapper">
          <pre className="content" ref={contentEl}>
            {value}
          </pre>
          <textarea
            placeholder="说点什么吧..."
            value={value}
            style={{ height: `${textareaHeight}px` }}
            onChange={e => handleChange(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div
        className="images-wrapper"
        ref={imagesWrapperEl}
        style={{
          maxHeight: `${window.innerHeight / 2}px`,
          opacity: images.length ? 1 : 0
        }}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            index={index}
            image={image}
            itemWidth={itemWidth}
            handleRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}

function Image({ index, image, itemWidth, handleRemove }) {
  return (
    <div
      className="create-image-item"
      style={{
        width: itemWidth,
        height: itemWidth
      }}
    >
      <img src={image} alt="上传图片"></img>
      <div onClick={() => handleRemove(index)}></div>
    </div>
  );
}

function More({ visible, setVisible }) {
  const Option = Select.Option;
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const stationDomain = nowStation ? nowStation.domain : "";
  let type;
  function handleSelect(value) {
    type = value;
  }
  function handleOk() {
    if (!type) {
      return message.info("请选择投稿方式！");
    }
    switch (type) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: `?type=new&channel=${match.params.channelKey}`
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
          search: `?type=new&channel=${match.params.channelKey}`
        });
        break;
      case "page":
        const token = localStorage.getItem("TOKEN");
        window.open(
          `https://editor.qingtime.cn?token=${token}&stationKey=${nowStation._key}&channelKey=${match.params.channelKey}`,
          "_blank"
        );
        break;
      case "link":
        switchEditLinkVisible(dispatch);
        setVisible(false);
        break;
      default:
        break;
    }
  }
  return (
    <Modal
      title="更多投稿方式"
      visible={visible}
      okText="选择"
      cancelText="取消"
      onOk={handleOk}
      onCancel={() => setVisible(false)}
    >
      <Select
        style={{ width: "100%" }}
        placeholder="请选择投稿方式"
        onChange={handleSelect}
      >
        <Option key={0} value="album">
          图文
        </Option>
        <Option key={0} value="article">
          文章
        </Option>
        <Option key={0} value="link">
          链接
        </Option>
        <Option key={0} value="page">
          网页
        </Option>
      </Select>
    </Modal>
  );
}
