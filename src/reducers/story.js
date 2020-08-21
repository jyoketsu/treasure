import {
  GET_STORY_LIST,
  GET_STORY_LIST_2,
  GET_SUBSCRIBE_STORY_LIST,
  CLEAR_STORY_LIST,
  CLEAR_STORY_LIST_2,
  SET_STORY_LIST,
  ADD_STORY,
  MODIFY_STORY,
  DELETE_STORY,
  GET_STORY_DETAIL,
  CLEAR_STORY_DETAIL,
  LIKE_STORY,
  UPDATE_EXIF,
  AUDIT,
  READYTOREFRESH,
  MY_STATION_LATEST_STORY,
  SWITCH_EDIT_LINK_VISIBLE,
  PASS_ALL,
  SET_STATUS_TAG,
  SET_STATISTICS_STATUS_TAG,
  SET_CHANNEL_KEY,
  GET_HOME_STORIES,
  SET_NOW_TAG,
  GET_COMMENT_LIST,
  POST_COMMENT,
  DELETE_COMMENT,
  CLEAR_COMMENT_LIST,
  ADD_SUB_STORY,
  VOTE,
  EDIT_COMMENT,
  GET_CHANNEL_STORY_LIST,
} from "../actions/app";
import { message } from "antd";

const defaultState = {
  storyList: [],
  storyNumber: 0,
  story: {},
  sortType: 1,
  sortOrder: 1,
  nowChannelKey: "allSeries",
  tag: undefined,
  statusTag: undefined,
  refresh: false,
  dynamicStoryList: [],
  eidtLinkVisible: false,
  statusTagStats: [],
  // 乡村版式，显示在首页的频道故事列表
  homeStories: [],
  // 评论
  commentList: [],
  // 以下为故事2
  storyList2: [],
  storyNumber2: 0,
  // 频道故事列表（关联目录树）
  channelStoryList: [],
  channelStoryNumber: 0,
};

const story = (state = defaultState, action) => {
  switch (action.type) {
    case GET_STORY_LIST:
      if (!action.error) {
        let storyList = [];
        if (action.curPage === 1 || action.isPagination) {
          storyList = action.payload.result;
        } else {
          storyList = JSON.parse(JSON.stringify(state.storyList));
          storyList = storyList.concat(action.payload.result);
        }
        if (action.isRefresh) {
          return {
            ...state,
            storyList: storyList,
            storyNumber: action.payload.totalNumber,
            sortType: action.sortType,
            sortOrder: action.sortOrder,
            nowChannelKey: action.channelKey,
            refresh: false,
            tag: action.tag,
            statusTag: action.statusTag,
          };
        } else {
          return {
            ...state,
            storyList: storyList,
            storyNumber: action.payload.totalNumber,
            sortType: action.sortType,
            sortOrder: action.sortOrder,
            nowChannelKey: action.channelKey,
            tag: action.tag,
            statusTag: action.statusTag,
          };
        }
      } else {
        return state;
      }
    case GET_STORY_LIST_2:
      if (!action.error) {
        let storyList = [];
        storyList = action.payload.result;
        return {
          ...state,
          storyList2: storyList,
          storyNumber2: action.payload.totalNumber,
        };
      } else {
        return state;
      }
    case GET_SUBSCRIBE_STORY_LIST:
      if (!action.error) {
        let storyList = [];
        storyList = action.payload.result;
        return {
          ...state,
          storyList2: storyList,
          storyNumber2: action.payload.totalNumber,
        };
      } else {
        return state;
      }
    case SET_STORY_LIST:
      return {
        ...state,
        storyList: action.storyList,
        storyNumber: action.totalNumber,
        sortType: 1,
        sortOrder: 1,
        tag: action.tag,
        statusTag: action.statusTag,
      };
    case READYTOREFRESH:
      return {
        ...state,
        storyList: [],
        refresh: true,
      };
    case CLEAR_STORY_LIST:
      return {
        ...state,
        storyNumber: 0,
        storyList: [],
        tag: undefined,
        statusTag: undefined,
      };
    case CLEAR_STORY_LIST_2:
      return {
        ...state,
        storyNumber2: 0,
        storyList2: [],
      };
    case ADD_STORY:
      if (!action.error) {
        const addedStory = action.payload.result;
        let storyList = Object.assign([], state.storyList);

        if (!state.tag || state.tag === addedStory.tag) {
          storyList.unshift(addedStory);
        }

        return {
          ...state,
          storyList: storyList,
        };
      } else {
        return state;
      }
    case MODIFY_STORY:
      if (!action.error) {
        let storyList = Object.assign([], state.storyList);
        for (let i = 0; i < storyList.length; i++) {
          if (storyList[i]._key === action.payload.result._key) {
            storyList[i] = action.payload.result;
            break;
          }
        }
        return {
          ...state,
          storyList: storyList,
        };
      } else {
        return state;
      }
    case DELETE_STORY:
      if (!action.error) {
        let storyList = Object.assign([], state.storyList);
        for (let i = 0; i < storyList.length; i++) {
          if (storyList[i]._key === action.storyKey) {
            storyList.splice(i, 1);
            break;
          }
        }

        let storyList2 = Object.assign([], state.storyList2);
        for (let i = 0; i < storyList2.length; i++) {
          if (storyList2[i]._key === action.storyKey) {
            storyList2.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          storyList: storyList,
          storyList2: storyList2,
          story: {},
        };
      } else {
        return state;
      }
    case GET_STORY_DETAIL:
      if (!action.error) {
        return {
          ...state,
          story: action.payload.result,
          commentList: action.payload.result.commentList,
        };
      } else {
        return state;
      }
    case CLEAR_STORY_DETAIL:
      return {
        ...state,
        story: {},
      };
    case UPDATE_EXIF:
      return {
        ...state,
        story: action.story,
      };
    case LIKE_STORY:
      if (!action.error) {
        let storyList = Object.assign([], state.storyList);
        for (let i = 0; i < storyList.length; i++) {
          let story = storyList[i];
          if (story._key === action.storyKey) {
            if (story.islike) {
              story.islike = 0;
              story.likeNumber = story.likeNumber - 1;
            } else {
              story.islike = 1;
              story.likeNumber = story.likeNumber + 1;
            }
            break;
          }
        }

        let story = Object.assign([], state.story);
        if (story._key === action.storyKey) {
          if (story.islike) {
            story.islike = 0;
            story.likeNumber = story.likeNumber - 1;
          } else {
            story.islike = 1;
            story.likeNumber = story.likeNumber + 1;
          }
        }
        return {
          ...state,
          story: story,
          storyList: storyList,
        };
      } else {
        return state;
      }
    case AUDIT:
      if (!action.error) {
        message.success("操作成功！");
        if (action.isQuickPass) {
          let storyList = JSON.parse(JSON.stringify(state.storyList));
          for (let i = 0; i < storyList.length; i++) {
            let story = storyList[i];
            if (story._key === action.storyKey) {
              storyList[i].pass = 2;
              break;
            }
          }
          return {
            ...state,
            storyList: storyList,
          };
        } else {
          let storyList = JSON.parse(JSON.stringify(state.storyList2));
          for (let i = 0; i < storyList.length; i++) {
            let story = storyList[i];
            if (story._key === action.storyKey) {
              storyList.splice(i, 1);
              break;
            }
          }
          return {
            ...state,
            storyList2: storyList,
            story: {},
          };
        }
      } else {
        return state;
      }
    case MY_STATION_LATEST_STORY:
      if (!action.error) {
        let storyList = [];
        if (action.curPage === 1) {
          storyList = action.payload.result;
        } else {
          storyList = JSON.parse(JSON.stringify(state.dynamicStoryList));
          storyList = storyList.concat(action.payload.result);
        }
        return {
          ...state,
          dynamicStoryList: storyList,
        };
      } else {
        return state;
      }
    case SWITCH_EDIT_LINK_VISIBLE:
      return {
        ...state,
        eidtLinkVisible: !state.eidtLinkVisible,
      };
    case PASS_ALL:
      if (!action.error) {
        return {
          ...state,
          storyList2: [],
        };
      } else {
        return state;
      }
    case SET_STATUS_TAG:
      if (!action.error) {
        let story = Object.assign([], state.story);
        let statusTagStats = Object.assign([], state.statusTagStats);
        let storyList = Object.assign([], state.storyList);

        for (let i = 0; i < storyList.length; i++) {
          if (storyList[i]._key === action.storyKey) {
            storyList[i].statusTag = action.statusTag;
            break;
          }
        }

        const prevTag = story.statusTag;
        for (let i = 0; i < statusTagStats.length; i++) {
          if (statusTagStats[i].statusTag === prevTag) {
            statusTagStats[i].length--;
          }
          if (statusTagStats[i].statusTag === action.statusTag) {
            statusTagStats[i].length++;
          }
        }
        story.statusTag = action.statusTag;
        return {
          ...state,
          story: story,
          storyList: storyList,
          statusTagStats: statusTagStats,
        };
      } else {
        return state;
      }
    case SET_STATISTICS_STATUS_TAG:
      if (!action.error && action.payload.result.length) {
        return {
          ...state,
          statusTagStats: action.payload.result,
        };
      } else {
        return state;
      }
    case SET_CHANNEL_KEY:
      return {
        ...state,
        nowChannelKey: action.channelKey,
      };
    case GET_HOME_STORIES:
      return {
        ...state,
        homeStories: action.results,
      };
    case SET_NOW_TAG:
      return {
        ...state,
        storyList: [],
        tag: action.tag,
      };
    case GET_COMMENT_LIST:
      if (!action.error) {
        return {
          ...state,
          commentList: action.payload.result,
        };
      } else {
        return state;
      }
    case CLEAR_COMMENT_LIST:
      return {
        ...state,
        commentList: [],
      };
    case POST_COMMENT:
      if (!action.error) {
        let commentList = Object.assign([], state.commentList);
        commentList.unshift({
          _key: action.payload.result,
          userKey: action.userKey,
          type: action.storyType,
          content: action.content,
          createTime: new Date().getTime(),
          updateTime: new Date().getTime(),
          status: 1,
          albumKey: action.storyKey,
          targetUkey: action.targetUkey,
          targetName: action.targetName,
          targetContent: action.targetContent,
          targetCommentKey: action.targetCommentKey,
          etc: null,
          targetTime: 1582707453864,
        });
        return {
          ...state,
          commentList: commentList,
        };
      } else {
        return state;
      }
    case DELETE_COMMENT:
      if (!action.error) {
        let commentList = JSON.parse(JSON.stringify(state.commentList));
        for (let i = 0; i < commentList.length; i++) {
          if (commentList[i]._key === action.commentKey) {
            commentList.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          commentList: commentList,
        };
      } else {
        return state;
      }
    case ADD_SUB_STORY:
      if (!action.error) {
        let commentList = JSON.parse(JSON.stringify(state.commentList));
        commentList.unshift(action.payload.result);
        return {
          ...state,
          commentList: commentList,
        };
      } else {
        return state;
      }
    case VOTE:
      if (!action.error) {
        let commentList = JSON.parse(JSON.stringify(state.commentList));
        for (let index = 0; index < commentList.length; index++) {
          const element = commentList[index];
          if (element._key === action.storyKey) {
            if (!commentList[index].voteNum) {
              commentList[index].voteNum = 0;
            }
            if (action.status === 1) {
              commentList[index].voteNum += 1;
              commentList[index].isVote = true;
            } else {
              commentList[index].voteNum -= 1;
              commentList[index].isVote = false;
            }
            break;
          }
        }
        return {
          ...state,
          commentList: commentList,
        };
      } else {
        return state;
      }
    case EDIT_COMMENT:
      if (!action.error) {
        let commentList = JSON.parse(JSON.stringify(state.commentList));
        const result = action.payload.result;
        for (let i = 0; i < commentList.length; i++) {
          if (commentList[i]._key === result._key) {
            commentList[i] = result;
            break;
          }
        }
        return {
          ...state,
          commentList: commentList,
        };
      } else {
        return state;
      }
    case GET_CHANNEL_STORY_LIST: {
      if (!action.error) {
        return {
          ...state,
          channelStoryList: action.payload.result,
          channelStoryNumber: action.payload.totalNumber,
        };
      } else {
        return state;
      }
    }
    default:
      return state;
  }
};

export default story;
