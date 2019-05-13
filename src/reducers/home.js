import { GET_COMPETITION_INFO, GET_STATION_LIST, } from '../actions/app';
const defaultState = {
    competitionInfo: {},
    stationList: [],
};

const home = (state = defaultState, action) => {
    switch (action.type) {
        case GET_COMPETITION_INFO:
            if (!action.error) {
                return {
                    ...state,
                    competitionInfo: action.payload.result,
                };
            } else {
                return state;
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
        default:
            return state;
    }
};

export default home;
