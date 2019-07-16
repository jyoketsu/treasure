import api from './Util';
const APIURL = 'https://baokudata.qingtime.cn/sgbh';
// const APIURL = 'http://192.168.1.138:8529/_db/TimeBox/my/sgbh';
// const API = 'http://192.168.1.101:8051';
let token = 'FLQ1K86TTORG4LUZ2I68TAPSWC69AR1ES55L9UPW4LWIRTYS1561345482667';

const requests = {
    // post方法
    post(url, params) {
        return new Promise(async function (resolve, reject) {
            try {
                let result = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(params),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const json = await result.json();
                resolve(json);
            }
            catch (e) {
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
            }
            catch (e) {
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
                    method: "GET"
                });

                const json = await result.json();
                resolve(json);
            }
            catch (e) {
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
                        "Content-Type": "application/json"
                    },
                });
                const json = await result.json()
                resolve(json);
            }
            catch (e) {
                reject(e);
            }
        })
    },

    // delete方法
    delete(url, param) {
        return new Promise(async function (resolve, reject) {
            try {
                let result = await fetch(url, {
                    method: "DELETE",
                    body: JSON.stringify(param),
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const json = await result.json()
                resolve(json);
            }
            catch (e) {
                reject(e);
            }
        })
    },
}

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
            deviceModel: isMobile ? 'mobile' : 'web',
        };
        return requests.get(APIURL + '/account', param);
    },

    // 注册
    register(params) {
        return requests.post(APIURL + '/account', params);
    },

    // 重置密码
    resetPassword(params) {
        return new Promise(async (resolve, reject) => {
            try {
                params.service = 3;
                let tempTokenRes = await requests.get(APIURL + '/account/getTempToken', params);
                if (tempTokenRes.msg === 'OK') {
                    let res = await requests.patch(APIURL + '/account/pwdSet', {
                        tempToken: tempTokenRes.result,
                        password: params.password,
                    });
                    resolve(res);
                } else {
                    resolve(tempTokenRes);
                }
            } catch (error) {
                reject();
            }

        });
    },

    // 获取验证码
    getVerifyCode(params) {
        return requests.post(APIURL + '/account/verifyCode', params);
    },

    thirdLogin(uId, type) {
        return requests.get(APIURL + '/account/thirdLogin', {
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
        return requests.post(APIURL + '/account/thirdRegister', {
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
        return requests.get(APIURL + '/upTokenQiniu/getQiNiuUpToken', {
            token: token,
            type: 2
        });
    },

    getToken() {
        return token;
    },

    // 获取临时token
    getTempToken() {
        return requests.get(APIURL + '/account/loginAnonymousUser');
    },

    // 获取登录用户信息
    getUserFullInfo() {
        return requests.get(APIURL + '/account/userinfo', { 'token': token });
    },

    editAccount(profile) {
        return requests.patch(APIURL + '/account', {
            token: token,
            profile: profile,
        });
    },

    searchUser(keyword) {
        return requests.get(APIURL + '/account/userSearchStar', {
            token: token,
            searchCondition: keyword,
        });
    },
    groupMember(groupId) {
        return requests.get(APIURL + '/groupmember', {
            token: token,
            groupId: groupId,
        });
    },
    addGroupMember(groupId, targetUidList) {
        return requests.post(APIURL + '/groupmember', {
            token: token,
            groupKey: groupId,
            targetUidList: targetUidList
        });
    },
    setMemberRole(groupId, targetUKey, role, ) {
        return requests.patch(APIURL + '/groupmember/setRole', {
            token: token,
            groupKey: groupId,
            targetUKey: targetUKey,
            role: role,
        });
    },
}

const station = {
    // 获取微站列表
    getStationList() {
        // return requests.get(APIURL + '/star/careAndMyList', {
        return requests.get(APIURL + '/star/careAndMyDetail', {
            token: token
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
    createStation(name, domain, type, memo, isMainStar, cover, logo, size, inheritedMode, ) {
        return requests.post(APIURL + '/star/createStar', {
            token: token,
            name: name.trim(),
            domain: domain,
            type: type,
            memo: memo,
            isMainStar: isMainStar,
            cover: cover,
            logo: logo,
            size: size,
            inheritedMode: inheritedMode,
        });
    },

    deleteStation(key) {
        return requests.delete(APIURL + '/star/deleteStar', {
            token: token,
            starKey: key,
        });
    },

    editStation(key, name, domain, type, memo, isMainStar, cover, logo, size, inheritedMode, ) {
        return requests.patch(APIURL + '/star/setStarProperty', {
            token: token,
            starKey: key,
            name: name.trim(),
            domain: domain,
            type: type,
            memo: memo,
            isMainStar: isMainStar,
            cover: cover,
            logo: logo,
            size: size,
            inheritedMode: inheritedMode,
        });
    },
    getStationDetail(key) {
        return requests.get(APIURL + '/star/starDetail', {
            token: token,
            starKey: key,
        });
    },
    getStationDetailByDomain(domain) {
        return requests.get(APIURL + '/star/starDetailByDomain', {
            token: token,
            domain: domain,
        });
    },
    getStationKey(domain) {
        return requests.get(APIURL + '/star/getStarKeyByDomain', {
            token: token,
            domain: domain,
        });
    },

    searchStation(keyword, curPage, perPage) {
        return requests.get(APIURL + '/star/searchStar', {
            token: token,
            searchCondition: keyword,
            curPage: curPage,
            perPage: perPage,
        });
    },

    subscribe(channelKeys, stationKey, ) {
        return requests.post(APIURL + '/series/dealCareSeriesBatch', {
            token: token,
            seriesKeyArray: channelKeys,
            starKey: stationKey,
        });
    },

    subscribeStation(stationKey, checked) {
        return requests.patch(APIURL + '/star/dealCareStarAllSeries', {
            token: token,
            starKey: stationKey,
            status: checked,
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
        return requests.post(APIURL + '/transfer/transfer', {
            token: token,
            type: type,
            starKey: stationKey,
            transferContent: transferContent,
            targetUKey: targetUKey
        });
    },
}

const story = {
    getStoryList(type, starKey, seriesKey, sortType, sortOrder, curPage, perPage) {
        return requests.get(APIURL + '/album', {
            token: token,
            type: type,
            starKey: starKey,
            seriesKey: seriesKey,
            sortType: sortType,
            sortOrder: sortOrder,
            curPage: curPage,
            perPage: perPage,
        });
    },

    // 编辑上锁
    applyEdit(key, time) {
        return requests.post(APIURL + '/album/applyEdit', {
            token: token,
            albumKey: key,
            mobileTime: time
        });
    },

    // 编辑解锁
    exitEdit(key) {
        return requests.post(APIURL + '/album/exitEdit', {
            token: token,
            albumKey: key,
        });
    },

    addStory(story) {
        return requests.post(APIURL + '/album', Object.assign(story, { token: token }));
    },
    editStory(story) {
        return requests.patch(APIURL + '/album', Object.assign(story, { token: token }));
    },
    deleteStory(storyKey) {
        return requests.delete(APIURL + '/album', {
            token: token,
            key: storyKey,
        });
    },

    getStoryDetail(storyKey) {
        return requests.get(APIURL + '/album/detailNew', {
            token: token,
            key: storyKey,
        });
    },
    like(storyKey) {
        return requests.post(APIURL + '/comment/like', {
            token: token,
            type: 6,
            key: storyKey,
        });
    },

    addChannel(stationKey, name, type, extParams) {
        return requests.post(APIURL + '/series', {
            token: token,
            starKey: stationKey,
            name: name,
            type: type,
            groupArray: [],
            ...extParams,
        });
    },
    editChannel(channelKey, name, type, extParams) {
        return requests.patch(APIURL + '/series', {
            token: token,
            key: channelKey,
            name: name,
            type: type,
            groupArray: [],
            ...extParams,
        });
    },
    deleteChannel(channelKey) {
        return requests.delete(APIURL + '/series', {
            token: token,
            key: channelKey,
        });
    },
    /**
     * 提取已订阅站点的最新4条
     * @param {Number} curPage 
     */
    myStationLatestStory(curPage) {
        return requests.get(APIURL + '/star/myAndCareStarAlbumList', {
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
        return requests.patch(APIURL + '/album/checkPassOrNot', {
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
        return requests.post(APIURL + '/series/seeSeries', {
            token: token,
            seriesKey: channelKey,
        });
    }
}

const plugin = {
    createPlugin(stationKey, name, icon, url) {
        return requests.post(APIURL + '/plugin', {
            token: token,
            publishStarKey: stationKey,
            pluginName: name,
            icon: icon,
            url: url
        });
    },
    editPlugin(pluginKey, stationKey, name, icon, url) {
        return requests.patch(APIURL + '/plugin', {
            token: token,
            key: pluginKey,
            publishStarKey: stationKey,
            pluginName: name,
            icon: icon,
            url: url
        });
    },
    deletePlugin(pluginKey) {
        return requests.delete(APIURL + '/plugin', {
            token: token,
            key: pluginKey,
        });
    },

    getPluginList(stationKey, curPage, perPage) {
        return requests.get(APIURL + '/plugin', {
            token: token,
            starKey: stationKey,
            curPage: curPage,
            perPage: perPage,
        });
    },

    subscribePlugin(stationKey, pluginKeys) {
        return requests.post(APIURL + '/plugin/quote', {
            token: token,
            starKey: stationKey,
            pluginAppKeyList: pluginKeys
        });
    },

    cancelPlugin(pluginKey) {
        return requests.delete(APIURL + '/plugin/quote', {
            token: token,
            key: pluginKey,
        });
    },
    setPlugin(pluginKey, publish, question, answer, subscribePay, monthlyFee, annualFee, lifelongFee) {
        return requests.patch(APIURL + '/plugin/quote', {
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
        return requests.post(APIURL + '/plugin/seePlugin', {
            token: token,
            pluginKey: pluginKey,
        });
    },
}

export default {
    requests,
    auth,
    station,
    story,
    plugin,
    setToken: _token => {
        window.localStorage.setItem('TOKEN', _token);
        token = _token;
    },
};