import React, { useState, useRef, useEffect } from "react";
import "./Create.css";
import { Select } from "antd";
import { FileUpload } from "../common/Form";
import util from "../../services/Util";
import { useHistory, useRouteMatch } from "react-router-dom";
import { addStory } from "../../actions/app";
import { useSelector, useDispatch } from "react-redux";

export default function Create() {
  const match = useRouteMatch();
  const user = useSelector(state => state.auth.user);
  const nowStation = useSelector(state => state.station.nowStation);
  const [storyTag, setStoryTag] = useState();
  const [value, setValue] = useState("");
  const [images, setImages] = useState([
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg",
    "http://cdn-icare.qingtime.cn/311A0B2E.jpg"
  ]);

  async function handleCommit() {
    let size = await util.common.getImageInfo(images[0]);
    const story = {
      title: value.substr(0, 50),
      type: 6,
      cover: images[0],
      size: size,
      userKey: user._key,
      starKey: nowStation._key,
      publish: 1,
      isSimple: 1,
      series: { _key: match.params.channelKey },
      richContent: [
        {
          _id: util.common.randomStr(false, 12),
          metaType: "html",
          memo: value
        },
        images.map((image, index) => ({
          _id: util.common.randomStr(false, 12),
          metaType: "image",
          url: image
        }))
      ]
    };
    console.log("story-----", story);
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
      />
    </div>
  );
}

function Head({ handleCommit }) {
  const history = useHistory();
  return (
    <div className="village-stories-head create-head">
      <i className="back" onClick={() => history.goBack()}></i>
      <span onClick={() => handleCommit()}>发布</span>
    </div>
  );
}

function Action({ value, storyTag, setStoryTag, images, setImages }) {
  const Option = Select.Option;
  const match = useRouteMatch();
  const nowStation = useSelector(state => state.station.nowStation);
  const seriesInfo = nowStation ? nowStation.seriesInfo : [];
  let channelInfo = {};
  const nowChannelId = match.params.channelKey;
  for (let i = 0; i < seriesInfo.length; i++) {
    if (seriesInfo[i]._key === nowChannelId) {
      channelInfo = seriesInfo[i];
      break;
    }
  }
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
            onChange={e => setValue(e.target.value)}
          ></textarea>
        </div>
      </div>
      {images.length ? (
        <div
          className="images-wrapper"
          ref={imagesWrapperEl}
          style={{ maxHeight: `${window.innerHeight / 2}px` }}
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
      ) : null}
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
