import {
    GET_STATION_LIST,
    CREATE_STATION,
    CHANGE_STATION,
    DELETE_STATION, EDIT_STATION,
    GET_STATION_DETAIL,
} from '../actions/app';
const defaultState = {
    competitionInfo: {},
    stationList: [],
    nowStationKey: 'all',
    stationMap: {},
};

const station = (state = defaultState, action) => {
    switch (action.type) {
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
                    nowStationKey: res.starKey,
                };
            } else {
                return state;
            }
        case DELETE_STATION:
            if (!action.error) {
                let stationList = Object.assign([], state.stationList);
                for (let i = 0; i < stationList.length; i++) {
                    if (stationList[i].starKey === action.stationKey) {
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
                    if (stationList[i].starKey === action.stationKey) {
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
                let res = action.payload.result;
                let stationMap = JSON.parse(JSON.stringify(state.stationMap));
                stationMap[action.stationKey] = res;
                return {
                    ...state,
                    stationMap: stationMap,
                };
            } else {
                return state;
            }
        default:
            return state;
    }
};

export default station;
