// const APIURL = 'https://home.qingtime.cn/home';
const APIURL = 'http://192.168.1.139:8529/_db/TimeBox/my/sgbh';

let token = null;

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
        let param = {
            mobileArea: params.mobileArea,
            mobile: params.mobile,
            password: params.password,
            // ip: "127.0.0.1",
            service: 3,
            lo: 13,
            la: 14,
            app: 3,
            deviceType: 4,
            deviceModel: 'web'
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
    getUptoken(token) {
        return requests.get(APIURL + '/upTokenQiniu/getQiNiuUpToken', {
            token: token,
            type: 2
        });
    },

    // 获取临时token
    getTempToken() {
        return requests.get(APIURL + '/account/loginAnonymousUser');
    },

    // 获取登录用户信息
    getUserFullInfo(token) {
        return requests.get(APIURL + '/account/userinfo', { 'token': token });
    },
}

const station = {
    getStationList() {
        return requests.get(APIURL + '/star/careAndMyList', {
            token: token
        });
    },
    getNewsDetail(key) {
        return requests.get(APIURL + '/album/detail2', {
            key: key,
        });
    }
}

export default {
    auth,
    station,
    setToken: _token => {
        window.localStorage.setItem('TOKEN', _token);
        token = _token;
        console.log('setToken-----------', token);
    },
};