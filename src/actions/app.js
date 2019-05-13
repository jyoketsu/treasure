import api from '../services/Api';

// common
export const ASYNC_START = 'ASYNC_START';
export const ASYNC_END = 'ASYNC_END';

// auth
export const GET_USER_INFO = 'GET_USER_INFO';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REGISTER = 'REGISTER';
export const BIND_MOBILE = 'BIND_MOBILE';

export function logout(history) {
    history.push('/home');
    return { type: LOGOUT }
}

export function getUserInfo(token, history) {
    api.setToken(token);
    let request = api.auth.getUserFullInfo(token);
    return { type: GET_USER_INFO, history: history, payload: request }
}

// home
export const GET_COMPETITION_INFO = 'GET_COMPETITION_INFO';
export const GET_STATION_LIST = 'GET_STATION_LIST';

export function getCompetitionInfo(key) {
    let request = api.station.getStationListDetail(key);
    return { type: GET_COMPETITION_INFO, payload: request }
}

export function getStationList() {
    let request = api.station.getStationList();
    return { type: GET_STATION_LIST, payload: request }
}