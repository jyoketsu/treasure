import React, { useState, useEffect, useRef } from "react";
import "./Comments.css";
import { Input, Button, message, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  comment,
  getCommentList,
  clearCommentList,
  deleteComment
} from "../../actions/app";
// import util from "../../services/Util";
import ClickOutside from "../common/ClickOutside";
import moment from "moment";
import "moment/locale/zh-cn";
const { confirm } = Modal;
moment.locale("zh-cn");

export default function Comments() {
  return (
    <div className="story-comment">
      {/* <div style={{ fontSize: "18px", lineHeight: "30px" }}>评论：</div> */}
      <PostBox />
      <List />
      <More />
    </div>
  );
}

function PostBox({ targetComment, autoFocus }) {
  const { TextArea } = Input;
  const user = useSelector(state => state.auth.user);
  const story = useSelector(state => state.story.story);
  const nowStation = useSelector(state => state.station.nowStation);
  const dispatch = useDispatch();
  const [reply, setreply] = useState(undefined);

  const textAreaEl = useRef(null);
  useEffect(() => {
    if (autoFocus && textAreaEl.current) {
      textAreaEl.current.focus();
    }
  }, [autoFocus]);

  function login(params) {
    const redirect = `${window.location.protocol}//${window.location.host}/account/login`;
    const logo = nowStation.logo;
    window.location.href = `https://account.qingtime.cn?apphigh=26&logo=${logo}&redirect=${redirect}`;
  }

  return user && !user.isGuest ? (
    <div className="comment-box">
      <div>
        <i
          style={{
            backgroundImage: user.profile
              ? `url(${user.profile.avatar ||
                  "/image/icon/avatar.svg"}?imageView2/2/w/100)`
              : "/image/icon/avatar.svg"
          }}
        ></i>
        <TextArea
          value={reply}
          placeholder="发表评论"
          rows={3}
          style={{ margin: "0 15px", resize: "none" }}
          onChange={e => setreply(e.target.value)}
          ref={textAreaEl}
        />
      </div>
      <Button
        type="primary"
        size="large"
        onClick={() => {
          if (!reply || !reply.trim()) {
            return message.info("评论不能为空！");
          }
          comment(
            user._key,
            story._key,
            story.type,
            reply,
            targetComment ? targetComment._key : null,
            targetComment ? targetComment.userKey : null,
            targetComment ? targetComment.etc.name : null,
            targetComment ? targetComment.content : null,
            targetComment ? targetComment.updateTime : null,
            dispatch
          );
          setreply(undefined);
        }}
      >
        发表评论
      </Button>
    </div>
  ) : (
    <div className="comment-box comment-login" onClick={login}>
      登录后评论
    </div>
  );
}

function List() {
  const commentList = useSelector(state => state.story.commentList);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      clearCommentList(dispatch);
    };
  }, [dispatch]);

  return (
    <div className="story-comment-list">
      {commentList.map((comment, index) => (
        <Comment key={index} comment={comment} />
      ))}
    </div>
  );
}

function Comment({ comment }) {
  const dispatch = useDispatch();
  const [visible, setvisible] = useState(false);
  const user = useSelector(state => state.auth.user);
  const avatar = comment.etc
    ? comment.etc.avatar || "/image/icon/avatar.svg"
    : user.profile
    ? user.profile.avatar || "/image/icon/avatar.svg"
    : "/image/icon/avatar.svg";
  const name = comment.etc
    ? comment.etc.name
    : user.profile
    ? user.profile.nickName
    : "";

  function handleClickReply() {
    setvisible(true);
  }

  function showDeleteConfirm(commentKey, content) {
    confirm({
      title: "确定要删除该评论吗?",
      content: content,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        deleteComment(commentKey, dispatch);
      }
    });
  }

  return (
    <ClickOutside onClickOutside={() => setvisible(false)}>
      <div className="story-comment-item">
        <i
          style={{
            backgroundImage: `url(${avatar}?imageView2/2/w/100)`
          }}
        ></i>
        <div>
          <span className="comment-username">{name}</span>
          <span className="comment-content">
            {comment.targetName ? (
              <div className="replay-target-wrapper">
                <span>回复</span>
                <span className="replay-target">{`@${comment.targetName}`}</span>
                <span className="replay-target-content">
                  {comment.targetContent}
                </span>
              </div>
            ) : null}
            <span className="replay-content">{comment.content}</span>
          </span>
          <div className="comment-info">
            <span>{moment(comment.updateTime).fromNow()}</span>
            {user._key === comment.userKey ? (
              <span
                className="replay-comment"
                onClick={() => showDeleteConfirm(comment._key, comment.content)}
              >
                删除
              </span>
            ) : (
              <span className="replay-comment" onClick={handleClickReply}>
                回复
              </span>
            )}
          </div>
          {visible ? (
            <PostBox targetComment={comment} autoFocus={true} />
          ) : null}
        </div>
      </div>
    </ClickOutside>
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
    <div className="more-comment">
      {commentList.length >= 10 && visible ? (
        <span onClick={handleClick}>查看更多评论</span>
      ) : null}
    </div>
  );
}
