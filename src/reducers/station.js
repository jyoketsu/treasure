import {
  LOGIN,
  REGISTER,
  GET_STATION_LIST,
  CREATE_STATION,
  CHANGE_STATION,
  DELETE_STATION,
  EDIT_STATION,
  GET_STATION_DETAIL,
  GET_STATION_DETAIL_DOMAIN,
  ADD_CHANNEL,
  EDIT_CHANNEL,
  DELETE_CHANNEL,
  SEARCH_USER,
  CLEAR_GROUP_MEMBER,
  REMOVE_GROUP_MEMBER,
  GET_GROUP_MEMBER,
  ADD_GROUP_MEMBER,
  SET_MEMBER_ROLE,
  SUBSCRIBE_PLUGIN,
  CANCEL_PLUGIN,
  SEARCH_STATION,
  SUBSCRIBE,
  SUBSCRIBE_STATION,
  TRANSFER_STATION,
  SET_PLUGIN,
  SEE_CHANNEL,
  SEE_PLUGIN,
  SORT_CHANNEL,
  SORT_PLUGIN,
  CLONE_STATION,
  GET_SUB_STATION_LIST
} from "../actions/app";
import { message } from "antd";

const defaultState = {
  competitionInfo: {},
  stationList: [],
  nowStationKey: null,
  nowStation: null,
  searchUserList: [],
  userList: [],
  matchedStationList: [],
  matchedNumber: 0,
  subStationList: []
};

const station = (state = defaultState, action) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        // nowStationKey: null,
        // nowStation: null,
        stationList: []
      };
    case GET_STATION_LIST:
      if (!action.error) {
        return {
          ...state,
          stationList: action.payload.result.sort((a, b) => {
            return b.starTime - a.starTime;
          })
        };
      } else {
        return state;
      }
    case CREATE_STATION:
      if (!action.error) {
        let stationList = Object.assign([], state.stationList);
        let res = action.payload.result;
        stationList.unshift(res);
        return {
          ...state,
          stationList: stationList
        };
      } else {
        return state;
      }
    case DELETE_STATION:
      if (!action.error) {
        let stationList = Object.assign([], state.stationList);
        for (let i = 0; i < stationList.length; i++) {
          if (stationList[i]._key === action.stationKey) {
            stationList.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          stationList: stationList,
          nowStationKey:
            state.nowStationKey === action.stationKey
              ? stationList[0]
              : state.nowStationKey
        };
      } else {
        return state;
      }
    case EDIT_STATION:
      if (!action.error) {
        let stationList = Object.assign([], state.stationList);
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        for (let i = 0; i < stationList.length; i++) {
          if (stationList[i]._key === action.stationKey) {
            stationList[i] = Object.assign(
              stationList[i],
              action.payload.result
            );
            break;
          }
        }
        return {
          ...state,
          nowStation: Object.assign(nowStation, action.payload.result),
          stationList: stationList
        };
      } else {
        return state;
      }
    case CHANGE_STATION:
      if (!action.error) {
        if (action.stationKey) {
          return {
            ...state,
            nowStationKey: action.stationKey,
            nowStation: null
          };
        } else {
          return {
            ...state,
            nowStationKey: action.payload.result,
            nowStation: null
          };
        }
      } else {
        return {
          ...state,
          nowStationKey: "notFound"
        };
      }
    case GET_STATION_DETAIL:
    case GET_STATION_DETAIL_DOMAIN:
      if (!action.error) {
        return {
          ...state,
          nowStation: action.payload.result
        };
      } else {
        return state;
      }
    case ADD_CHANNEL:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let channels = nowStation.seriesInfo;
        channels.unshift(action.payload.result);
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case EDIT_CHANNEL:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let channels = nowStation.seriesInfo;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i]._key === action.channelKey) {
            channels[i] = { ...channels[i], ...action.payload.result };
            break;
          }
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case DELETE_CHANNEL:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let channels = nowStation.seriesInfo;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i]._key === action.channelKey) {
            channels.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SEARCH_USER:
      if (!action.error) {
        return {
          ...state,
          searchUserList: action.payload.result
        };
      } else {
        return state;
      }
    case GET_GROUP_MEMBER:
      if (!action.error) {
        return {
          ...state,
          userList: action.payload.result
        };
      } else {
        return state;
      }
    case CLEAR_GROUP_MEMBER:
      return {
        ...state,
        userList: []
      };
    case ADD_GROUP_MEMBER:
      if (!action.error) {
        let userList = JSON.parse(JSON.stringify(state.userList));
        let result = action.payload.result;
        if (result.length !== 0) {
          userList.push(result[0]);
        }
        return {
          ...state,
          userList: userList
        };
      } else {
        return state;
      }
    case REMOVE_GROUP_MEMBER:
      if (!action.error) {
        let userList = JSON.parse(JSON.stringify(state.userList));
        for (let i = 0; i < userList.length; i++) {
          if (userList[i].userId === action.targetUKeyList[0]) {
            userList.splice(i, 1);
            break;
          }
        }
        return {
          ...state,
          userList: userList
        };
      } else {
        return state;
      }
    case SET_MEMBER_ROLE:
      if (!action.error) {
        let userList = JSON.parse(JSON.stringify(state.userList));
        for (let i = 0; i < userList.length; i++) {
          if (userList[i]._key === action.targetUKey) {
            userList[i].role = action.role;
          }
        }
        return {
          ...state,
          userList: userList
        };
      } else {
        return state;
      }
    case SUBSCRIBE_PLUGIN:
      if (!action.error) {
        message.success("保存成功！");
        const res = action.payload.result;
        let nowStation = Object.assign([], state.nowStation);
        nowStation.pluginInfo = res;
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case CANCEL_PLUGIN:
      if (!action.error) {
        message.success("取消成功！");
        let nowStation = Object.assign([], state.nowStation);
        nowStation.pluginInfo.splice(
          nowStation.pluginInfo.indexOf(action.pluginKey),
          1
        );
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SET_PLUGIN:
      if (!action.error) {
        message.success("设置成功！");
        let nowStation = Object.assign([], state.nowStation);
        for (let i = 0; i < nowStation.pluginInfo.length; i++) {
          if (nowStation.pluginInfo[i]._key === action.pluginKey) {
            nowStation.pluginInfo[i] = Object.assign(
              nowStation.pluginInfo[i],
              action.payload.result
            );
          }
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SEARCH_STATION:
      if (!action.error) {
        return {
          ...state,
          matchedStationList: action.payload.result,
          matchedNumber: action.payload.totalNumber
        };
      } else {
        return state;
      }
    case SUBSCRIBE:
      if (!action.error) {
        message.success("修改订阅状态成功！");
        let nowStation = Object.assign([], state.nowStation);
        let seriesInfo = nowStation.seriesInfo;
        for (let i = 0; i < seriesInfo.length; i++) {
          if (action.channelKeys.indexOf(seriesInfo[i]._key) === -1) {
            seriesInfo[i].isCareSeries = false;
          } else {
            seriesInfo[i].isCareSeries = true;
          }
        }

        let stationList = Object.assign([], state.stationList);
        if (action.channelKeys.length !== 0) {
          let unSubscribed = true;
          for (let i = 0; i < stationList.length; i++) {
            if (stationList[i]._key === nowStation._key) {
              stationList[i] = nowStation;
              unSubscribed = false;
              break;
            }
          }
          if (unSubscribed) {
            stationList.unshift(nowStation);
          }
        } else {
          for (let i = 0; i < stationList.length; i++) {
            if (stationList[i]._key === nowStation._key) {
              stationList.splice(i, 1);
              break;
            }
          }
        }
        return {
          ...state,
          nowStation: nowStation,
          stationList: stationList
        };
      } else {
        return state;
      }
    case SUBSCRIBE_STATION:
      if (!action.error) {
        message.success("修改订阅状态成功！");
        let nowStation = Object.assign([], state.nowStation);
        let seriesInfo = nowStation.seriesInfo;
        for (let i = 0; i < seriesInfo.length; i++) {
          seriesInfo[i].isCareSeries = true;
        }

        let stationList = Object.assign([], state.stationList);
        let unSubscribed = true;
        for (let i = 0; i < stationList.length; i++) {
          if (stationList[i]._key === nowStation._key) {
            stationList[i] = nowStation;
            unSubscribed = false;
            break;
          }
        }
        if (unSubscribed) {
          stationList.unshift(nowStation);
        }
        return {
          ...state,
          nowStation: nowStation,
          stationList: stationList
        };
      } else {
        return state;
      }
    case TRANSFER_STATION:
      if (!action.error) {
        message.success("已发送移交请求，等待对方确认。");
        return {
          ...state
        };
      } else {
        return state;
      }
    case SEE_CHANNEL:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let channels = nowStation.seriesInfo;
        for (let i = 0; i < channels.length; i++) {
          if (channels[i]._key === action.channelKey) {
            channels[i].isSeeSeries = true;
            break;
          }
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SORT_CHANNEL:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let channels = nowStation.seriesInfo;
        const temp = channels[action.channelIndex];
        if (action.isUp) {
          channels[action.channelIndex] = channels[action.channelIndex - 1];
          channels[action.channelIndex - 1] = temp;
        } else {
          channels[action.channelIndex] = channels[action.channelIndex + 1];
          channels[action.channelIndex + 1] = temp;
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SEE_PLUGIN:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let plugins = nowStation.pluginInfo;
        for (let i = 0; i < plugins.length; i++) {
          if (plugins[i]._key === action.pluginKey) {
            plugins[i].isSeePlugin = true;
            break;
          }
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case SORT_PLUGIN:
      if (!action.error) {
        let nowStation = JSON.parse(JSON.stringify(state.nowStation));
        let plugins = nowStation.pluginInfo;
        const temp = plugins[action.channelIndex];
        if (action.isUp) {
          plugins[action.channelIndex] = plugins[action.channelIndex - 1];
          plugins[action.channelIndex - 1] = temp;
        } else {
          plugins[action.channelIndex] = plugins[action.channelIndex + 1];
          plugins[action.channelIndex + 1] = temp;
        }
        return {
          ...state,
          nowStation: nowStation
        };
      } else {
        return state;
      }
    case CLONE_STATION:
      if (!action.error) {
        message.success("站点克隆成功，请刷新页面后查看");
        return state;
      } else {
        return state;
      }
    case GET_SUB_STATION_LIST:
      if (!action.error) {
        return {
          ...state,
          subStationList: action.payload.result
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};

export default station;
