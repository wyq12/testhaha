import axios from 'axios'

let util = {}

util.ajax = axios.create({
    // baseURL: process.env.API,
    // baseURL: '/api',//开发时
    // baseURL: '',//正式打包
    baseURL: process.env.NODE_ENV === 'development' ? '/api' : '',
    timeout: 30000
})
// history模式
util.GetQueryString = function (paraName) {//获取路径参数
    var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
// hash模式
util.GetUrlParam = function (paraName) {//获取路径参数
    var url = document.location.toString()
    var arrObj = url.split('?')
    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split('&')
        var arr
        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split('=')
            if (arr != null && arr[0] == paraName) {
                return arr[1]
            }
        }
        return ''
    } else {
        return ''
    }
},
    // 根据数据字典找到对应类型
    util.getTypeJsonText = function (dictJson, dictId) {
        if (dictJson == null || dictJson.length == 0) {
            return "";
        }
        for (var i = 0; i < dictJson.length; i++) {
            if (dictJson[i].houseId == dictId) {
                return dictJson[i].houseAddr;
            } else if (dictJson[i].id == dictId) {
                return dictJson[i].text;
            }
        }
        return "";
    },
    util.parseDateTime = function (dstr) {
        if (!dstr) {
            return "";
        } else {
            return dstr.substr(0, 4) + dstr.substr(5, 2) + dstr.substr(8, 2) + dstr.substr(11, 2) + dstr.substr(14, 2) + "00";
        }
    }
// 计算处理时间
util.getDealTimes = function (statrTime, endTime, currentTime, orderStatus) {
    var date1 = new Date(statrTime.replace(/-/g, '/'));  //开始时间
    var date2 = new Date(currentTime.replace(/-/g, '/'));
    if (orderStatus > 1 && endTime != null) {
        date2 = new Date(endTime.replace(/-/g, '/'))

    }
    var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))

    var result = "";
    if (days) {
        result += days + "天";

    }
    if (hours) {
        result += hours + "小时 ";

    }
    if (minutes) {
        result += minutes + "分钟";

    }
    return result;
},
    util.fmDay = function (dstr) {
        if (dstr.length <= 0) {
            return "";
        } else {
            return dstr.substr(0, 4) + "-" + dstr.substr(4, 2) + "-" + dstr.substr(6, 2);
        }
    }
// 2018-12-11 12:12
util.fmDayMin = function (dstr) {
    if (dstr.length <= 0) {
        return "";
    } else {
        return dstr.substr(0, 4) + "-" + dstr.substr(4, 2) + "-" + dstr.substr(6, 2) + " " + dstr.substr(8, 2) + ":" + dstr.substr(10, 2);
    }
}
util.remindTimes = function (remindTime) {
    if (!remindTime) {
        return;
    }
    var fastRemindTime = remindTime;
    remindTime = new Date(remindTime)
    var date2 = new Date().getTime();
    var date3 = date2 - Number(remindTime)  //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    //				//计算相差秒数
    var leave3 = leave2 % (60 * 1000)//计算分钟数后剩余的毫秒数
    var second = Math.floor(leave3 / 1000)
    var result = {};
    var day = 0;
    var hour = 0;
    var min = 0;
    if (days) {
        day = days * 86400;
    }
    if (hours) {
        hour = hours * 3600;
    }
    if (minutes) {
        min = minutes * 60;
    }
    return {
        minute: day + hour + min + second,
        lastTime: fastRemindTime
    };

},
    util.handleConfirm = function (value) {
        var date = new Date(value);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);    //js从0开始取
        var date1 = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();;
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return year + '.' + month + '.' + date1 + ' ' + hour + ':' + minutes
    },
    util.processTime = function (statrTime, type, time, baseNum, endTime) {
        var date2 = new Date();
        var date1 = new Date(statrTime.replace(/-/g, "/"));  //开始时间
        if (endTime != '') {
            date2 = new Date(endTime.replace(/-/g, "/"))
        }
        var date3 = date2.getTime() - date1.getTime()  //时间差的毫秒数
        if (type == 'overTime') {
            date3 = date3 - (time * baseNum)
        }
        //计算出相差天数
        var days = Math.floor(date3 / (24 * 3600 * 1000))
        //计算出小时数
        var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000))
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))
        var result = "";
        var day = 0;
        var hour = 0;
        var min = 0;
        if (days) {
            result += days + '天'
            day += days
        }
        if (hours) {
            result += hours + '时'
            hour += hours
        }
        if (minutes) {
            result += minutes + '分钟'
            min += minutes
        }
        if (type == 'dealing') {
            if (day >= 2) {
                return 1;
            } else {
                return 0;
            }
        } else {
            return {
                totalMIn: days * 24 * 60 + hours * 60 + minutes,
                totalDay: result
            }
        }
    }
util.tranTime = function (time) {
    time = time * 60000
    //计算出相差天数
    var days = Math.floor(time / (24 * 3600 * 1000))
    //计算出小时数
    var leave1 = time % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))
    var result = "";
    var day = 0;
    var hour = 0;
    var min = 0;
    if (days) {
        result += days + '天'
        day += days
    }
    if (hours) {
        result += hours + '时'
        hour += hours
    }
    if (minutes) {
        result += minutes + '分钟'
        min += minutes
    }
    return result
}
export default util
