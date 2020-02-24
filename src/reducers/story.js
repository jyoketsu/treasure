import {
  GET_STORY_LIST,
  GET_STORY_LIST_2,
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
  SET_NOW_TAG
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

  // 以下为故事2
  storyList2: [],
  storyNumber2: 0
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
            statusTag: action.statusTag
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
            statusTag: action.statusTag
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
          storyNumber2: action.payload.totalNumber
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
        statusTag: action.statusTag
      };
    case READYTOREFRESH:
      return {
        ...state,
        storyList: [],
        refresh: true
      };
    case CLEAR_STORY_LIST:
      return {
        ...state,
        storyNumber: 0,
        storyList: [],
        tag: undefined,
        statusTag: undefined
      };
    case CLEAR_STORY_LIST_2:
      return {
        ...state,
        storyNumber2: 0,
        storyList2: []
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
          storyList: storyList
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
          storyList: storyList
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
        return {
          ...state,
          storyList: storyList
        };
      } else {
        return state;
      }
    case GET_STORY_DETAIL:
      if (!action.error) {
        return {
          ...state,
          story: action.payload.result
        };
      } else {
        return state;
      }
    case CLEAR_STORY_DETAIL:
      return {
        ...state,
        story: {}
      };
    case UPDATE_EXIF:
      return {
        ...state,
        story: action.story
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
        return {
          ...state,
          storyList: storyList
        };
      } else {
        return state;
      }
    case AUDIT:
      if (!action.error) {
        message.success("操作成功！");
        let storyList = Object.assign([], state.storyList);
        for (let i = 0; i < storyList.length; i++) {
          let story = storyList[i];
          if (story._key === action.storyKey) {
            storyList.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          storyList: storyList
        };
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
          dynamicStoryList: storyList
        };
      } else {
        return state;
      }
    case SWITCH_EDIT_LINK_VISIBLE:
      return {
        ...state,
        eidtLinkVisible: !state.eidtLinkVisible
      };
    case PASS_ALL:
      if (!action.error) {
        return {
          ...state,
          storyList2: []
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
          statusTagStats: statusTagStats
        };
      } else {
        return state;
      }
    case SET_STATISTICS_STATUS_TAG:
      if (!action.error && action.payload.result.length) {
        return {
          ...state,
          statusTagStats: action.payload.result
        };
      } else {
        return state;
      }
    case SET_CHANNEL_KEY:
      return {
        ...state,
        nowChannelKey: action.channelKey
      };
    case GET_HOME_STORIES:
      return {
        ...state,
        homeStories: action.results
      };
    case SET_NOW_TAG:
      return {
        ...state,
        storyList: [],
        tag: action.tag
      };
    default:
      return state;
  }
};

export default story;
