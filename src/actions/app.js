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

// station
export const GET_STATION_LIST = 'GET_STATION_LIST';
export const CREATE_STATION = 'CREATE_STATION';
export const DELETE_STATION = 'DELETE_STATION';
export const EDIT_STATION = 'EDIT_STATION';
export const CHANGE_STATION = 'CHANGE_STATION';
export const GET_STATION_DETAIL = 'GET_STATION_DETAIL';

export function getStationList() {
    let request = api.station.getStationList();
    return { type: GET_STATION_LIST, payload: request }
}

export function createStation(name, type, memo, isMainStar, cover, size) {
    let request = api.station.createStation(name, type, memo, isMainStar, cover, size);
    return { type: CREATE_STATION, payload: request }
}

export function deleteStation(key) {
    let request = api.station.deleteStation(key);
    return { type: DELETE_STATION, stationKey: key, payload: request }
}

export function editStation(key, name, type, memo, isMainStar, cover, size) {
    let request = api.station.editStation(key, name, type, memo, isMainStar, cover, size);
    return { type: EDIT_STATION, stationKey: key, payload: request }
}

export function changeStation(key) {
    return { type: CHANGE_STATION, stationKey: key }
}

export function getStationDetail(key) {
    let request = api.station.getStationDetail(key);
    return { type: GET_STATION_DETAIL, stationKey: key, payload: request }
}

// story
export const GET_STORY_LIST = 'GET_STORY_LIST';
export const ADD_STORY = 'ADD_STORY';
export const EDIT_STORY = 'EDIT_STORY';
export const GET_STORY_DETAIL = 'GET_STORY_DETAIL';
export function getStoryList(type, seriesKey, curPage, perPage) {
    let request = api.story.getStoryList(type, seriesKey, curPage, perPage);
    return { type: GET_STORY_LIST, curPage: curPage, noLoading: true, payload: request }
}
export function addStory(story) {
    let request = api.story.addStory(story);
    return { type: ADD_STORY, payload: request }
}

export function editStory(story) {
    let request = api.story.editStory(story);
    return { type: EDIT_STORY, payload: request }
}

export function getStoryDetail(storyKey) {
    let request = api.story.getStoryDetail(storyKey);
    return { type: GET_STORY_DETAIL, payload: request }
}