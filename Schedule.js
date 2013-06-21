        function Schedule(ranges) {
            ranges = 'string' === typeof ranges ? [ranges] : ranges || [];

            this.ranges = [];

            console.log(ranges);

            var range,
                i = 0,
                len = ranges.length,
                start,
                end,
                now = new Date(),
                todayStr = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

            for(; i < len; i++) {
                range = ranges[i].split('~');

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
                if (start.indexOf('-') === -1) {
                    start = todayStr + ' ' + start; 
                }
                if (end.indexOf('-') === -1) {
                    end = todayStr + ' ' + end;
                }

                start = +new Date(start);
                end = +new Date(end);

                //后面的时间比前面的小，则表明跨天，增加一天时间
                if (end <= start) {
                    end += 1000 * 60 * 60 * 24;
                }

                this.ranges[i] = [start, end];
            }
        }
        Schedule.prototype.check = function (time) {
            var ranges = this.ranges,
                i = 0,
                range,
                result = ranges.length <= 0;
            while (range = ranges[i++]) {
                result = time >= range[0] && time <= range[1];
                if (result) {
                    return result;
                }
            }
            return result;
        }
        
        //usage
        //test 2013-6-21
        var schedule = new Schedule([
            //'2013-6-21',                              //2013-6-21全天
            //'2013-6-22~2013-6-23',                    //2013-6-22到2013-6-23全天
            //'2013-6-24 12:3:4~2013-6-25 12:13:20',    //2013-6-24 12:3:4到2013-6-25 12:13:20
            '9:00:00~12:59:59',                         //每天9:00:00到12:59:59
            '9:00:00~8:59:59'                           //9:00:00 到第二天早上 8:59:59
        ]);
        schedule.check('2013-6-21 8:0:0');
