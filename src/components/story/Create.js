import React, { useState, useRef, useEffect } from "react";
import "./Create.css";
import { Select, message, Modal, Button } from "antd";
import { FileUpload } from "../common/Form";
import StroyLink from "./Link";
import util from "../../services/Util";
import { useHistory, useRouteMatch } from "react-router-dom";
import { addStory, switchEditLinkVisible } from "../../actions/app";
import { useSelector, useDispatch } from "react-redux";

export default function Create() {
  const dispatch = useDispatch();
  const history = useHistory();
  const eidtLinkVisible = useSelector((state) => state.story.eidtLinkVisible);
  const user = useSelector((state) => state.auth.user);
  const nowStation = useSelector((state) => state.station.nowStation);
  const nowChannelKey = useSelector((state) =>
    state.story.nowChannelKey !== "allSeries"
      ? state.story.nowChannelKey
      : undefined
  );
  const [storyTag, setStoryTag] = useState();
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [channelKey, setChannelKey] = useState(nowChannelKey);

  const seriesInfo = nowStation ? nowStation.seriesInfo : [];
  let channelInfo = {};
  for (let i = 0; i < seriesInfo.length; i++) {
    if (seriesInfo[i]._key === channelKey) {
      channelInfo = seriesInfo[i];
      break;
    }
  }

  function handleChangeChannel(value) {
    setChannelKey(value);
    setStoryTag(undefined);
  }

  async function handleCommit() {
    const { tag } = channelInfo;
    if (!channelKey) {
      return message.info("请选择投稿频道");
    }
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
      series: channelKey,
      tag: storyTag,
      pictureCount: images.length,
      richContent: [
        {
          _id: util.common.randomStr(false, 12),
          metaType: "html",
          memo: value,
        },
        ...images.map((image, index) => ({
          _id: util.common.randomStr(false, 12),
          metaType: "image",
          url: image,
        })),
      ],
    };
    addStory(story, undefined, undefined, dispatch);
    history.push(`/${nowStation.domain}/home`);
  }
  return (
    <div className="create-story">
      <Head
        handleCommit={handleCommit}
        nowChannelKey={channelKey}
        onChange={handleChangeChannel}
        storyTag={storyTag}
        setStoryTag={setStoryTag}
        channelInfo={channelInfo}
      />
      <div className="create-story-content">
        <Content
          value={value}
          setValue={setValue}
          images={images}
          setImages={setImages}
        />
      </div>
      <Action />
      {eidtLinkVisible ? <StroyLink /> : null}
    </div>
  );
}

function Head({
  storyTag,
  nowChannelKey,
  handleCommit,
  onChange,
  setStoryTag,
  channelInfo,
}) {
  const Option = Select.Option;
  const history = useHistory();
  const seriesInfo = useSelector((state) =>
    state.station.nowStation ? state.station.nowStation.seriesInfo : []
  );
  const { tag, allowPublicTag, role } = channelInfo;
  const headEl = useRef(null);
  const [selectWidth, setSelectWidth] = useState(0);

  useEffect(() => {
    const headWidth = headEl.current.clientWidth;

    if (headWidth >= 375) {
      setSelectWidth(120);
    } else if (headWidth < 375 && headWidth >= 320) {
      setSelectWidth(100);
    } else {
      setSelectWidth(80);
    }
  }, []);

  return (
    <div className="village-stories-head create-head" ref={headEl}>
      <div>
        <div className="left-section">
          <i className="back" onClick={() => history.goBack()}></i>
          {seriesInfo.length ? (
            <Select
              style={{ width: selectWidth, marginRight: "5px" }}
              placeholder="请选择频道"
              value={
                (channelInfo.role && channelInfo.role <= 5) ||
                channelInfo.allowPublicUpload
                  ? nowChannelKey
                  : undefined
              }
              onChange={(value) => onChange(value)}
            >
              {seriesInfo.map((item, index) =>
                (item.role && item.role <= 5) || item.allowPublicUpload ? (
                  <Option key={index} value={item._key}>
                    {item.name}
                  </Option>
                ) : null
              )}
            </Select>
          ) : null}
          {tag && (allowPublicTag || (!allowPublicTag && role && role < 4)) ? (
            <Select
              style={{ width: selectWidth }}
              placeholder="请选择标签"
              value={storyTag}
              onChange={(value) => setStoryTag(value)}
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
        </div>
        <div className="right-section">
          <Button type="primary" onClick={() => handleCommit()}>
            发布
          </Button>
        </div>
      </div>
    </div>
  );
}

function Action() {
  const [visible, setVisible] = useState(false);

  return (
    <div className="create-action">
      <div className="left-section"></div>
      <div className="right-section">
        <i className="more" onClick={() => setVisible(true)}></i>
      </div>
      <More visible={visible} setVisible={setVisible} />
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

  function uploadImageCallback(imgs) {
    let newImages = [...images, ...imgs];
    setImages(newImages);
  }

  return (
    <div className="content-wrapper">
      <div className="create-text" style={{ height: `${textareaHeight}px` }}>
        <div className="text-wrapper">
          <pre className="content" ref={contentEl}>
            {value}
          </pre>
          <textarea
            placeholder="这一刻的想法..."
            value={value}
            style={{ height: `${textareaHeight}px` }}
            onChange={(e) => handleChange(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div
        className="images-wrapper"
        ref={imagesWrapperEl}
        style={{
          maxHeight: `${window.innerHeight / 2}px`,
          // opacity: images.length ? 1 : 0
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
        <FileUpload
          className="create-foot-upload"
          multiple="multiple"
          maxSize={104857600}
          callback={uploadImageCallback}
          style={{ width: itemWidth, height: itemWidth }}
        />
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
        height: itemWidth,
      }}
    >
      {/* todo */}
      <img src={`${image}?imageView2/2/w/200`} alt="上传图片"></img>
      {/* <img src={`${image}`} alt="上传图片"></img> */}
      <div onClick={() => handleRemove(index)}></div>
    </div>
  );
}

function More({ visible, setVisible }) {
  const Option = Select.Option;
  const history = useHistory();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const nowStation = useSelector((state) => state.station.nowStation);
  const stationDomain = nowStation ? nowStation.domain : "";
  let type;
  function handleSelect(value) {
    type = value;
  }
  function handleOk() {
    if (!type) {
      return message.info("请选择投稿方式！");
    }
    const channelKey =
      match.params.channelKey !== "allSeries" ? match.params.channelKey : "";
    switch (type) {
      case "album":
        history.push({
          pathname: `/${stationDomain}/editStory`,
          search: `?type=new&channel=${channelKey}`,
        });
        break;
      case "article":
        history.push({
          pathname: `/${stationDomain}/editArticle`,
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
        switchEditLinkVisible(dispatch);
        setVisible(false);
        break;
      default:
        break;
    }
  }
  const isMobile = util.common.isMobile();
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
  );
}
