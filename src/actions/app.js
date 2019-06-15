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
export const EDIT_ACCOUNT = 'EDIT_ACCOUNT';
export const SEARCH_USER = 'SEARCH_USER';
export const GET_GROUP_MEMBER = 'GET_GROUP_MEMBER';
export const ADD_GROUP_MEMBER = 'ADD_GROUP_MEMBER';
export const SET_MEMBER_ROLE = 'SET_MEMBER_ROLE';

export function logout(history) {
    history.push(`/login${window.location.search}`)
    return { type: LOGOUT }
}

export function getUserInfo(token, history) {
    api.setToken(token);
    let request = api.auth.getUserFullInfo(token);
    return { type: GET_USER_INFO, history: history, payload: request }
}

export function editAccount(profile) {
    let request = api.auth.editAccount(profile);
    return { type: EDIT_ACCOUNT, profile: profile, payload: request }
}

export function searchUser(keyword) {
    let request = api.auth.searchUser(keyword);
    return { type: SEARCH_USER, payload: request }
}

export function groupMember(groupId) {
    let request = api.auth.groupMember(groupId);
    return { type: GET_GROUP_MEMBER, payload: request }
}

export function addGroupMember(groupId, targetUidList) {
    let request = api.auth.addGroupMember(groupId, targetUidList);
    return { type: ADD_GROUP_MEMBER, payload: request }
}

export function setMemberRole(groupId, targetUKey, role) {
    let request = api.auth.setMemberRole(groupId, targetUKey, role);
    return { type: SET_MEMBER_ROLE, targetUKey, role, payload: request }
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

export function createStation(name, type, memo, open, isMainStar, cover, logo, size) {
    let request = api.station.createStation(name, type, memo, open, isMainStar, cover, logo, size);
    return { type: CREATE_STATION, flag: 'createStation', payload: request }
}

export function deleteStation(key) {
    let request = api.station.deleteStation(key);
    return { type: DELETE_STATION, stationKey: key, payload: request }
}

export function editStation(key, name, type, memo, open, isMainStar, cover, logo, size) {
    let request = api.station.editStation(key, name, type, memo, open, isMainStar, cover, logo, size);
    return { type: EDIT_STATION, stationKey: key, flag: 'editStation', payload: request }
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
export const CLEAR_STORY_LIST = 'CLEAR_STORY_LIST';
export const ADD_STORY = 'ADD_STORY';
export const MODIFY_STORY = 'MODIFY_STORY';
export const DELETE_STORY = 'DELETE_STORY';
export const GET_STORY_DETAIL = 'GET_STORY_DETAIL';
export const CLEAR_STORY_DETAIL = 'CLEAR_STORY_DETAIL';
export const LIKE_STORY = 'LIKE_STORY';
export const UPDATE_EXIF = 'UPDATE_EXIF';
export const AUDIT = 'AUDIT';

export function getStoryList(type, starKey, seriesKey, sortType, sortOrder, curPage, perPage) {
    let request = api.story.getStoryList(type, starKey, seriesKey, sortType, sortOrder, curPage, perPage);
    return {
        type: GET_STORY_LIST,
        curPage: curPage,
        sortType: sortType,
        sortOrder: sortOrder,
        noLoading: true,
        channelKey: seriesKey,
        payload: request
    }
}

export function clearStoryList() {
    return { type: CLEAR_STORY_LIST }
}

export function addStory(story) {
    let request = api.story.addStory(story);
    return { type: ADD_STORY, payload: request }
}

export function getStoryDetail(storyKey) {
    let request = api.story.getStoryDetail(storyKey);
    return { type: GET_STORY_DETAIL, payload: request }
}

export function clearStoryDetail() {
    return { type: CLEAR_STORY_DETAIL }
}

export function modifyStory(story) {
    let request = api.story.editStory(story);
    return { type: MODIFY_STORY, payload: request }
}

export function deleteStory(storyKey) {
    let request = api.story.deleteStory(storyKey);
    return { type: DELETE_STORY, storyKey: storyKey, flag: 'deleteStory', payload: request }
}

export function like(storyKey) {
    let request = api.story.like(storyKey);
    return { type: LIKE_STORY, storyKey: storyKey, noLoading: true, payload: request }
}

export function updateExif(story) {
    return { type: UPDATE_EXIF, story: story }
}

export function auditStory(storyKey, groupKey, passOrNot) {
    let request = api.story.audit(storyKey, groupKey, passOrNot);
    return { type: AUDIT, flag: 'auditStory', storyKey: storyKey, passOrNot: passOrNot, payload: request }
}

// 频道
export const ADD_CHANNEL = 'ADD_CHANNEL';
export const EDIT_CHANNEL = 'EDIT_CHANNEL';
export const DELETE_CHANNEL = 'DELETE_CHANNEL';

export function addChannel(stationKey, name, type, extParams, ) {
    let request = api.story.addChannel(stationKey, name, type, extParams);
    return { type: ADD_CHANNEL, stationKey: stationKey, payload: request }
}

export function editChannel(channelKey, name, type, extParams, ) {
    let request = api.story.editChannel(channelKey, name, type, extParams);
    return { type: EDIT_CHANNEL, channelKey: channelKey, payload: request }
}

export function deleteChannel(channelKey) {
    let request = api.story.deleteChannel(channelKey);
    return { type: DELETE_CHANNEL, channelKey: channelKey, payload: request }
}

// 插件
export const CREATE_PLUGIN = 'CREATE_PLUGIN';
export function createPlugin(stationKey, name, icon, url) {
    let request = api.plugin.createPlugin(stationKey, name, icon, url);
    return { type: CREATE_PLUGIN, payload: request }
}