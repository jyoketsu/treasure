import api from "./Util";
import { AUTH_URL, APIURL } from "../global";
let token = "FLQ1K86TTORG4LUZ2I68TAPSWC69AR1ES55L9UPW4LWIRTYS1561345482667";

const requests = {
  // post方法
  post(url, params) {
    return new Promise(async function (resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "POST",
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
  // post方法（multipart/form-data）
  postForm(url, data) {
    return new Promise(async function (resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "POST",
          body: data,
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },

  // get方法
  get(url, params) {
    var i = 0;
    for (let index in params) {
      if (i === 0) {
        url = url + "?" + index + "=" + encodeURIComponent(params[index]);
      } else {
        url = url + "&" + index + "=" + encodeURIComponent(params[index]);
      }
      i++;
    }

    return new Promise(async function (resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "GET",
        });

        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },

  // patch方法
  patch(url, param) {
    return new Promise(async function (resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "PATCH",
          body: JSON.stringify(param),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },

  // delete方法
  delete(url, param) {
    return new Promise(async function (resolve, reject) {
      try {
        let result = await fetch(url, {
          method: "DELETE",
          body: JSON.stringify(param),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const json = await result.json();
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  },
};

const auth = {
  // 登录
  login(params) {
    const isMobile = api.common.isMobile();
    let param = {
      mobileArea: params.mobileArea,
      mobile: params.mobile,
      password: params.password,
      service: 3,
      lo: 13,
      la: 14,
      app: 3,
      deviceType: isMobile ? 1 : 4,
      deviceModel: isMobile ? "mobile" : "web",
      appHigh: 26,
    };
    return requests.get(AUTH_URL + "/account", param);
  },

  // 注册
  register(params) {
    return requests.post(AUTH_URL + "/account", params);
  },

  // 重置密码
  resetPassword(params) {
    return new Promise(async (resolve, reject) => {
      try {
        params.service = 3;
        let res = await requests.patch(
          AUTH_URL + "/account/forgetPasswordNew",
          {
            mobileArea: params.mobileArea,
            mobile: params.mobile,
            code: params.code,
            password: params.password,
          }
        );
        resolve(res);
      } catch (error) {
        reject();
      }
    });
  },

  // 获取验证码
  getVerifyCode(params) {
    return requests.post(AUTH_URL + "/account/verifyCode", params);
  },

  thirdLogin(uId, type) {
    return requests.get(AUTH_URL + "/account/thirdLogin", {
      app: 3,
      uId: uId,
      type: type,
    });
  },

  /**
   * 第三方登陆绑定手机号
   * @param {*} mobileArea
   * @param {*} mobile
   * @param {*} uId
   * @param {*} code
   * @param {Number} type 1 QQ 2 wechat 3 familySearch
   * @param {*} fsInfo fs的具体数据
   */
  thirdRegister(mobileArea, mobile, uId, code, type, fsInfo) {
    return requests.post(AUTH_URL + "/account/thirdRegister", {
      mobileArea: mobileArea,
      mobile: mobile,
      app: 3,
      uId: uId,
      code: code,
      type: type,
      familySearchInfo: fsInfo,
    });
  },

  // 获取七牛云uptoken
  getUptoken() {
    return requests.get(AUTH_URL + "/upTokenQiniu/getQiNiuUpToken", {
      token: token,
      type: 2,
    });
  },

  getToken() {
    return token;
  },

  // 获取临时token
  getTempToken() {
    return requests.get(AUTH_URL + "/account/loginAnonymousUser");
  },

  editAccount(profile) {
    return requests.patch(AUTH_URL + "/account", {
      token: token,
      profile: profile,
    });
  },

  searchUser(keyword) {
    return requests.get(AUTH_URL + "/account/userSearchStar", {
      token: token,
      searchCondition: keyword,
    });
  },
  // 获取登录用户信息
  getUserFullInfo() {
    return requests.get(APIURL + "/account/userinfo", { token: token });
  },
  /**
   * 获取群特定成员信息
   * @param {String} groupId
   */
  groupMember(groupId, stationKey) {
    return requests.get(APIURL + "/groupmember", {
      token: token,
      groupId: groupId,
      starKey: stationKey,
    });
  },
  addGroupMember(groupId, targetUidList) {
    return requests.post(APIURL + "/groupmember", {
      token: token,
      groupKey: groupId,
      targetUidList: targetUidList,
    });
  },
  removeGroupMember(groupId, targetUKeyList) {
    return requests.delete(APIURL + "/groupmember/remove", {
      token: token,
      groupKey: groupId,
      targetUKeyList: targetUKeyList,
    });
  },
  setMemberRole(groupId, targetUKey, role) {
    return requests.patch(APIURL + "/groupmember/setRole", {
      token: token,
      groupKey: groupId,
      targetUKey: targetUKey,
      role: role,
    });
  },
  setMemberInfo(groupId, targetUKey, info) {
    return requests.post(APIURL + "/groupmember/setProperty", {
      token: token,
      groupKey: groupId,
      targetUKey: targetUKey,
      patchData: info,
    });
  },
  getUserInfoByKey(key) {
    return requests.get(AUTH_URL + "/account/targetUserInfo", {
      token: token,
      key: key,
    });
  },
  // 批量导入用户
  importUser(stationKey, targetUserArray) {
    return requests.post(APIURL + "/starAddressBook", {
      token: token,
      starKey: stationKey,
      targetUserArray,
    });
  },
  // 获取导入用户列表
  getImportedUsers(stationKey) {
    return requests.post(APIURL + "/starAddressBook/getUserList", {
      token: token,
      starKey: stationKey,
    });
  },
  // 批次删除导入用户
  batchDeleteUser(stationKey, batchId) {
    return requests.post(APIURL + "/starAddressBook/batchDeleteUser", {
      token: token,
      starKey: stationKey,
      batchId: batchId,
    });
  },
  // 编辑导入用户
  editImportedUser(stationKey, mobileArea, mobile, role, safeCode) {
    return requests.post(APIURL + "/starAddressBook/updateInfo", {
      token: token,
      starKey: stationKey,
      mobileArea: mobileArea,
      mobile: mobile,
      patchData: {
        role: role,
        safeCode: safeCode,
      },
    });
  },
  // 签到
  // resultCode
  // 1 绿码 通过
  // 2 黄码 审核中
  // 3 红码 拒绝
  // 4 黑码 非注册用户，拒绝 自动加入粉丝群
  signin(stationKey) {
    return requests.post(APIURL + "/starCheckIn", {
      token: token,
      starKey: stationKey,
    });
  },
};

const station = {
  getStationName(url) {
    return requests.get(APIURL + "/star/siteName", {
      url: url,
    });
  },

  // 获取微站列表
  getStationList() {
    // return requests.get(APIURL + '/star/careAndMyList', {
    return requests.get(APIURL + "/star/careAndMyDetail", {
      token: token,
    });
  },

  /**
   * 创建微站
   * @param {String} name
   * @param {Number} type
   * @param {String} memo
   * @param {Boolean} isMainStar
   * @param {String} cover
   * @param {Object} size
   */
  createStation(
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
    return requests.post(APIURL + "/star/createStar", {
      token: token,
      name: name.trim(),
      domain: domain,
      url: url,
      recordNumber: recordNumber,
      type: type,
      memo: memo,
      isMainStar: isMainStar,
      covers: cover,
      cover: cover && cover.length ? cover[0].url : null,
      logo: logo,
      inheritedMode: inheritedMode,
      showAll: showAll,
      style: style,
      config: config,
      isClockIn: isClockIn,
    });
  },

  deleteStation(key) {
    return requests.delete(APIURL + "/star/deleteStar", {
      token: token,
      starKey: key,
    });
  },

  editStation(
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
    return requests.patch(APIURL + "/star/setStarProperty", {
      token: token,
      starKey: key,
      name: name.trim(),
      domain: domain,
      url: url,
      recordNumber: recordNumber,
      type: type,
      memo: memo,
      isMainStar: isMainStar,
      covers: cover,
      cover: cover && cover.length ? cover[0].url : null,
      logo: logo,
      inheritedMode: inheritedMode,
      showAll: showAll,
      style: style,
      config: config,
      isClockIn: isClockIn,
    });
  },
  getStationDetail(key) {
    return requests.get(APIURL + "/star/starDetail", {
      token: token,
      starKey: key,
    });
  },
  getStationDetailByDomain(domain) {
    return requests.get(APIURL + "/star/starDetailByDomain", {
      token: token,
      domain: domain.toLowerCase(),
    });
  },
  getStationKey(domain) {
    return requests.get(APIURL + "/star/getStarKeyByDomain", {
      token: token,
      domain: domain,
    });
  },

  searchStation(keyword, curPage, perPage, type) {
    return requests.get(APIURL + "/star/searchStar", {
      token: token,
      searchCondition: keyword,
      searchType2: type ? type : "",
      curPage: curPage,
      perPage: perPage,
    });
  },

  subscribe(channelKeys, stationKey, relationDesc) {
    return requests.post(APIURL + "/series/dealCareSeriesBatch", {
      token: token,
      seriesKeyArray: channelKeys,
      starKey: stationKey,
      relationDesc: relationDesc ? relationDesc : "",
    });
  },

  subscribeStation(stationKey, checked, relationDesc) {
    return requests.patch(APIURL + "/star/dealCareStarAllSeries", {
      token: token,
      starKey: stationKey,
      status: checked,
      relationDesc: relationDesc ? relationDesc : "",
    });
  },

  /**
   * 移交微站/频道/插件
   * @param {Number} type 1 微站 2 频道或者插件
   * @param {String} stationKey 微站key
   * @param {String} transferContent 频道或者插件内容
   * @param {String} targetUKey  目标用户key
   */
  transfer(type, stationKey, transferContent, targetUKey) {
    return requests.post(APIURL + "/transfer/transfer", {
      token: token,
      type: type,
      starKey: stationKey,
      transferContent: transferContent,
      targetUKey: targetUKey,
    });
  },
  cloneStation(stationKey) {
    return requests.post(APIURL + "/star/cloneStar", {
      token: token,
      sourceStarKey: stationKey,
    });
  },
  // 获取子站列表
  getSubStationList(stationKey) {
    return requests.get(APIURL + "/star/subStarList", {
      token: token,
      starKey: stationKey,
    });
  },
  // 添加子站
  addSubSite(stationKey, subStationKey) {
    return requests.post(APIURL + "/star/addSubStar", {
      token: token,
      starKey: stationKey,
      subStarKey: subStationKey,
    });
  },
  // 删除子站
  deleteSubSite(stationKey, subStationKey) {
    return requests.post(APIURL + "/star/deleteSubStar", {
      token: token,
      starKey: stationKey,
      subStarKey: subStationKey,
    });
  },
  // 最近访问用户
  latestVisitUsers(stationKey) {
    return requests.get(APIURL + "/star/latestVisitUserList", {
      token: token,
      starKey: stationKey,
      curPage: 1,
      perPage: 100,
    });
  },
};

const story = {
  getStoryList(
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
  ) {
    return requests.get(APIURL + "/album", {
      token: token,
      type: type,
      starKey: starKey,
      targetUKey: targetUKey,
      seriesKey: seriesKey,
      sortType: sortType,
      sortOrder: sortOrder,
      tag: tag ? tag : "",
      statusTag: statusTag ? statusTag : "",
      curPage: curPage,
      perPage: perPage,
    });
  },

  // 编辑上锁
  applyEdit(key, time) {
    return requests.post(APIURL + "/album/applyEdit", {
      token: token,
      albumKey: key,
      mobileTime: time,
    });
  },

  // 编辑解锁
  exitEdit(key) {
    return requests.post(APIURL + "/album/exitEdit", {
      token: token,
      albumKey: key,
    });
  },

  addStory(story) {
    return requests.post(
      APIURL + "/album",
      Object.assign(story, {
        token: token,
        time: new Date().getTime(),
      })
    );
  },
  editStory(story) {
    return requests.patch(
      APIURL + "/album",
      Object.assign(story, { token: token })
    );
  },
  deleteStory(storyKey) {
    return requests.delete(APIURL + "/album", {
      token: token,
      key: storyKey,
    });
  },

  getStoryDetail(storyKey) {
    return requests.get(APIURL + "/album/detailNew", {
      token: token,
      key: storyKey,
    });
  },
  like(storyKey, type) {
    return requests.post(APIURL + "/comment/like", {
      token: token,
      type: type ? type : 6,
      key: storyKey,
    });
  },

  addSubStory(story, fatherStoryKey, fatherSiteName, fatherChannelKey) {
    return requests.post(APIURL + "/album/createCommentAlbum", {
      token: token,
      type: 6,
      ...story,
      fatherAlbumKey: fatherStoryKey,
      fatherAlbumStarName: fatherSiteName,
      fatherSeriesKey: fatherChannelKey,
    });
  },
  /**
   * 子文章加星
   * @param {String} storyKey
   * @param {Number} status 1 投票；2 取消投票
   */
  vote(storyKey, status) {
    return requests.post(APIURL + "/album/pollAlbum", {
      token: token,
      albumKey: storyKey,
      status: status,
    });
  },

  addChannel(stationKey, name, type, extParams) {
    return requests.post(APIURL + "/series", {
      token: token,
      starKey: stationKey,
      name: name,
      type: type,
      groupArray: [],
      ...extParams,
    });
  },
  editChannel(channelKey, name, type, extParams) {
    return requests.patch(APIURL + "/series", {
      token: token,
      key: channelKey,
      name: name,
      type: type,
      groupArray: [],
      ...extParams,
    });
  },
  deleteChannel(channelKey) {
    return requests.delete(APIURL + "/series", {
      token: token,
      key: channelKey,
    });
  },
  sortChannel(stationKey, channelKeys) {
    return requests.patch(APIURL + "/star/setSeriesOrder", {
      token: token,
      starKey: stationKey,
      seriesOrder: channelKeys,
    });
  },
  /**
   * 提取已订阅站点的最新4条
   * @param {Number} curPage
   */
  myStationLatestStory(curPage) {
    return requests.get(APIURL + "/star/myAndCareStarAlbumList", {
      token: token,
      curPage: curPage,
    });
  },

  /**
   * 相册审核
   * @param {*} storyKey
   * @param {*} groupKey
   * @param {Number} passOrNot 2:通过,3:不通过
   */
  audit(storyKey, groupKey, passOrNot) {
    return requests.patch(APIURL + "/album/checkPassOrNot", {
      token: token,
      key: storyKey,
      groupKey: groupKey,
      passOrNot: passOrNot,
    });
  },

  /**
   * 回答问题正确后调用，记录回答正确的状态
   * @param {String} channelKey
   */
  seeChannel(channelKey) {
    return requests.post(APIURL + "/series/seeSeries", {
      token: token,
      seriesKey: channelKey,
    });
  },

  /**
   * 该微站所有频道待审核的相册一次审核通过
   * @param {String} stationKey 微站key
   */
  passAll(stationKey) {
    return requests.patch(APIURL + "/album/checkPassAll", {
      token: token,
      starKey: stationKey,
    });
  },
  /**
   * 设定故事的状态标签
   * @param {String} key 故事key
   * @param {String} statusTag
   */
  updateStatusTag(key, statusTag) {
    return requests.patch(APIURL + "/album/updateStatusTag", {
      token: token,
      albumKey: key,
      statusTag: statusTag,
    });
  },

  /**
   * 统计状态标签个数
   * @param {String} stationKey
   * @param {String} channelKey
   */
  statisticsStatusTag(stationKey, channelKey, statusTag) {
    return requests.get(APIURL + "/album/statisticsStatusTag", {
      token: token,
      starKey: stationKey,
      seriesKey: channelKey,
      statusTag: statusTag,
    });
  },

  // 获取订阅故事列表
  getSubscribeStories(curPage, perPage) {
    return requests.get(APIURL + "/album/seriesAlbumDetail", {
      token: token,
      seriesKey: "subscribe",
      articleType: "[6, 9]",
      curPage: curPage,
      perPage: perPage,
    });
  },
  /**
   * 获取评论列表
   * @param {String} storyKey
   * @param {Number} type 图文：6；文章：9
   */
  getCommentList(storyKey, type) {
    return requests.get(APIURL + "/comment/commentList", {
      token: token,
      key: storyKey,
      type: type,
    });
  },
  // 发表评论
  comment(
    storyKey,
    type,
    content,
    targetCommentKey,
    targetUkey,
    targetName,
    targetContent,
    targetTime
  ) {
    return requests.post(APIURL + "/comment/comment", {
      token: token,
      key: storyKey,
      type: type,
      content: content,
      targetCommentKey: targetCommentKey,
      targetUkey: targetUkey,
      targetName: targetName,
      targetContent: targetContent,
      targetTime: targetTime,
    });
  },
  // 删除评论
  deleteComment(commentKey) {
    return requests.delete(APIURL + "/comment", {
      token: token,
      key: commentKey,
    });
  },

  // TODO 订阅：获取频道订阅的列表
  getSubscribeChannels(seriesKey) {
    return requests.get(APIURL + "/series/subscribeList", {
      token: token,
      seriesKey: seriesKey,
    });
  },

  /**
   * TODO 订阅：频道分发订阅提交
   * @param {String} sourceSeriesKey
   * @param {String} targetSeriesKey
   * @param {Number} disOrSubType 1 分发 4 订阅
   * @param {Number} selectOrNot 1 勾选 2 取消勾选
   */
  channelSubscribe(
    sourceSeriesKey,
    targetSeriesKey,
    disOrSubType,
    selectOrNot
  ) {
    return requests.post(APIURL + "/series/distribute", {
      token: token,
      sourceSeriesKey: sourceSeriesKey,
      targetSeriesKey: targetSeriesKey,
      disOrSubType: disOrSubType,
      selectOrNot: selectOrNot,
    });
  },

  /**
   * TODO 频道订阅处理
   * @param {String} distributeApplyKey 频道分发申请key
   * @param {Number} status 2 同意 3 拒绝
   * @param {Number} feedKey
   */
  dealSubscribe(distributeApplyKey, status, feedKey) {
    return requests.post(APIURL + "/series/dealSubscribe", {
      token: token,
      distributeApplyKey: distributeApplyKey,
      status: status,
      feedKey: feedKey,
    });
  },
};

const plugin = {
  createPlugin(stationKey, name, icon, url) {
    return requests.post(APIURL + "/plugin", {
      token: token,
      publishStarKey: stationKey,
      pluginName: name,
      icon: icon,
      url: url,
    });
  },
  editPlugin(pluginKey, stationKey, name, icon, url) {
    return requests.patch(APIURL + "/plugin", {
      token: token,
      key: pluginKey,
      publishStarKey: stationKey,
      pluginName: name,
      icon: icon,
      url: url,
    });
  },
  deletePlugin(pluginKey) {
    return requests.delete(APIURL + "/plugin", {
      token: token,
      key: pluginKey,
    });
  },

  getPluginList(stationKey, curPage, perPage) {
    return requests.get(APIURL + "/plugin", {
      token: token,
      starKey: stationKey,
      curPage: curPage,
      perPage: perPage,
    });
  },

  subscribePlugin(stationKey, pluginKeys) {
    return requests.post(APIURL + "/plugin/quote", {
      token: token,
      starKey: stationKey,
      pluginAppKeyList: pluginKeys,
    });
  },

  cancelPlugin(pluginKey) {
    return requests.delete(APIURL + "/plugin/quote", {
      token: token,
      key: pluginKey,
    });
  },
  setPlugin(
    pluginKey,
    publish,
    question,
    answer,
    subscribePay,
    monthlyFee,
    annualFee,
    lifelongFee
  ) {
    return requests.patch(APIURL + "/plugin/quote", {
      token: token,
      key: pluginKey,
      groupArray: [],
      publish: publish,
      question: question,
      answer: answer,
      subscribePay: subscribePay,
      monthlyFee: monthlyFee,
      annualFee: annualFee,
      lifelongFee: lifelongFee,
    });
  },

  /**
   * 回答问题正确后调用，记录回答正确的状态
   * @param {String} pluginKey
   */
  seePlugin(pluginKey) {
    return requests.post(APIURL + "/plugin/seePlugin", {
      token: token,
      pluginKey: pluginKey,
    });
  },
  sortPlugin(stationKey, pluginKeys) {
    return requests.patch(APIURL + "/star/setPluginOrder", {
      token: token,
      starKey: stationKey,
      pluginOrder: pluginKeys,
    });
  },
};

const wechat = {
  signature(url) {
    return requests.post(AUTH_URL + "/account/getShareWXInfo", {
      url: url,
    });
  },
};

export default {
  requests,
  auth,
  station,
  story,
  plugin,
  wechat,
  setToken: (_token) => {
    window.localStorage.setItem("TOKEN", _token);
    token = _token;
  },
};
