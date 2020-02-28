import React, { useState } from "react";
import "./NextStory.css";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getStoryDetail } from "../../actions/app";

export default function NextStory() {
  const history = useHistory();
  const dispatch = useDispatch();
  const storyList = useSelector(state => state.story.storyList);
  const storyKey = useSelector(state => state.story.story._key);
  const storyType = useSelector(state => state.story.story.type);
  const domain = useSelector(state => state.station.nowStation.domain);
  const storyListLength = useSelector(state => state.story.storyList.length);

  const [hasMore, sethasMore] = useState(true);

  function handleNext() {
    let index;
    let nextStory;
    for (let i = 0; i < storyList.length; i++) {
      const element = storyList[i];
      if (storyKey === element._key) {
        index = i;
        if (index + 1 === storyListLength) {
          sethasMore(false);
        }
      }
      if (i > index && (element.type === 6 || element.type === 9)) {
        nextStory = element;
        break;
      }
    }
    if (nextStory) {
      // 下一篇与当前类型相同
      if (storyType === nextStory.type) {
        // 获取下一篇数据
        getStoryDetail(nextStory._key, dispatch);
      } else {
        // 路由跳转
        history.push(
          `/${domain}/${nextStory.type === 6 ? "story" : "article"}?key=${
            nextStory._key
          }`
        );
      }
      // 回到顶部
      if (document.body.scrollTop) {
        document.body.scrollTop = 0;
      } else {
        document.documentElement.scrollTop = 0;
      }
    }
  }

  return storyListLength && hasMore ? (
    <div className="next-story">
      <i onClick={() => handleNext()}></i>
    </div>
  ) : null;
}
