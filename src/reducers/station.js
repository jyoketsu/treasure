import {
    LOGIN,
    GET_STATION_LIST,
    CREATE_STATION,
    CHANGE_STATION,
    DELETE_STATION, EDIT_STATION,
    GET_STATION_DETAIL,
    ADD_CHANNEL,
    EDIT_CHANNEL,
    DELETE_CHANNEL,
    SEARCH_USER,
    GET_GROUP_MEMBER,
    ADD_GROUP_MEMBER,
    SET_MEMBER_ROLE,
} from '../actions/app';
const defaultState = {
    competitionInfo: {},
    stationList: [],
    nowStationKey: null,
    nowStation: null,
    searchUserList: [],
    userList: [],
};

const station = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                nowStationKey: null,
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
            return {
                ...state,
                nowStationKey: action.stationKey,
            }
        case GET_STATION_DETAIL:
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
        default:
            return state;
    }
};

export default station;
