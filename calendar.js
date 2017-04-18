//日历控件
(function (window, document, Math) {

    function Calendar(el, options) {
        this.calendarEl = typeof el == 'string' ? document.querySelector(el) : el;
        this.options = {
            minDate: '',    // 最小限制日期（参数可选）
            maxDate: '',    // 最大限制日期（参数可选）
            callBack: null  // 回调函数（参数可选）
        };

        for ( var i in options ) {
            this.options[i] = options[i];
        }

        this.nowDay = new Date().getDate(); //获取今天是几号
        this.nowYear = new Date().getFullYear(); //获取年份
        this.nowMonth = new Date().getMonth(); //获取当前的月份，0-11

        // 参数校验
        if( this.paramCheck() != 0 ){
            this.calendarHead();// 日历头
            this.FillCalendarList(this.nowMonth + 1, this.nowYear);// 日历
            this.clendarEvent();// 日历点击事件
        }
    }

    Calendar.prototype = {
        //判断是否为闰年:(1)年份能被4整除，但不能被100整除；(2)年份能被400整除。
        IsLeap : function (year) {
            if( (year % 4 == 0 && year % 100 != 0) || ( year % 400 == 0 ) ){
                return 1;
            }
            return 0;
        },

        //获取当前显示的日历的行程的日期
        GetDateString : function(pre_month, pre_year){
            var realMonth = parseInt(pre_month) + 1;
            realMonth = realMonth < 10 ? "0" + realMonth : realMonth;
            return pre_year + "-" + realMonth;
        },

        // 日历头部
        calendarHead: function () {
            var self = this;
            var list = '<div id="calendar">';

            // head
            list += '<p class="calenday_head">';
            list += '<i class="icon_left" id="prevMonth"></i>';
            list += '<span id="nowDataTime"></span>';
            list += '<i class="icon_right" id="nextMonth"></i>';
            list += '</p>';

            // week
            list += '<ul class="calendar_week"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>';
            list += '<ul class="calendar_day" id="calendar_day"></ul></div>';

            self.calendarEl.innerHTML = list;
        },

        //打印日历
        FillCalendarList: function(par_month, par_year){
            var self = this;

            par_month = parseInt(par_month) - 1;

            //获取当前月第一天信息
            var firstDay = new Date(par_year, par_month, 1);
            var week = firstDay.getDay();//获取当前月第一天是星期几

            //各月份的总天数
            var leap = self.IsLeap(par_year);
            var daysMonth = new Array(31, 28 + leap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

            var rows = Math.ceil( (daysMonth[par_month] + week) / 7 );//日历行数
            var date_time = self.GetDateString(par_month, par_year);//日历(YYYY-MM)
            document.querySelector('#nowDataTime').innerText = date_time;

            //日历行
            var list = '';
            for (var i = 0; i < rows; i++) {
                list += '<li>';

                //日历每列（天）
                for (var k = 0; k < 7; k++) {
                    var index = i * 7 + k;//单元格自然序列号
                    var date_str = index - week + 1;//计算日期

                    //过滤无效日期（小于等于零的、大于月总天数的）
                    (date_str <= 0 || date_str > daysMonth[par_month]) ? date_str = "" : date_str = index - week + 1;

                    var isToday = "";
                    var dateValue = date_str;
                    if( date_str == self.nowDay && par_year == self.nowYear && par_month == self.nowMonth ){
                        //是否是今天
                        isToday = " today";
                        dateValue = '今天';
                    }

                    //大于maxDate的不可选
                    if( self.options.maxDate ){
                        var maxDate = self.options.maxDate;
                        var maxYear = parseInt( maxDate.split("-")[0] );
                        var maxMonth = parseInt( maxDate.split("-")[1] );
                        var maxDay = parseInt( maxDate.split("-")[2] );
                        if( date_str > maxDay && par_year >= maxYear && par_month >= maxMonth - 1 ){
                            isToday = " hide_day";
                        }
                    }

                    //小于minDate日期的不可选
                    if( self.options.minDate ){
                        var minDate = self.options.minDate;
                        var minYear = parseInt( minDate.split("-")[0] );
                        var minMonth = parseInt( minDate.split("-")[1] );
                        var minDay = parseInt( minDate.split("-")[2] );
                        if( date_str <= minDay && par_year <= minYear && par_month <= minMonth - 1 ){
                            isToday = " hide_day";
                        }
                    }

                    var dstr = date_str;
                    if( parseInt(date_str) < 10 ){
                        dstr = "0" + date_str;
                    }
                    var str = date_time + "-" + dstr;

                    var itemClass = '';
                    if( dateValue ){
                        itemClass = 'cd-item';
                    }
                    list += '<p data-str="'+ str +'" class="'+ itemClass + isToday +'"><span>'+ dateValue +'</span></p>';
                }

                //日历行结束
                list += "</li>";
            }

            document.querySelector('#calendar_day').innerHTML = list;

            self.checkOnly('.cd-item');
        },

        // 选择日期
        checkOnly: function ( str ) {
            var self = this;

            var nodeArr = document.querySelectorAll(str);
            for( var n = 0; n < nodeArr.length; n++ ){

                // 不在minDate & maxDate 之间的日期 不能被选择
                var classNameStr = nodeArr[n].className;
                if( classNameStr.indexOf('hide_day') !== -1){
                    continue;
                }

                // 绑定点击事件
                nodeArr[n].addEventListener('click', function (e) {
                    e.stopPropagation();
                    var cdActive = document.querySelectorAll('.cd_active');
                    if( cdActive && cdActive.length > 0 ){
                        for( var m = 0; m < cdActive.length; m++ ) {
                            var activeClass = cdActive[m].className;
                            cdActive[m].className = activeClass.substr(0, activeClass.indexOf('cd_active'));
                        }
                    }

                    var nowClass = this.className;
                    this.className = nowClass + ' cd_active';

                    var date = this.getAttribute('data-str');
                    if( self.options.callBack ){
                        self.options.callBack(date);
                    }
                }, false);
            }
        },

        clendarEvent: function () {
            var self = this;
            var minDate = self.options.minDate;
            var maxDate = self.options.maxDate;

            // 前一个月
            document.querySelector('#prevMonth').addEventListener('click', function (e) {
                var nowDate = document.querySelector("#nowDataTime").innerText;
                var nowYear = parseInt( nowDate.split("-")[0] );
                var nowMon = parseInt( nowDate.split("-")[1] );

                if( nowMon == 1 ){
                    nowMon = 12;
                    nowYear -= 1;
                }else{
                    nowMon -= 1;
                }

                // 是否有限制最小日期
                if( minDate ){
                    var minYear = parseInt( minDate.split("-")[0] );
                    var minMonth = parseInt( minDate.split("-")[1] );

                    if( nowMon == minMonth && nowYear == minYear ){
                        this.className = "icon_hide_left";
                    }

                    if( nowYear > minYear || ( nowYear == minYear && nowMon >= minMonth ) ){
                        var iconHideRight = document.querySelectorAll(".icon_hide_right");
                        if( iconHideRight.length > 0 ){
                            iconHideRight[0].className = "icon_right";
                        }

                        self.FillCalendarList(nowMon, nowYear);
                    }
                }else{
                    self.FillCalendarList(nowMon, nowYear);
                }
            }, false);

            // 下一个月
            document.querySelector('#nextMonth').addEventListener('click', function () {
                var nowDate = document.querySelector("#nowDataTime").innerText;
                var nowYear = parseInt( nowDate.split("-")[0] );
                var nowMon = parseInt( nowDate.split("-")[1] );

                if( nowMon == 12 ){
                    nowMon = 1;
                    nowYear += 1;
                }else{
                    nowMon += 1;
                }

                // 是否有限制最大日期
                if( maxDate ){
                    var maxYear = parseInt( maxDate.split("-")[0] );
                    var maxMonth = parseInt( maxDate.split("-")[1] );

                    if( nowMon == maxMonth && nowYear == maxYear ){
                        this.className = "icon_hide_right";
                    }

                    if( nowYear < maxYear || ( nowMon <= maxMonth && nowYear == maxYear ) ){
                        var iconHideLeft = document.querySelectorAll(".icon_hide_left");
                        if( iconHideLeft.length > 0 ){
                            iconHideLeft[0].className = "icon_left";
                        }
                        self.FillCalendarList(nowMon, nowYear);
                    }
                }else{
                    self.FillCalendarList(nowMon, nowYear);
                }
            }, false);
        },

        // 参数校验
        paramCheck: function () {
            var self = this;

            var minDate = self.options.minDate;
            var maxDate = self.options.maxDate;

            if( minDate ){
                var len1 = minDate.split("-").length;
                if( len1 != 3 ){
                    self.calendarEl.innerHTML = '<p style="color: red;">minDate参数格式不正确</p>';
                    return 0;
                }
            }

            if( maxDate ){
                var len2 = maxDate.split("-").length;
                if( len2 != 3 ){
                    self.calendarEl.innerHTML = '<p style="color: red;">maxDate参数格式不正确</p>';
                    return 0;
                }
            }
        }
    };

    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = Calendar;
    } else {
        window.Calendar = Calendar;
    }

})(window, document, Math);

// export default Calendar;
