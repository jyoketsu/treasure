
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
            format = format.replace(RegExp.$1, (Date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
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
                case 0: return `${hours}:${min}`;
                case 1: return `昨天 ${hours}:${min}`;
                case 2: return `前天 ${hours}:${min}`;
                default: return `${month}月${day}日 ${hours}:${min}`;
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
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }

        return uuid.join('');
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

        middeleArray.forEach((arrItem) => {
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
        let str = '',
            range = min,
            arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

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
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });

        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
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
            AMap.service('AMap.Geocoder', function () {// コールバック
                let geocoder = new AMap.Geocoder({
                });
                geocoder.getAddress(lnglatXY, function (status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        var address = result.regeocode
                        resolve(address);
                    } else {
                        // 取得失敗
                        resolve(null);
                    }
                });
            })
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
            let lan = exif.GPSLongitude.val.replace(" ", "").replace("/", ",").split(",");
            lan = parseFloat(lan[0]) + parseFloat(lan[1]) / 60 + parseFloat(lan[2]) / 3600;
            lanLat.lan = lan;
            // 緯度
            let lat = exif.GPSLatitude.val.replace(" ", "").replace("/", ",").split(",");
            lat = parseFloat(lat[0]) + parseFloat(lat[1]) / 60 + parseFloat(lat[2]) / 3600;
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
            image.onload = function () {
                resolve({
                    width: image.width,
                    height: image.height,
                });
            }
        });

    },

    // 判断当前是否在小程序内
    isMiniProgram() {
        return window.__wxjs_environment === 'miniprogram';
    },

    // 判断当前是否是手机端
    isMobile() {
        return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
    },

    // 获取url参数
    getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
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
                }
                break;
            }
        }
        return result;
    },
}

export default {
    common
};