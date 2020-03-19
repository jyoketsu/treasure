import React, { useState, useRef, useEffect } from "react";
import "./SubStory.css";
import { message, Button, Modal } from "antd";
import { FileUpload } from "../common/Form";
import util from "../../services/Util";
import {
  addSubStory,
  getCommentList,
  clearCommentList,
  vote,
  deleteSubStory,
  editSubStory,
  applyEdit,
  exitEdit
} from "../../actions/app";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default function SubStory() {
  return (
    <div className="sub-story-wrapper">
      <Editor />
      <SubStories />
      <More />
    </div>
  );
}

function Editor({ story, handleFinish }) {
  const contents = story ? story.richContent : [];
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);
  const nowStory = useSelector(state => state.story.story);

  let text = "";
  let medias = [];
  for (let index = 0; index < contents.length; index++) {
    const element = contents[index];
    switch (element.metaType) {
      case "html":
        text += element.memo;
        break;
      case "image":
        medias.push(element.url);
        break;
      case "video":
        medias.push(element.url);
        break;
      default:
        break;
    }
  }

  const [value, setValue] = useState(text);
  const [images, setImages] = useState(medias);

  useEffect(() => {
    if (story) {
      applyEdit(story._key, story.updateTime, dispatch);
    }
    return () => {
      if (story) {
        exitEdit(story._key, dispatch);
      }
    };
  }, [story, dispatch]);

  async function handleCommit() {
    if (!images.length) {
      return message.info("至少选择一张图片");
    }
    if (!value) {
      return message.info("请输入内容");
    }

    if (story) {
      // 编辑
      let size = await util.common.getImageInfo(images[0]);
      const params = {
        ...story,
        ...{
          key: story._key,
          series: story.series._key,
          title: value.substr(0, 100),
          cover: images[0],
          size: size,
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
        }
      };
      editSubStory(params, dispatch);
      handleFinish();
    } else {
      // 新增
      let size = await util.common.getImageInfo(images[0]);
      const params = {
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
        params,
        nowStory._key,
        nowStation.name,
        nowStory.series._key,
        dispatch
      );
    }

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
      <Commit handleCommit={handleCommit} story={story} />
    </div>
  );
}

function Commit({ handleCommit, story }) {
  const waiting = useSelector(state => state.common.waiting);
  return (
    <div className="sub-story-commit">
      <Button type="primary" loading={waiting} onClick={() => handleCommit()}>
        {!story ? "发表回复" : "保存更改"}
      </Button>
    </div>
  );
}

function Content({ value, setValue, images, setImages }) {
  const user = useSelector(state => state.auth.user);
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
        ? contentEl.current.offsetHeight > 60
          ? contentEl.current.offsetHeight + 30
          : 60 + 30
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
        <i
          style={{
            backgroundImage: user.profile
              ? `url(${user.profile.avatar ||
                  "/image/icon/avatar.svg"}?imageView2/2/w/100)`
              : "/image/icon/avatar.svg"
          }}
        ></i>
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
  const dispatch = useDispatch();
  const commentList = useSelector(state => state.story.commentList);

  useEffect(() => {
    return () => {
      clearCommentList(dispatch);
    };
  }, [dispatch]);

  return (
    <div className="sub-stories">
      {commentList.map((story, index) => (
        <Story key={index} story={story} />
      ))}
    </div>
  );
}

function Story({ story }) {
  const storyEl = useRef(null);
  const [isEditor, setisEditor] = useState(false);
  const richContent = story.richContent || [];

  function handleEdit(value) {
    const top = storyEl.current.offsetTop;
    if (document.body.scrollTop !== 0) {
      document.body.scrollTop = top;
    } else {
      document.documentElement.scrollTop = top;
    }
    setisEditor(value);
  }

  return (
    <div className="sub-story" ref={storyEl}>
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
        {!isEditor ? (
          <StoryContent contents={richContent} />
        ) : (
          <Editor story={story} handleFinish={() => setisEditor(false)} />
        )}
        {!isEditor ? <StoryFoot story={story} handleEdit={handleEdit} /> : null}
      </div>
    </div>
  );
}

function StoryContent({ contents }) {
  function handleClickImage(url) {
    if (!util.common.isMiniProgram()) {
      window.open(url, "_blank");
    }
  }
  return (
    <div>
      {contents.map((content, index) => {
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
    </div>
  );
}

function StoryFoot({ story, handleEdit }) {
  const confirm = Modal.confirm;
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);

  function deleteConfirm(story) {
    confirm({
      title: "删除回复",
      content: `确定要删除${story.title}吗？`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteSubStory(story._key, dispatch);
      }
    });
  }
  return (
    <div className="sub-story-foot">
      <div className="left-section">
        <span>{moment(story.updateTime).fromNow()}</span>
      </div>
      <div className="right-section">
        {user._key === story.userKey ? (
          <div className="sub-story-action" onClick={() => handleEdit(true)}>
            编辑
          </div>
        ) : null}
        {nowStation.role <= 2 || user._key === story.userKey ? (
          <div
            className="sub-story-action"
            onClick={() => deleteConfirm(story)}
          >
            删除
          </div>
        ) : null}
        <i
          className={`sub-story-star ${story.isVote ? "active" : ""}`}
          onClick={() => vote(story._key, story.isVote ? 2 : 1, dispatch)}
        ></i>
        <span className="story-action-number">{story.voteNum || 0}</span>
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
      {commentList.length >= 10 && visible ? (
        <span onClick={handleClick}>查看更多评论</span>
      ) : null}
    </div>
  );
}
