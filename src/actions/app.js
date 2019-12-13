import api from "../services/Api";

// common
export const ASYNC_START = "ASYNC_START";
export const ASYNC_END = "ASYNC_END";

// auth
export const GET_USER_INFO = "GET_USER_INFO";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const REGISTER = "REGISTER";
export const BIND_MOBILE = "BIND_MOBILE";
export const EDIT_ACCOUNT = "EDIT_ACCOUNT";
export const SEARCH_USER = "SEARCH_USER";
export const GET_GROUP_MEMBER = "GET_GROUP_MEMBER";
export const CLEAR_GROUP_MEMBER = "CLEAR_GROUP_MEMBER";
export const ADD_GROUP_MEMBER = "ADD_GROUP_MEMBER";
export const SET_MEMBER_ROLE = "SET_MEMBER_ROLE";
export const REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";

export function logout(dispatch) {
  // history.push(`/account/login${window.location.search}`);
  if (dispatch) {
    dispatch({ type: LOGOUT });
  } else {
    return { type: LOGOUT };
  }
}

export function getUserInfo(token) {
  if (token) {
    api.setToken(token);
  }
  let request = api.auth.getUserFullInfo();
  return { type: GET_USER_INFO, payload: request };
}

export function editAccount(profile) {
  let request = api.auth.editAccount(profile);
  return { type: EDIT_ACCOUNT, profile: profile, payload: request };
}

export function searchUser(keyword) {
  let request = api.auth.searchUser(keyword);
  return { type: SEARCH_USER, payload: request };
}

export function groupMember(groupId, stationKey) {
  let request = api.auth.groupMember(groupId, stationKey);
  return { type: GET_GROUP_MEMBER, payload: request };
}

export function clearGroupMember() {
  return { type: CLEAR_GROUP_MEMBER };
}

export function addGroupMember(groupId, targetUidList) {
  let request = api.auth.addGroupMember(groupId, targetUidList);
  return { type: ADD_GROUP_MEMBER, payload: request };
}

export function setMemberRole(groupId, targetUKey, role) {
  let request = api.auth.setMemberRole(groupId, targetUKey, role);
  return { type: SET_MEMBER_ROLE, targetUKey, role, payload: request };
}

export function removeMember(groupId, targetUKeyList) {
  let request = api.auth.removeGroupMember(groupId, targetUKeyList);
  return { type: REMOVE_GROUP_MEMBER, targetUKeyList, payload: request };
}

// station
export const GET_STATION_LIST = "GET_STATION_LIST";
export const CREATE_STATION = "CREATE_STATION";
export const DELETE_STATION = "DELETE_STATION";
export const EDIT_STATION = "EDIT_STATION";
export const CHANGE_STATION = "CHANGE_STATION";
export const GET_STATION_DETAIL = "GET_STATION_DETAIL";
export const GET_STATION_DETAIL_DOMAIN = "GET_STATION_DETAIL_DOMAIN";
export const SEARCH_STATION = "SEARCH_STATION";
export const SUBSCRIBE = "SUBSCRIBE";
export const SUBSCRIBE_STATION = "SUBSCRIBE_STATION";
export const TRANSFER_STATION = "TRANSFER_STATION";
export const CLONE_STATION = "CLONE_STATION";

export function getStationList() {
  let request = api.station.getStationList();
  return { type: GET_STATION_LIST, payload: request, noLoading: true };
}

export function createStation(
  name,
  domain,
  url,
  type,
  memo,
  isMainStar,
  cover,
  logo,
  size,
  inheritedMode,
  showAll,
  style,
  config
) {
  let request = api.station.createStation(
    name,
    domain,
    url,
    type,
    memo,
    isMainStar,
    cover,
    logo,
    size,
    inheritedMode,
    showAll,
    style,
    config
  );
  return { type: CREATE_STATION, flag: "createStation", payload: request };
}

export function deleteStation(key) {
  let request = api.station.deleteStation(key);
  return { type: DELETE_STATION, stationKey: key, payload: request };
}

export function editStation(
  key,
  name,
  domain,
  url,
  type,
  memo,
  isMainStar,
  cover,
  logo,
  size,
  inheritedMode,
  showAll,
  style,
  config
) {
  let request = api.station.editStation(
    key,
    name,
    domain,
    url,
    type,
    memo,
    isMainStar,
    cover,
    logo,
    size,
    inheritedMode,
    showAll,
    style,
    config
  );
  return {
    type: EDIT_STATION,
    stationKey: key,
    flag: "editStation",
    payload: request
  };
}

export function changeStation(key, domain) {
  if (domain) {
    let request = api.station.getStationKey(domain);
    return { type: CHANGE_STATION, payload: request };
  } else {
    return { type: CHANGE_STATION, stationKey: key };
  }
}

export function getStationDetail(key) {
  let request = api.station.getStationDetail(key);
  return {
    type: GET_STATION_DETAIL,
    stationKey: key,
    payload: request,
    noLoading: true
  };
}

export function getStationDetailByDomain(domain) {
  let request = api.station.getStationDetailByDomain(domain);
  return { type: GET_STATION_DETAIL_DOMAIN, domain: domain, payload: request };
}

export function searchStation(keyword, curPage, perPage) {
  let request = api.station.searchStation(keyword, curPage, perPage);
  return { type: SEARCH_STATION, payload: request };
}

export function subscribe(channelKeys, stationKey, keys) {
  let request = api.station.subscribe(channelKeys, stationKey);
  return {
    type: SUBSCRIBE,
    channelKeys: keys,
    stationKey: stationKey,
    payload: request
  };
}

export function subscribeStation(stationKey, checked) {
  let request = api.station.subscribeStation(stationKey, checked ? 1 : 2);
  return {
    type: SUBSCRIBE_STATION,
    stationKey: stationKey,
    checked: checked,
    payload: request
  };
}

export function transferStation(stationKey, targetUKey) {
  let request = api.station.transfer(1, stationKey, null, targetUKey);
  return { type: TRANSFER_STATION, stationKey: stationKey, payload: request };
}

export function cloneStation(stationKey) {
  let request = api.station.cloneStation(stationKey);
  return { type: CLONE_STATION, payload: request };
}

// story
export const GET_STORY_LIST = "GET_STORY_LIST";
export const CLEAR_STORY_LIST = "CLEAR_STORY_LIST";
export const ADD_STORY = "ADD_STORY";
export const MODIFY_STORY = "MODIFY_STORY";
export const DELETE_STORY = "DELETE_STORY";
export const GET_STORY_DETAIL = "GET_STORY_DETAIL";
export const CLEAR_STORY_DETAIL = "CLEAR_STORY_DETAIL";
export const LIKE_STORY = "LIKE_STORY";
export const UPDATE_EXIF = "UPDATE_EXIF";
export const AUDIT = "AUDIT";
export const READYTOREFRESH = "READYTOREFRESH";
export const MY_STATION_LATEST_STORY = "MY_STATION_LATEST_STORY";
export const SWITCH_EDIT_LINK_VISIBLE = "SWITCH_EDIT_LINK_VISIBLE";
export const APPLY_EDIT = "APPLY_EDIT";
export const EXIT_EDIT = "EXIT_EDIT";
export const PASS_ALL = "PASS_ALL";
export const SET_STATUS_TAG = "SET_STATUS_TAG";
export const SET_STATISTICS_STATUS_TAG = "SET_STATISTICS_STATUS_TAG";
export const SET_CHANNEL_KEY = "SET_CHANNEL_KEY";

export function applyEdit(storyKey, updateTime) {
  let request = api.story.applyEdit(storyKey, updateTime);
  return { type: APPLY_EDIT, noLoading: true, payload: request };
}

export function exitEdit(storyKey) {
  let request = api.story.exitEdit(storyKey);
  return { type: EXIT_EDIT, noLoading: true, payload: request };
}

export function getStoryList(
  type,
  starKey,
  targetUKey,
  seriesKey,
  sortType,
  sortOrder,
  tag,
  statusTag,
  curPage,
  perPage,
  isRefresh,
  isPagination
) {
  let request = api.story.getStoryList(
    type,
    starKey,
    targetUKey,
    seriesKey,
    sortType,
    sortOrder,
    tag,
    statusTag,
    curPage,
    perPage
  );
  return {
    type: GET_STORY_LIST,
    curPage: curPage,
    sortType: sortType,
    sortOrder: sortOrder,
    noLoading: true,
    channelKey: seriesKey,
    payload: request,
    isRefresh: isRefresh,
    tag: tag,
    statusTag: statusTag,
    isPagination: isPagination
  };
}

export function readyToRefresh() {
  return { type: READYTOREFRESH };
}

export function clearStoryList() {
  return { type: CLEAR_STORY_LIST };
}

export function addStory(story) {
  let request = api.story.addStory(story);
  return { type: ADD_STORY, payload: request };
}

export function getStoryDetail(storyKey) {
  let request = api.story.getStoryDetail(storyKey);
  return { type: GET_STORY_DETAIL, payload: request };
}

export function clearStoryDetail() {
  return { type: CLEAR_STORY_DETAIL };
}

export function modifyStory(story) {
  let request = api.story.editStory(story);
  return { type: MODIFY_STORY, payload: request };
}

export function deleteStory(storyKey) {
  let request = api.story.deleteStory(storyKey);
  return {
    type: DELETE_STORY,
    storyKey: storyKey,
    flag: "deleteStory",
    payload: request
  };
}

export function like(storyKey) {
  let request = api.story.like(storyKey);
  return {
    type: LIKE_STORY,
    storyKey: storyKey,
    noLoading: true,
    payload: request
  };
}

export function updateExif(story) {
  return { type: UPDATE_EXIF, story: story };
}

export function auditStory(storyKey, groupKey, passOrNot) {
  let request = api.story.audit(storyKey, groupKey, passOrNot);
  return {
    type: AUDIT,
    flag: "auditStory",
    storyKey: storyKey,
    passOrNot: passOrNot,
    payload: request
  };
}

export function myStationLatestStory(curPage) {
  let request = api.story.myStationLatestStory(curPage);
  return {
    type: MY_STATION_LATEST_STORY,
    curPage: curPage,
    noLoading: true,
    payload: request
  };
}

export function switchEditLinkVisible() {
  return { type: SWITCH_EDIT_LINK_VISIBLE };
}

export function passAll(stationKey) {
  let request = api.story.passAll(stationKey);
  return { type: PASS_ALL, payload: request };
}

export function setStatusTag(key, statusTag) {
  let request = api.story.updateStatusTag(key, statusTag);
  return {
    type: SET_STATUS_TAG,
    payload: request,
    storyKey: key,
    statusTag: statusTag
  };
}

export function statisticsStatusTag(stationKey, channelKey, statusTag) {
  let request = api.story.statisticsStatusTag(
    stationKey,
    channelKey,
    statusTag
  );
  return {
    type: SET_STATISTICS_STATUS_TAG,
    payload: request,
    noLoading: true
  };
}

export function setChannelKey(channelKey) {
  return { type: SET_CHANNEL_KEY, channelKey: channelKey };
}

// 频道
export const ADD_CHANNEL = "ADD_CHANNEL";
export const EDIT_CHANNEL = "EDIT_CHANNEL";
export const DELETE_CHANNEL = "DELETE_CHANNEL";
export const SEE_CHANNEL = "SEE_CHANNEL";
export const SORT_CHANNEL = "SORT_CHANNEL";

export function addChannel(stationKey, name, type, extParams) {
  let request = api.story.addChannel(stationKey, name, type, extParams);
  return { type: ADD_CHANNEL, stationKey: stationKey, payload: request };
}

export function editChannel(channelKey, name, type, extParams) {
  let request = api.story.editChannel(channelKey, name, type, extParams);
  return { type: EDIT_CHANNEL, channelKey: channelKey, payload: request };
}

export function deleteChannel(channelKey) {
  let request = api.story.deleteChannel(channelKey);
  return { type: DELETE_CHANNEL, channelKey: channelKey, payload: request };
}

export function seeChannel(channelKey) {
  let request = api.story.seeChannel(channelKey);
  return { type: SEE_CHANNEL, channelKey: channelKey, payload: request };
}

export function sortChannel(index, isUp, keys, nowStationKey) {
  const temp = keys[index];
  if (isUp) {
    keys[index] = keys[index - 1];
    keys[index - 1] = temp;
  } else {
    keys[index] = keys[index + 1];
    keys[index + 1] = temp;
  }
  let request = api.story.sortChannel(nowStationKey, keys);
  return {
    type: SORT_CHANNEL,
    channelIndex: index,
    isUp: isUp,
    request: request
  };
}

// 插件
export const CREATE_PLUGIN = "CREATE_PLUGIN";
export const EDIT_PLUGIN = "EDIT_PLUGIN";
export const DELETE_PLUGIN = "DELETE_PLUGIN";
export const GET_PLUGIN_LIST = "GET_PLUGIN_LIST";
export const SUBSCRIBE_PLUGIN = "SUBSCRIBE_PLUGIN";
export const CLEAR_PLUGIN_LIST = "CLEAR_PLUGIN_LIST";
export const CANCEL_PLUGIN = "CANCEL_PLUGIN";
export const SET_PLUGIN = "SET_PLUGIN";
export const SEE_PLUGIN = "SEE_PLUGIN";
export const SORT_PLUGIN = "SORT_PLUGIN";

export function createPlugin(stationKey, name, icon, url) {
  let request = api.plugin.createPlugin(stationKey, name, icon, url);
  return { type: CREATE_PLUGIN, payload: request };
}

export function editPlugin(pluginKey, stationKey, name, icon, url) {
  let request = api.plugin.editPlugin(pluginKey, stationKey, name, icon, url);
  return { type: EDIT_PLUGIN, pluginKey: pluginKey, payload: request };
}

export function deletePlugin(pluginKey) {
  let request = api.plugin.deletePlugin(pluginKey);
  return { type: DELETE_PLUGIN, pluginKey: pluginKey, payload: request };
}

export function getPluginList(stationKey, curPage, perPage) {
  let request = api.plugin.getPluginList(stationKey, curPage, perPage);
  return { type: GET_PLUGIN_LIST, payload: request };
}

export function subscribePlugin(stationKey, pluginKeys) {
  let request = api.plugin.subscribePlugin(stationKey, pluginKeys);
  return { type: SUBSCRIBE_PLUGIN, payload: request };
}

export function clearPluginList() {
  return { type: CLEAR_PLUGIN_LIST };
}

export function cancelPlugin(pluginKey) {
  let request = api.plugin.cancelPlugin(pluginKey);
  return { type: CANCEL_PLUGIN, pluginKey: pluginKey, payload: request };
}

export function setPlugin(
  pluginKey,
  publish,
  question,
  answer,
  subscribePay,
  monthlyFee,
  annualFee,
  lifelongFee
) {
  let request = api.plugin.setPlugin(
    pluginKey,
    publish,
    question,
    answer,
    subscribePay,
    monthlyFee,
    annualFee,
    lifelongFee
  );
  return { type: SET_PLUGIN, pluginKey: pluginKey, payload: request };
}

export function seePlugin(pluginKey) {
  let request = api.plugin.seePlugin(pluginKey);
  return { type: SEE_PLUGIN, pluginKey: pluginKey, payload: request };
}

export function sortPlugin(index, isUp, keys, nowStationKey) {
  const temp = keys[index];
  if (isUp) {
    keys[index] = keys[index - 1];
    keys[index - 1] = temp;
  } else {
    keys[index] = keys[index + 1];
    keys[index + 1] = temp;
  }
  let request = api.plugin.sortPlugin(nowStationKey, keys);
  return {
    type: SORT_PLUGIN,
    channelIndex: index,
    isUp: isUp,
    request: request
  };
}
