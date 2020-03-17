import React, { useState, useRef, useEffect } from "react";
import "./SubStory.css";
import { message, Button } from "antd";
import { FileUpload } from "../common/Form";
import util from "../../services/Util";
import { addSubStory, getCommentList } from "../../actions/app";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default function SubStory() {
  return (
    <div className="sub-story-wrapper">
      <div className="sub-story-wrapper-title">回复：</div>
      <Create />
      <SubStories />
      <More />
    </div>
  );
}

function Create() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);
  const nowStory = useSelector(state => state.story.story);
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);

  async function handleCommit() {
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
      pictureCount: images.length,
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

    addSubStory(
      story,
      nowStory._key,
      nowStation.name,
      nowStory.series._key,
      dispatch
    );
    setValue("");
    setImages([]);
  }
  return (
    <div className="sub-story-reply">
      <div className="sub-story-reply-content">
        <Content
          value={value}
          setValue={setValue}
          images={images}
          setImages={setImages}
        />
      </div>
      <Commit handleCommit={handleCommit} />
    </div>
  );
}

function Commit({ handleCommit }) {
  const waiting = useSelector(state => state.common.waiting);
  return (
    <div className="sub-story-commit">
      <Button type="primary" loading={waiting} onClick={() => handleCommit()}>
        发表回复
      </Button>
    </div>
  );
}

function Content({ value, setValue, images, setImages }) {
  const imagesWrapperEl = useRef(null);
  const contentEl = useRef(null);
  const [itemWidth, setItemWidth] = useState(0);
  const [textareaHeight, setTextareaHeight] = useState(0);
  const isMobile = util.common.isMobile();
  const imageNumPerLine = isMobile ? 3 : 6;

  function handleRemove(index) {
    let newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  }
  useEffect(() => {
    setItemWidth(
      imagesWrapperEl.current
        ? `${Math.floor(
            (imagesWrapperEl.current.offsetWidth - 20) / imageNumPerLine
          )}px`
        : 0
    );
    setTextareaHeight(
      contentEl.current
        ? contentEl.current.offsetHeight > 60
          ? contentEl.current.offsetHeight + 30
          : 60 + 30
        : 0
    );
  }, [imageNumPerLine]);
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
    <div className="sub-story-reply-content-wrapper">
      <div
        className="sub-story-create-text"
        style={{ height: `${textareaHeight}px` }}
      >
        <div className="sub-story-text-wrapper">
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
        className="sub-story-images-wrapper"
        ref={imagesWrapperEl}
        style={{
          maxHeight: `${window.innerHeight / 2}px`
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
          className="sub-foot-upload"
          multiple="multiple"
          maxSize={10000000}
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
      className="sub-image-item"
      style={{
        width: itemWidth,
        height: itemWidth
      }}
    >
      <img src={`${image}?imageView2/2/w/200`} alt="上传图片"></img>
      <div onClick={() => handleRemove(index)}></div>
    </div>
  );
}

function SubStories() {
  const commentList = useSelector(state => state.story.commentList);
  return (
    <div className="sub-stories">
      {commentList.map((story, index) => (
        <Story key={index} story={story} />
      ))}
    </div>
  );
}

function Story({ story }) {
  const richContent = story.richContent || [];

  function handleClickImage(url) {
    if (!util.common.isMiniProgram()) {
      window.open(url, "_blank");
    }
  }

  return (
    <div className="sub-story">
      <div className="sub-story-user">
        <i
          style={{
            backgroundImage: story.creator.avatar
              ? `url(${story.creator.avatar}?imageView2/2/w/100)`
              : ""
          }}
        ></i>
        <span>{story.creator.name}</span>
      </div>
      <div className="sub-story-content">
        {richContent.map((content, index) => {
          const { url, memo } = content;
          let result = null;
          let regex1 = /[^()]+(?=\))/g;
          switch (content.metaType) {
            case "html":
              result = <pre className="story-content-view">{memo}</pre>;
              break;
            case "header":
              result = <span className="story-text-title-show">{memo}</span>;
              break;
            case "image": {
              let exifStr = "";
              if (content.exif) {
                const model = content.exif.Model
                  ? `${content.exif.Model.val}，  `
                  : "";
                const shutterSpeedValue = content.exif.ShutterSpeedValue
                  ? `${content.exif.ShutterSpeedValue.val.match(regex1)}，  `
                  : "";
                const apertureValue = content.exif.ApertureValue
                  ? `${content.exif.ApertureValue.val.match(regex1)}，  `
                  : "";
                const iSOSpeedRatings = content.exif.ISOSpeedRatings
                  ? `${content.exif.ISOSpeedRatings.val}`
                  : "";
                exifStr =
                  model + shutterSpeedValue + apertureValue + iSOSpeedRatings;
              }

              result = (
                <div className="story-imageGroup">
                  <div className="story-image-box">
                    <img
                      className="story-image lozad"
                      src={`${url}?imageView2/2/w/900/`}
                      alt="story"
                      onClick={() => handleClickImage(url)}
                    />
                    {exifStr ? <div className="img-exif">{exifStr}</div> : null}
                  </div>
                  <div className="image-memo">{memo}</div>
                </div>
              );
              break;
            }
            case "video":
              result = (
                <video
                  className="story-video"
                  src={url}
                  controls="controls"
                  loop="loop"
                >
                  Your browser does not support the video tag.
                </video>
              );
              break;
            default:
              break;
          }
          return (
            <div className="story-content-edit-box" key={index}>
              {result}
            </div>
          );
        })}
        <StoryFoot story={story} />
      </div>
    </div>
  );
}

function StoryFoot({ story }) {
  return (
    <div className="sub-story-foot">
      <div className="left-section">
        <span>{moment(story.updateTime).fromNow()}</span>
      </div>
      <div className="right-section">
        <i className="sub-story-star"></i>
        <span className="story-action-number">999</span>
      </div>
    </div>
  );
}

function More() {
  const story = useSelector(state => state.story.story);
  const commentList = useSelector(state => state.story.commentList);
  const [visible, setvisible] = useState(true);
  const dispatch = useDispatch();
  function handleClick() {
    setvisible(false);
    getCommentList(story._key, story.type, dispatch);
  }
  return (
    <div className="more-comment" style={{ marginTop: "15px" }}>
      {commentList.length >= 0 && visible ? (
        <span onClick={handleClick}>查看更多评论</span>
      ) : null}
    </div>
  );
}
