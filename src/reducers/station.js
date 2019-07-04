import {
    LOGIN,
    REGISTER,
    GET_STATION_LIST,
    CREATE_STATION,
    CHANGE_STATION,
    DELETE_STATION, EDIT_STATION,
    GET_STATION_DETAIL,
    GET_STATION_DETAIL_DOMAIN,
    ADD_CHANNEL,
    EDIT_CHANNEL,
    DELETE_CHANNEL,
    SEARCH_USER,
    GET_GROUP_MEMBER,
    ADD_GROUP_MEMBER,
    SET_MEMBER_ROLE,
    SUBSCRIBE_PLUGIN,
    CANCEL_PLUGIN,
    SEARCH_STATION,
    SUBSCRIBE,
    SUBSCRIBE_STATION,
    TRANSFER_STATION,
} from '../actions/app';
import { message, } from 'antd';

const defaultState = {
    competitionInfo: {},
    stationList: [],
    nowStationKey: null,
    nowStation: null,
    searchUserList: [],
    userList: [],
    matchedStationList: [],
    matchedNumber: 0,
};

const station = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN:
        case REGISTER:
            return {
                ...state,
                // nowStationKey: null,
                // nowStation: null,
                stationList: [],
            }
        case GET_STATION_LIST:
            if (!action.error) {
                return {
                    ...state,
                    stationList: action.payload.result,
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
                    stationList: stationList,
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
                    nowStationKey: state.nowStationKey === action.stationKey ? stationList[0] : state.nowStationKey
                };
            } else {
                return state;
            }
        case EDIT_STATION:
            if (!action.error) {
                let stationList = Object.assign([], state.stationList);
                for (let i = 0; i < stationList.length; i++) {
                    if (stationList[i]._key === action.stationKey) {
                        stationList[i] = action.payload.result
                        break;
                    }
                }
                return {
                    ...state,
                    stationList: stationList,
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
                    };
                } else {
                    return {
                        ...state,
                        nowStationKey: action.payload.result,
                    };
                }
            } else {
                return {
                    ...state,
                    nowStationKey: 'notFound',
                };
            }
        case GET_STATION_DETAIL:
        case GET_STATION_DETAIL_DOMAIN:
            if (!action.error) {
                return {
                    ...state,
                    nowStation: action.payload.result,
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
                    nowStation: nowStation,
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
                        channels[i] = action.payload.result;
                        break;
                    }
                }
                return {
                    ...state,
                    nowStation: nowStation,
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
                    nowStation: nowStation,
                };
            } else {
                return state;
            }
        case SEARCH_USER:
            if (!action.error) {
                return {
                    ...state,
                    searchUserList: action.payload.result,
                };
            } else {
                return state;
            }
        case GET_GROUP_MEMBER:
            if (!action.error) {
                return {
                    ...state,
                    userList: action.payload.result,
                };
            } else {
                return state;
            }
        case ADD_GROUP_MEMBER:
            if (!action.error) {
                let userList = JSON.parse(JSON.stringify(state.userList));
                let result = action.payload.result;
                if (result.length !== 0) {
                    userList.push(result[0]);
                }
                return {
                    ...state,
                    userList: userList,
                };
            } else {
                return state;
            }
        case SET_MEMBER_ROLE:
            if (!action.error) {
                let userList = JSON.parse(JSON.stringify(state.userList));
                for (let i = 0; i < userList.length; i++) {
                    if (userList[i]._key === action.targetUKey) {
                        userList[i].role = action.role
                    }
                }
                return {
                    ...state,
                    userList: userList,
                };
            } else {
                return state;
            }
        case SUBSCRIBE_PLUGIN:
            if (!action.error) {
                message.success('保存成功！');
                const res = action.payload.result;
                let nowStation = Object.assign([], state.nowStation);
                nowStation.pluginInfo = res;
                return {
                    ...state,
                    nowStation: nowStation,
                };
            } else {
                return state;
            }
        case CANCEL_PLUGIN:
            if (!action.error) {
                message.success('取消成功！');
                let nowStation = Object.assign([], state.nowStation);
                nowStation.pluginInfo.splice(nowStation.pluginInfo.indexOf(action.pluginKey), 1);
                return {
                    ...state,
                    nowStation: nowStation,
                };
            } else {
                return state;
            }
        case SEARCH_STATION:
            if (!action.error) {
                return {
                    ...state,
                    matchedStationList: action.payload.result,
                    matchedNumber: action.payload.totalNumber,
                };
            } else {
                return state;
            }
        case SUBSCRIBE:
            if (!action.error) {
                message.success('订阅成功！');
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
                    stationList: stationList,
                };
            } else {
                return state;
            }
        case SUBSCRIBE_STATION:
            if (!action.error) {
                message.success('订阅成功！');
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
                    stationList: stationList,
                };
            } else {
                return state;
            }
        case TRANSFER_STATION:
            if (!action.error) {
                message.success('已发送移交请求，等待对方确认。');
                return {
                    ...state,
                };
            } else {
                return state;
            }
        default:
            return state;
    }
};

export default station;
