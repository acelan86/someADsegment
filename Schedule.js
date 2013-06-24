/**
 * 广告日程判断
 * @param {Mix} ranges 排期时间段，可以是一个字符串，或者一个数据，表示多个时间段例如:
 * [
 *   '2013-6-21',                              //2013-6-21全天
 *   '2013-6-22~2013-6-23',                    //2013-6-22到2013-6-23全天
 *   '2013-6-24 12:3:4~2013-6-25 12:13:20',    //2013-6-24 12:3:4到2013-6-25 12:13:20
 *   '9:00:00~12:59:59',                       //每天9:00:00到12:59:59
 *   '9:00:00~8:59:59'                         //9:00:00 到第二天早上 8:59:59
 * ] 或者
 * 其中一个字符串当参数
 *
 * @usage
 *   var schedule = new Schedule(ranges);
 *   检查是否在排期内的方法
 *   schedule.check('2013-06-21 6:0:0');  一个Date对象或者日期字符串即可 
 */

function Schedule(ranges) {
    ranges = 'string' === typeof ranges ? [ranges] : ranges || [];

    this.ranges = [];

    var range,
        i = 0,
        len = ranges.length,
        start,
        end,
        now = new Date(),
        todayStr = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();

    for(; i < len; i++) {
        range = ranges[i].replace(/\-/g, '/').split('~');

        start = range[0];
        end = range[1] ? range[1] : range[0]; //"2013-6-21" -> "2013-06-21, 2013-06-21"

        //"2013-6-21" -> '2013-6-21 0:0:0'
        if (start.indexOf(':') === -1) {
            start += ' 0:0:0';
        }
        if (end.indexOf(':') === -1) {
            end += ' 0:0:0';
        }

        //"10:0:0" -> "2013-6-21 10:0:0" today 10:0:0
        if (start.indexOf('/') === -1) {
            start = todayStr + ' ' + start; 
        }
        if (end.indexOf('/') === -1) {
            end = todayStr + ' ' + end;
        }

        start = +this.parse(start);
        end = +this.parse(end);

        //后面的时间比前面的小，则表明跨天，增加一天时间
        if (end <= start) {
            end += 1000 * 60 * 60 * 24;
        }

        this.ranges[i] = [start, end];
    }
}

Schedule.prototype = {
    /**
     * 检查是否在日程范围内
     * @param  {String | Date} time 要检查的日期
     * @return {Boolean}            是否在日程内
     */
    check : function (time) {
        var ranges = this.ranges,
            i = 0,
            range,
            result = ranges.length <= 0,
            time = +this.parse(time);
        while (!result && (range = ranges[i++])) {
            result = time >= range[0] && time <= range[1];
        }
        return result;
    },
    /**
     * 解析方法
     * @tangram T.date.parse
     */
    parse : function (time) {
        var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
        if ('string' == typeof time) {
            if (reg.test(time) || isNaN(Date.parse(time))) {
                var d = time.split(/ |T/),
                    d1 = d.length > 1 
                            ? d[1].split(/[^\d]/) 
                            : [0, 0, 0],
                    d0 = d[0].split(/[^\d]/);
                return new Date(d0[0] - 0, 
                                d0[1] - 1, 
                                d0[2] - 0, 
                                d1[0] - 0, 
                                d1[1] - 0, 
                                d1[2] - 0);
            } else {
                return new Date(time);
            }
        }
         
        return time;
    }
};

/*
//usage
//test 2013-6-21
var schedule = new Schedule([
    //'2013-6-21',                              //2013-6-21全天
    //'2013-6-22~2013-6-23',                    //2013-6-22到2013-6-23全天
    //'2013-6-24 12:3:4~2013-6-25 12:13:20',    //2013-6-24 12:3:4到2013-6-25 12:13:20
    //'9:00:00~12:59:59',                        //每天9:00:00到12:59:59
    '9:00:00~8:59:59'                         //9:00:00 到第二天早上 8:59:59
]);
schedule.check(+new Date('2013/6/21 8:0:0'));
*/
