import api from "../services/Api";

// common
export const ASYNC_START = "ASYNC_START";
export const ASYNC_END = "ASYNC_END";
export function asyncStart(dispatch) {
  if (dispatch) {
    dispatch({ type: ASYNC_START });
  } else {
    return { type: ASYNC_START };
  }
}
export function asyncEnd(dispatch) {
  if (dispatch) {
    dispatch({ type: ASYNC_END });
  } else {
    return { type: ASYNC_END };
  }
}

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
export const SET_MEMBER_INFO = "SET_MEMBER_INFO";
export const REMOVE_GROUP_MEMBER = "REMOVE_GROUP_MEMBER";
export const IMPORT_USER = "IMPORT_USER";
export const GET_IMPORTED_USERS = "GET_IMPORTED_USERS";
export const BATCH_DELETE_USER = "BATCH_DELETE_USER";
export const SIGN_IN = "SIGN_IN";
export const CLEAR_SIGN_IN = "CLEAR_SIGN_IN";
export const EDIT_IMPORTED_USER = "EDIT_IMPORTED_USER";

export function logout(dispatch) {
  if (dispatch) {
    dispatch({ type: LOGOUT });
  } else {
    return { type: LOGOUT };
  }
}

export function getUserInfo(token, dispatch) {
  if (token) {
    api.setToken(token);
  }
  let request = api.auth.getUserFullInfo();
  if (dispatch) {
    dispatch({ type: GET_USER_INFO, payload: request, noLoading: true });
  } else {
    return { type: GET_USER_INFO, payload: request, noLoading: true };
  }
}

export function editAccount(profile) {
  let request = api.auth.editAccount(profile);
  return { type: EDIT_ACCOUNT, profile: profile, payload: request };
}

export function searchUser(keyword) {
  let request = api.auth.searchUser(keyword);
  return { type: SEARCH_USER, payload: request };
}

export function groupMember(groupId, stationKey, dispatch) {
  let request = api.auth.groupMember(groupId, stationKey);
  if (dispatch) {
    dispatch({ type: GET_GROUP_MEMBER, payload: request, noLoading: true });
  } else {
    return { type: GET_GROUP_MEMBER, payload: request, noLoading: true };
  }
}

export function clearGroupMember() {
  return { type: CLEAR_GROUP_MEMBER };
}

/**
 * 添加群成员
 * @param {String} groupId
 * @param {Array} targetUidList
 * @param {Boolean} isImprove 是否是从粉丝列表提升
 */
export function addGroupMember(groupId, targetUidList, isImprove) {
  let request = api.auth.addGroupMember(groupId, targetUidList);
  return { type: ADD_GROUP_MEMBER, isImprove: isImprove, payload: request };
}

export function setMemberRole(groupId, targetUKey, role) {
  let request = api.auth.setMemberRole(groupId, targetUKey, role);
  return { type: SET_MEMBER_ROLE, targetUKey, role, payload: request };
}

export function setMemberInfo(groupId, targetUKey, info) {
  let request = api.auth.setMemberInfo(groupId, targetUKey, info);
  return { type: SET_MEMBER_INFO, targetUKey, info, payload: request };
}

export function removeMember(groupId, targetUKeyList) {
  let request = api.auth.removeGroupMember(groupId, targetUKeyList);
  return { type: REMOVE_GROUP_MEMBER, targetUKeyList, payload: request };
}

export function importUser(stationKey, targetUserArray) {
  let request = api.auth.importUser(stationKey, targetUserArray);
  return { type: IMPORT_USER, payload: request };
}

export function getImportedUsers(stationKey) {
  let request = api.auth.getImportedUsers(stationKey);
  return { type: GET_IMPORTED_USERS, payload: request };
}
export function batchDeleteUser(stationKey, batchId) {
  let request = api.auth.batchDeleteUser(stationKey, batchId);
  return { type: BATCH_DELETE_USER, batchId, payload: request };
}
export function editImportedUser(
  stationKey,
  mobileArea,
  mobile,
  role,
  safeCode
) {
  let request = api.auth.editImportedUser(
    stationKey,
    mobileArea,
    mobile,
    role,
    safeCode
  );
  return {
    type: EDIT_IMPORTED_USER,
    role: role,
    mobileArea: mobileArea,
    mobile: mobile,
    safeCode: safeCode,
    payload: request,
  };
}
export function signIn(stationKey, dispatch) {
  let request = api.auth.signin(stationKey);
  if (dispatch) {
    dispatch({ type: SIGN_IN, payload: request });
  } else {
    return { type: SIGN_IN, payload: request };
  }
}
export function clearSignin(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_SIGN_IN });
  } else {
    return { type: CLEAR_SIGN_IN };
  }
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
export const CLEAR_SEARCH_STATION = "CLEAR_SEARCH_STATION";
export const SUBSCRIBE = "SUBSCRIBE";
export const SUBSCRIBE_STATION = "SUBSCRIBE_STATION";
export const TRANSFER_STATION = "TRANSFER_STATION";
export const CLONE_STATION = "CLONE_STATION";
export const GET_SUB_STATION_LIST = "GET_SUB_STATION_LIST";
export const ADD_SUB_SITE = "ADD_SUB_SITE";
export const REMOVE_SUB_SITE = "REMOVE_SUB_SITE";
export const SUBSCRIBE_CHANNEL = "SUBSCRIBE_CHANNEL";
export const GET_SUBSCRIBE_CHANNELS = "GET_SUBSCRIBE_CHANNELS";
export const CLEAR_SUBSCRIBE_CHANNELS = "CLEAR_SUBSCRIBE_CHANNELS";

export function getStationList() {
  let request = api.station.getStationList();
  return { type: GET_STATION_LIST, payload: request, noLoading: true };
}

export function createStation(
  name,
  domain,
  url,
  recordNumber,
  type,
  memo,
  isMainStar,
  cover,
  logo,
  inheritedMode,
  showAll,
  style,
  config,
  isClockIn
) {
  let request = api.station.createStation(
    name,
    domain,
    url,
    recordNumber,
    type,
    memo,
    isMainStar,
    cover,
    logo,
    inheritedMode,
    showAll,
    style,
    config,
    isClockIn
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
  recordNumber,
  type,
  memo,
  isMainStar,
  cover,
  logo,
  inheritedMode,
  showAll,
  style,
  config,
  isClockIn
) {
  let request = api.station.editStation(
    key,
    name,
    domain,
    url,
    recordNumber,
    type,
    memo,
    isMainStar,
    cover,
    logo,
    inheritedMode,
    showAll,
    style,
    config,
    isClockIn
  );
  return {
    type: EDIT_STATION,
    stationKey: key,
    flag: "editStation",
    payload: request,
  };
}

export function changeStation(key, domain, dispatch) {
  let dispatchBody;
  if (domain) {
    let request = api.station.getStationKey(domain);
    dispatchBody = { type: CHANGE_STATION, payload: request };
  } else {
    dispatchBody = { type: CHANGE_STATION, stationKey: key };
  }
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function getStationDetail(key) {
  let request = api.station.getStationDetail(key);
  return {
    type: GET_STATION_DETAIL,
    stationKey: key,
    payload: request,
    noLoading: true,
  };
}

export function getStationDetailByDomain(domain) {
  let request = api.station.getStationDetailByDomain(domain);
  return { type: GET_STATION_DETAIL_DOMAIN, domain: domain, payload: request };
}

export function searchStation(keyword, curPage, perPage, type, dispatch) {
  let request = api.station.searchStation(keyword, curPage, perPage, type);
  if (dispatch) {
    dispatch({ type: SEARCH_STATION, payload: request });
  } else {
    return { type: SEARCH_STATION, payload: request };
  }
}

export function clearSearchStation(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_SEARCH_STATION });
  } else {
    return { type: CLEAR_SEARCH_STATION };
  }
}

export function subscribe(channelKeys, stationKey, keys, relationDesc) {
  let request = api.station.subscribe(channelKeys, stationKey, relationDesc);
  return {
    type: SUBSCRIBE,
    channelKeys: keys,
    stationKey: stationKey,
    relationDesc: relationDesc,
    payload: request,
  };
}

export function subscribeStation(stationKey, checked, relationDesc) {
  let request = api.station.subscribeStation(
    stationKey,
    checked ? 1 : 2,
    relationDesc
  );
  return {
    type: SUBSCRIBE_STATION,
    stationKey: stationKey,
    checked: checked,
    relationDesc: relationDesc,
    payload: request,
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

export function getSubStationList(stationKey, dispatch) {
  let request = api.station.getSubStationList(stationKey);
  if (dispatch) {
    dispatch({ type: GET_SUB_STATION_LIST, payload: request, noLoading: true });
  } else {
    return { type: GET_SUB_STATION_LIST, payload: request, noLoading: true };
  }
}

export function addSubSite(stationKey, subStation, dispatch) {
  let request = api.station.addSubSite(stationKey, subStation._key);
  const dispatchBody = {
    type: ADD_SUB_SITE,
    payload: request,
    subStation: subStation,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function removeSubSite(stationKey, subStation, dispatch) {
  let request = api.station.deleteSubSite(stationKey, subStation._key);
  const dispatchBody = {
    type: REMOVE_SUB_SITE,
    payload: request,
    subStationKey: subStation._key,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export const GET_LATEST_VISITOR = "GET_LATEST_VISITOR";
export function getLatestVisitors(stationKey, dispatch) {
  let request = api.station.latestVisitUsers(stationKey);
  if (dispatch) {
    dispatch({ type: GET_LATEST_VISITOR, payload: request });
  } else {
    return { type: GET_LATEST_VISITOR, payload: request };
  }
}

export function subscribeChannel(
  type,
  sourceSeriesKey,
  targetSeriesKey,
  disOrSubType,
  selectOrNot,
  dispatch
) {
  let request = api.story.channelSubscribe(
    sourceSeriesKey,
    targetSeriesKey,
    disOrSubType,
    selectOrNot
  );
  if (dispatch) {
    dispatch({
      type: SUBSCRIBE_CHANNEL,
      subscribeType: type,
      targetSeriesKey: targetSeriesKey,
      selectOrNot: selectOrNot,
      payload: request,
    });
  } else {
    return {
      type: SUBSCRIBE_CHANNEL,
      targetSeriesKey: targetSeriesKey,
      selectOrNot: selectOrNot,
      payload: request,
    };
  }
}

export function getSubscribeChannels(channelKey, dispatch) {
  let request = api.story.getSubscribeChannels(channelKey);
  if (dispatch) {
    dispatch({ type: GET_SUBSCRIBE_CHANNELS, payload: request });
  } else {
    return { type: GET_SUBSCRIBE_CHANNELS, payload: request };
  }
}

export function clearSubscribeChannels(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_SUBSCRIBE_CHANNELS });
  } else {
    return { type: CLEAR_SUBSCRIBE_CHANNELS };
  }
}

// story
export const GET_STORY_LIST = "GET_STORY_LIST";
export const GET_STORY_LIST_2 = "GET_STORY_LIST_2";
export const CLEAR_STORY_LIST = "CLEAR_STORY_LIST";
export const CLEAR_STORY_LIST_2 = "CLEAR_STORY_LIST_2";
export const SET_STORY_LIST = "SET_STORY_LIST";
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
export const GET_HOME_STORIES = "GET_HOME_STORIES";
export const SET_NOW_TAG = "SET_NOW_TAG";
export const GET_COMMENT_LIST = "GET_COMMENT_LIST";
export const POST_COMMENT = "POST_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const CLEAR_COMMENT_LIST = "CLEAR_COMMENT_LIST";
export const ADD_SUB_STORY = "ADD_SUB_STORY";
export const VOTE = "VOTE";
export const EDIT_COMMENT = "EDIT_COMMENT";

export function applyEdit(storyKey, updateTime, dispatch) {
  let request = api.story.applyEdit(storyKey, updateTime);
  const dispatchBody = { type: APPLY_EDIT, noLoading: true, payload: request };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function exitEdit(storyKey, dispatch) {
  let request = api.story.exitEdit(storyKey);
  const dispatchBody = { type: EXIT_EDIT, noLoading: true, payload: request };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
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
  isPagination,
  dispatch
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
  const dispatchBody = {
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
    isPagination: isPagination,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function getStoryList2(
  type,
  starKey,
  targetUKey,
  curPage,
  perPage,
  dispatch
) {
  let request = api.story.getStoryList(
    type,
    starKey,
    targetUKey,
    "allSeries",
    1,
    1,
    "",
    "",
    curPage,
    perPage
  );
  const dispatchBody = {
    type: GET_STORY_LIST_2,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export const GET_SUBSCRIBE_STORY_LIST = "GET_SUBSCRIBE_STORY_LIST";
export function getSubscribeStories(curPage, perPage, dispatch) {
  let request = api.story.getSubscribeStories(curPage, perPage);
  const dispatchBody = {
    type: GET_SUBSCRIBE_STORY_LIST,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function setStoryList(storyList, totalNumber, tag, statusTag) {
  return {
    type: SET_STORY_LIST,
    storyList: storyList,
    totalNumber: totalNumber,
    tag: tag,
    statusTag: statusTag,
  };
}

export function readyToRefresh() {
  return { type: READYTOREFRESH };
}

export function clearStoryList(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_STORY_LIST });
  } else {
    return { type: CLEAR_STORY_LIST };
  }
}

export function clearStoryList2(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_STORY_LIST_2 });
  } else {
    return { type: CLEAR_STORY_LIST_2 };
  }
}

export function passAll(stationKey) {
  let request = api.story.passAll(stationKey);
  return { type: PASS_ALL, payload: request };
}

export function addStory(story, dispatch) {
  let request = api.story.addStory(story);
  if (dispatch) {
    dispatch({ type: ADD_STORY, payload: request });
  } else {
    return { type: ADD_STORY, payload: request };
  }
}

export function getStoryDetail(storyKey, dispatch) {
  let request = api.story.getStoryDetail(storyKey);
  if (dispatch) {
    dispatch({ type: GET_STORY_DETAIL, payload: request });
  } else {
    return { type: GET_STORY_DETAIL, payload: request };
  }
}

export function clearStoryDetail(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_STORY_DETAIL });
  } else {
    return { type: CLEAR_STORY_DETAIL };
  }
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
    payload: request,
  };
}

export function like(storyKey, type, dispatch) {
  let request = api.story.like(storyKey, type);
  const dispatchBody = {
    type: LIKE_STORY,
    storyKey: storyKey,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function updateExif(story) {
  return { type: UPDATE_EXIF, story: story };
}

/**
 * 文章审核
 * @param {String} storyKey
 * @param {String} groupKey
 * @param {Number} passOrNot 2:通过,3:不通过
 * @param {Boolean} isQuickPass 是否是首页的快速通过
 */
export function auditStory(storyKey, groupKey, passOrNot, isQuickPass) {
  let request = api.story.audit(storyKey, groupKey, passOrNot);
  return {
    type: AUDIT,
    flag: "auditStory",
    storyKey: storyKey,
    passOrNot: passOrNot,
    isQuickPass: isQuickPass,
    payload: request,
  };
}

export function myStationLatestStory(curPage) {
  let request = api.story.myStationLatestStory(curPage);
  return {
    type: MY_STATION_LATEST_STORY,
    curPage: curPage,
    noLoading: true,
    payload: request,
  };
}

export function switchEditLinkVisible(dispatch) {
  if (dispatch) {
    dispatch({ type: SWITCH_EDIT_LINK_VISIBLE });
  } else {
    return { type: SWITCH_EDIT_LINK_VISIBLE };
  }
}

export function setStatusTag(key, statusTag, dispatch) {
  let request = api.story.updateStatusTag(key, statusTag);
  const dispatchBody = {
    type: SET_STATUS_TAG,
    payload: request,
    storyKey: key,
    statusTag: statusTag,
    noLoading: true,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
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
    noLoading: true,
  };
}

export function setChannelKey(channelKey, dispatch) {
  if (dispatch) {
    dispatch({ type: SET_CHANNEL_KEY, channelKey: channelKey });
  } else {
    return { type: SET_CHANNEL_KEY, channelKey: channelKey };
  }
}

export async function getHomeStories(stationKey, channelKeys, dispatch) {
  const promises = channelKeys.map((key) =>
    api.story.getStoryList(1, stationKey, null, key, 1, 1, "", "", 1, 10)
  );
  const results = await Promise.all(promises);
  if (dispatch) {
    dispatch({ type: GET_HOME_STORIES, results: results });
  }
}

export function setNowTag(tag, dispatch) {
  if (dispatch) {
    dispatch({ type: SET_NOW_TAG, tag: tag });
  } else {
    return { type: SET_NOW_TAG, tag: tag };
  }
}

export function getCommentList(storyKey, type, dispatch) {
  let request = api.story.getCommentList(storyKey, type);
  if (dispatch) {
    dispatch({ type: GET_COMMENT_LIST, payload: request, noLoading: true });
  } else {
    return { type: GET_COMMENT_LIST, payload: request, noLoading: true };
  }
}

export function clearCommentList(dispatch) {
  if (dispatch) {
    dispatch({ type: CLEAR_COMMENT_LIST });
  } else {
    return { type: CLEAR_COMMENT_LIST };
  }
}

export function comment(
  userKey,
  storyKey,
  type,
  content,
  targetCommentKey,
  targetUkey,
  targetName,
  targetContent,
  targetTime,
  dispatch
) {
  let request = api.story.comment(
    storyKey,
    type,
    content,
    targetCommentKey,
    targetUkey,
    targetName,
    targetContent,
    targetTime
  );
  const dispatchBody = {
    type: POST_COMMENT,
    userKey: userKey,
    storyKey: storyKey,
    storyType: type,
    content: content,
    targetCommentKey: targetCommentKey,
    targetUkey: targetUkey,
    targetName: targetName,
    targetContent: targetContent,
    targetTime: targetTime,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function deleteComment(commentKey, dispatch) {
  let request = api.story.deleteComment(commentKey);
  if (dispatch) {
    dispatch({
      type: DELETE_COMMENT,
      noLoading: true,
      commentKey: commentKey,
      payload: request,
    });
  } else {
    return {
      type: DELETE_COMMENT,
      noLoading: true,
      commentKey: commentKey,
      payload: request,
    };
  }
}

export function addSubStory(
  story,
  fatherStoryKey,
  fatherSiteName,
  fatherChannelKey,
  dispatch
) {
  let request = api.story.addSubStory(
    story,
    fatherStoryKey,
    fatherSiteName,
    fatherChannelKey
  );
  const dispatchBody = {
    type: ADD_SUB_STORY,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function editSubStory(story, dispatch) {
  let request = api.story.editStory(story);
  const dispatchBody = {
    type: EDIT_COMMENT,
    noLoading: true,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

/**
 * 子文章加星
 * @param {String} storyKey
 * @param {Number} status 1 投票；2 取消投票
 */
export function vote(storyKey, status, dispatch) {
  let request = api.story.vote(storyKey, status);
  const dispatchBody = {
    type: VOTE,
    noLoading: true,
    storyKey: storyKey,
    status: status,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
}

export function deleteSubStory(storyKey, dispatch) {
  let request = api.story.deleteStory(storyKey);
  const dispatchBody = {
    type: DELETE_COMMENT,
    noLoading: true,
    commentKey: storyKey,
    payload: request,
  };
  if (dispatch) {
    dispatch(dispatchBody);
  } else {
    return dispatchBody;
  }
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
    request: request,
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
    request: request,
  };
}

// 目录树
export const GET_MENU_TREE = "GET_MENU_TREE";
export const ADD_MENU_TREE = "ADD_MENU_TREE";
export const DEL_MENU_TREE = "DEL_MENU_TREE";
export const ADD_MENU = "ADD_MENU";
export const UPDATE_MENU = "UPDATE_MENU";
export const DEL_MENU = "DEL_MENU";

export function getMenuTree(seriesKey) {
  let request = api.menu.getMenuTree(seriesKey);
  return { type: GET_MENU_TREE, payload: request };
}

export function addMenuTree(seriesKey) {
  let request = api.menu.addMenuTree(seriesKey);
  return { type: ADD_MENU_TREE, seriesKey, payload: request };
}

export function delMenuTree(seriesKey, rootKey) {
  let request = api.menu.deleteMenu(seriesKey, rootKey);
  return { type: DEL_MENU_TREE, seriesKey, payload: request };
}

export function addMenu(seriesKey, type, targetNodeKey) {
  let request = api.menu.addMenu(seriesKey, type, targetNodeKey);
  return { type: ADD_MENU, addType: type, targetNodeKey, payload: request };
}

export function updateMenu(targetNodeKey, patchData) {
  let request = api.menu.updateMenu(targetNodeKey, patchData);
  return { type: UPDATE_MENU, targetNodeKey, patchData, payload: request };
}

export function deleteMenu(seriesKey, targetNodeKey) {
  let request = api.menu.deleteMenu(seriesKey, targetNodeKey);
  return { type: DEL_MENU, targetNodeKey, payload: request };
}
