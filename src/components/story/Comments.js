import React, { useState, useEffect } from "react";
import "./Comments.css";
import { Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { comment } from "../../actions/app";

export default function Comments() {
  return (
    <div className="story-comment">
      <PostBox />
      <List />
    </div>
  );
}

function PostBox() {
  const { TextArea } = Input;
  const user = useSelector(state => state.auth.user);
  const story = useSelector(state => state.story.story);
  const dispatch = useDispatch();
  const [reply, setreply] = useState(undefined);
  return user && !user.isGuest ? (
    <div className="comment-box">
      <i
        style={{
          backgroundImage: user.profile
            ? `url(${user.profile.avatar}?imageView2/2/w/100)`
            : "unset"
        }}
      ></i>
      <TextArea
        value={reply}
        placeholder="发表评论"
        rows={3}
        style={{ margin: "0 15px", resize: "none" }}
        onChange={e => setreply(e.target.value)}
      />
      <Button
        type="primary"
        size="large"
        style={{ width: "73px", height: "73px", whiteSpace: "normal" }}
        onClick={() => {
          comment(story._key, story.type, reply, dispatch);
          setreply(undefined);
        }}
      >
        发表评论
      </Button>
    </div>
  ) : (
    <div className="comment-box">登录后评论</div>
  );
}

function List() {
  const commentList = useSelector(state => state.story.commentList);
  return (
    <div className="story-comment-list">
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}

function Comment({ comment }) {
  return (
    <div className="story-comment-item">
      <i
        style={{
          backgroundImage: `url(${comment.etc.avatar}?imageView2/2/w/100)`
        }}
      ></i>
      <div>
        <span>{comment.content}</span>
      </div>
    </div>
  );
}
