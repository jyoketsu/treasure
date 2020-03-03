import api from "../services/Api";
import { HOST_NAME } from "../global";
import wx from "weixin-js-sdk";

const common = {
  timestamp2DataStr(timestap, format) {
    let date = new Date();
    date.setTime(timestap);
    return this.formatDate(date, format);
  },

  formatDate(Date, format) {
    var date = {
      "M+": Date.getMonth() + 1,
      "d+": Date.getDate(),
      "h+": Date.getHours(),
      "m+": Date.getMinutes(),
      "s+": Date.getSeconds(),
      "q+": Math.floor((Date.getMonth() + 3) / 3),
      "S+": Date.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
      format = format.replace(
        RegExp.$1,
        (Date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    for (var k in date) {
      if (new RegExp("(" + k + ")").test(format)) {
        format = format.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? date[k]
            : ("00" + date[k]).substr(("" + date[k]).length)
        );
      }
    }
    return format;
  },

  dateStr2Timestamp(dateStr) {
    return Date.parse(new Date(dateStr));
  },

  isTimeStamp(timeStamp) {
    let date = new Date();
    return !isNaN(date.setTime(timeStamp));
  },

  // 获取更新时间
  getUpdateTime(timeStamp) {
    let date = new Date();
    date.setTime(timeStamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const min = date.getMinutes();

    let nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth() + 1;
    const nowDay = nowDate.getDate();
    if (year === nowYear && month === nowMonth) {
      switch (nowDay - day) {
        case 0:
          return `${hours}:${min}`;
        case 1:
          return `昨天 ${hours}:${min}`;
        case 2:
          return `前天 ${hours}:${min}`;
        default:
          return `${month}月${day}日 ${hours}:${min}`;
      }
    } else if (year === nowYear) {
      return `${month}月${day}日 ${hours}:${min}`;
    } else {
      return `${year}年${month}月${day}日 ${hours}:${min}`;
    }
  },

  // 比较两时间戳中较近的时间
  getCloserTimeStamp(timeStamp1, timeStamp2) {
    let d1 = new Date(timeStamp1).getTime();
    let d2 = new Date(timeStamp1).getTime();
    if (d1 > d2) {
      return timeStamp1;
    } else {
      return timeStamp2;
    }
  },

  // 生成标识符
  guid(len, radix) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
      ""
    );
    var uuid = [],
      i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
      uuid[14] = "4";

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | (Math.random() * 16);
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join("");
  },

  /**
   * 合并数组并去重
   * @param {Array} bigArray 要合并的数组
   */
  arrayMerge(bigArray) {
    let array = [];
    const middeleArray = bigArray.reduce((a, b) => {
      return a.concat(b);
    });

    middeleArray.forEach(arrItem => {
      if (array.indexOf(arrItem) === -1) {
        array.push(arrItem);
      }
    });

    return array;
  },

  /**
   * 生成随机字符串
   * @param {Boolean} randomFlag 是否任意长度
   * @param {Number} min 任意长度最小位/固定位数
   * @param {Number} max 任意长度最大位
   */
  randomStr(randomFlag, min, max) {
    let str = "",
      range = min,
      arr = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];

    // 随机产生
    if (randomFlag) {
      range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
      let pos = Math.round(Math.random() * (arr.length - 1));
      str += arr[pos];
    }
    return str;
  },

  /**
   * 浏览器定位
   * @param {Function} onComplete
   * @param {Function} onError
   */
  getLocation(onComplete, onError) {
    let AMap = global.AMap;
    if (!AMap) {
      return;
    }
    let geolocation = new AMap.Geolocation({
      enableHighAccuracy: true, //是否使用高精度定位，默认:true
      timeout: 10000, //超过10秒后停止定位，默认：无穷大
      maximumAge: 0, //定位结果缓存0毫秒，默认：0
      convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      showButton: true, //显示定位按钮，默认：true
      buttonPosition: "LB", //定位按钮停靠位置，默认：'LB'，左下角
      buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
      showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
      zoomToAccuracy: true //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
    });

    geolocation.getCurrentPosition();
    AMap.event.addListener(geolocation, "complete", onComplete); //返回定位信息
    AMap.event.addListener(geolocation, "error", onError); //返回定位出错信息
  },

  /**
   * 経緯度によってアドを取得する
   * @param {Number} lng 経度
   * @param {Number} lat 緯度
   */
  getLngLatLocation(lng, lat) {
    let AMap = global.AMap;
    var lnglatXY = [lng, lat];
    return new Promise((resolve, reject) => {
      AMap.service("AMap.Geocoder", function() {
        // コールバック
        let geocoder = new AMap.Geocoder({});
        geocoder.getAddress(lnglatXY, function(status, result) {
          if (status === "complete" && result.info === "OK") {
            var address = result.regeocode;
            resolve(address);
          } else {
            // 取得失敗
            resolve(null);
          }
        });
      });
    });
  },

  /**
   * 写真の経緯度を取得する
   * @param {Object} exif
   */
  getExifLanLat(exif) {
    let lanLat = null;
    if (exif.GPSLongitude && exif.GPSLatitude) {
      lanLat = {};
      // 経度
      let lan = exif.GPSLongitude.val
        .replace(" ", "")
        .replace("/", ",")
        .split(",");
      lan =
        parseFloat(lan[0]) +
        parseFloat(lan[1]) / 60 +
        parseFloat(lan[2]) / 3600;
      lanLat.lan = lan;
      // 緯度
      let lat = exif.GPSLatitude.val
        .replace(" ", "")
        .replace("/", ",")
        .split(",");
      lat =
        parseFloat(lat[0]) +
        parseFloat(lat[1]) / 60 +
        parseFloat(lat[2]) / 3600;
      lanLat.lat = lat;
    }
    // 経緯度を返す
    return lanLat;
  },

  // 获取图片基本信息
  getImageInfo(url) {
    // return requests.get(`${url}?imageInfo`);
    let image = new Image();
    image.src = url;
    return new Promise((resolve, reject) => {
      image.onload = function() {
        resolve({
          width: image.width,
          height: image.height
        });
      };
      image.onerror = () => {
        resolve(null);
      };
    });
  },

  // 判断当前是否在小程序内
  isMiniProgram() {
    return window.__wxjs_environment === "miniprogram";
  },

  // 判断当前是否是手机端
  isMobile() {
    return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
  },

  // 获取url参数
  getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },

  // 获取url中search的值
  getSearchParamValue(search, paramName) {
    const QUERY_PARAMS = new URLSearchParams(search);
    return QUERY_PARAMS.get(paramName);
  },

  /**
   * 获取json数据
   * @param {String} path json路径
   */
  getJson(path) {
    return new Promise(async (resolve, reject) => {
      try {
        let result = await fetch(path);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
  },

  /**
   * 获取dom字符串中的第一个元素内容
   * @param {String} domStr html字符串
   * @returns {Object} result 结果 innerText htmlStr
   */
  getDomFirstChild(domStr) {
    let result = null;
    let doc = new DOMParser().parseFromString(domStr, "text/html");
    let walker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT);
    let node = walker.nextNode();
    while (node !== null) {
      node = walker.nextNode();
      if (node && node.tagName !== "HEAD" && node.tagName !== "BODY") {
        result = {
          innerText: node.innerText,
          htmlStr: node.outerHTML
        };
        break;
      }
    }
    return result;
  },

  isJSON(str) {
    if (typeof str == "string") {
      try {
        JSON.parse(str);
        if (str.indexOf("{") > -1) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
    return false;
  }
};

const operation = {
  async initStation(
    user,
    stationList,
    nowStationKey,
    changed,
    history,
    changeStation,
    setFlag
  ) {
    const hostName = window.location.hostname;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const stationDomain = window.location.pathname.split("/")[1];

    if (user && !nowStationKey && !changed) {
      if (
        hostName === HOST_NAME ||
        hostName === "localhost" ||
        (hostName !== HOST_NAME && !pathname.includes("/offical/home"))
      ) {
        // 指定了要显示的微站
        if (stationDomain && stationDomain !== "account") {
          changeStation(null, stationDomain);
        } else {
          // 登录用户
          if (!user.isGuest && stationList.length !== 0) {
            // 主站key
            let mainStar = null;
            for (let i = 0; i < stationList.length; i++) {
              if (stationList[i].isMainStar) {
                mainStar = stationList[i];
                break;
              }
            }
            if (mainStar) {
              history.push(`/${mainStar.domain}/home`);
            } else {
              const prevDomain = localStorage.getItem("DOMAIN") || "sgkj";
              history.push(`/${prevDomain}/home`);
            }
          } else {
            // 游客用户
            if (pathname === "/") {
              // 什么站点都不指定，跳转到上次访问的微站或者时光科技站
              const prevDomain = localStorage.getItem("DOMAIN") || "sgkj";
              history.push(`/${prevDomain}/home`);
            }
          }
        }
      } else {
        // 专属域名
        setFlag();
        const res = await api.station.getStationName(hostName);
        if (res.msg === "OK") {
          const prevDomain = res.name;
          if (pathname && search) {
          } else {
            history.push("/offical/home");
          }
          changeStation(null, prevDomain);
        } else {
          // window.location.replace("https://www.qingtime.cn/");
        }
      }
    }
  },
  async getUserInfoByKey(userKey) {
    const res = await api.auth.getUserInfoByKey(userKey);
    if (res.statusCode === "200") {
      return [
        `手机：${res.result.mobileArea} ${res.result.mobile}`,
        `姓名：${res.result.profile.trueName ||
          res.result.profile.nickName ||
          "--"}`,
        `性别：${res.result.profile.gender ? "女" : "男"}`,
        `邮箱：${res.result.profile.email || "--"}`,
        `相机：${res.result.profile.camera || "-"} ${res.result.profile
          .cameraModel || "-"}`,
        `地区：${
          res.result.profile.region ? res.result.profile.region.join("-") : "--"
        }`
      ];
    }
  },

  /**
   * 是否显示门户型网站头部
   * @param {String} pathname
   */
  hidePortalHeader(pathname) {
    return (
      pathname === "/account/login" ||
      pathname === "/account/register" ||
      pathname === "/account/reset" ||
      pathname.indexOf("/stationOptions") !== -1 ||
      pathname.indexOf("/me") !== -1 ||
      pathname.indexOf("/subscribe") !== -1 ||
      pathname.indexOf("/myArticle") !== -1 ||
      pathname.indexOf("/editStory") !== -1 ||
      pathname.indexOf("/editArticle") !== -1
    );
  },
  /**
   * 是否是门户类网站详情页
   * @param {String} pathname
   */
  isPortalDetail(pathname) {
    return pathname.split("/")[3] === "detail";
  },
  async handleClickTag(stationKey, domain, channelkey, tagId) {
    sessionStorage.setItem("portal-curpage", 1);
    const result = await api.story.getStoryList(
      1,
      stationKey,
      null,
      channelkey,
      1,
      1,
      tagId,
      "",
      1,
      10
    );
    if (result.statusCode === "200") {
      if (result.result.length === 1) {
        const token = localStorage.getItem("TOKEN");
        const story = result.result[0];
        switch (story.type) {
          case 12:
            window.location.href = `https://editor.qingtime.cn?token=${token}&key=${story._key}`;
            break;
          case 15:
            let url = story.url;
            if (
              url.includes("puku.qingtime.cn") ||
              url.includes("bless.qingtime.cn") ||
              url.includes("exp.qingtime.cn")
            ) {
              url = `${url}/${domain}?token=${token}`;
            }
            // 打开新标签页
            if (story.openType === 1) {
              window.open(url, "_blank");
            } else {
              // 本页内打开
              window.location.href = url;
            }
            break;
          default:
            return result;
        }
      } else {
        return result;
      }
    }
  },

  // 获取微信分享参数
  getShareInfo(nowStation, nowChannelKey, story) {
    const ua = window.navigator.userAgent.toLowerCase();
    // 判断是否是微信浏览器
    if (ua.indexOf("micromessenger") < 0) return false;

    const url = window.location.href;
    // 文章页
    if (
      story &&
      (url.includes("/story?key=") || url.includes("/article?key="))
    ) {
      return {
        url: url,
        title: story.title,
        desc: story.descript || nowStation.memo || nowStation.name,
        imgUrl: story.cover || nowStation.logo
      };
    } else if (
      nowChannelKey &&
      nowChannelKey !== "allSeries" &&
      url.includes("/home/stories/")
    ) {
      // 乡村频道
      let nowChannel;
      for (let i = 0; i < nowStation.seriesInfo.length; i++) {
        if (nowChannelKey === nowStation.seriesInfo[i]._key) {
          nowChannel = nowStation.seriesInfo[i];
          break;
        }
      }
      return {
        url: url,
        title: nowChannel ? nowChannel.name : nowStation.name,
        desc: `${nowStation.name}-${nowChannel ? nowChannel.name : ""}`,
        imgUrl: nowChannel
          ? nowChannelKey.cover || nowChannel.logo
          : nowStation.logo
      };
    } else {
      return {
        url: url,
        title: nowStation.name,
        desc: nowStation.memo || nowStation.name,
        imgUrl: nowStation.logo
      };
    }
  },
  // 微信分享
  async initWechat(url, title, desc, imgUrl) {
    const ua = window.navigator.userAgent.toLowerCase();
    // 判断是否是微信浏览器
    if (ua.indexOf("micromessenger") < 0) return false;
    // 最好在在 router 的全局钩子里调用这个方法，每次页面的 URL 发生变化时，都需要重新获取微信分享参数
    // 如果你的 router 使用的是 hash 形式，应该不用每次都重新获取微信分享参数

    const signature = await api.wechat.signature(url);
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: "wxa273ac80f9f74c3d", // 必填，公众号的唯一标识
      timestamp: parseInt(signature.result.timestamp), // 必填，生成签名的时间戳
      nonceStr: signature.result.nonceStr, // 必填，生成签名的随机串
      signature: signature.result.signature, // 必填，签名，见附录1
      jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(() => {
      //分享给朋友
      wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: "", // 分享类型,music、video或link，不填默认为link
        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
        success: function() {
          // 用户确认分享后执行的回调函数
          console.log("分享成功！");
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
          console.log("取消分享！");
        }
      });

      //分享到朋友圈
      wx.onMenuShareTimeline({
        title: "", // 分享标题
        link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: "", // 分享图标
        success: function() {
          // 用户确认分享后执行的回调函数
        },
        cancel: function() {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  }
};

export default {
  common,
  operation
};
