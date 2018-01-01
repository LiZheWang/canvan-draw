var Base = {
    AjaxPost: function (url, arg, callback, errCallBack, complateCallBack, info) {

        if (arg == null)arg = {};

        arg._r = 'json';
        arg._v = 100;
        arg._t = new Date().getTime();

        $.ajax({
            url: url,
            type: 'POST',
            async: true,
            data: arg,
            cache: false,
            success: function (data) {

                if (data) {

                    if (data.ret == 0) {

                        if (callback)callback(data, info);

                        return;
                    }

                    if (errCallBack) {
                        errCallBack(data.msg, data.ret, info);
                    }
                    else {
                        layer.alert(data.msg, {icon:2});
                    }

                } else {
                    if (errCallBack) {
                        errCallBack('系统发生错误', info)
                    }
                    else {
						layer.alert('系统发生错误', {icon:2});
                    }

                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {

                if (XMLHttpRequest.readyState == 4) {
                    if (errCallBack) {
                        errCallBack('系统发生错误', info)
                    }
                    else {
                        layer.alert('系统发生错误', {icon:2});
                    }
                    return;
                }

                if (errCallBack) {
                    errCallBack('网络似乎不通', info)
                }
                else {
                    layer.alert('系统发生错误', {icon:2});
                }

            },
            complete: function (jqXHR, textStatus) {
                if (complateCallBack) complateCallBack(info);
            },
            dataType: 'json'
        });

    }, bytesToSize: function (bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024,
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    strToSeconds: function (str) {

        var arr = str.split(':');

        if (arr.length != 3)return '';
        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);

    }, Countdown2: function (ts, isms, fixed) {

        var obj = WBBase.Countdown(ts, isms);
        var str = '';
        //if (obj.dd != '00' || (obj.dd == '00' && fixed))str += obj.dd + ':';
        //if (obj.hh != '00' || (obj.hh == '00' && fixed))str += obj.hh + ':';
		str += obj.hh + ':' + obj.mm + ':' + obj.ss;
        //str += obj.mm + ':' + obj.ss;

        return str;
    },
    Countdown: function (ts, isms) {

        if (isms) ts /= 1000; 

        var dd = parseInt(ts / 60 / 60 / 24, 10);//计算剩余的天数
        var hh = parseInt(ts / 60 / 60 % 24, 10);//计算剩余的小时数
        var mm = parseInt(ts / 60 % 60, 10);//计算剩余的分钟数
        var ss = parseInt(ts % 60, 10);//计算剩余的秒数

        var obj = {};
        obj.dd = this.checkTime(dd);
        obj.hh = this.checkTime(hh);
        obj.mm = this.checkTime(mm);
        obj.ss = this.checkTime(ss);

        return obj;

    }, checkTime: function (i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
}
var WBBase = Base;