//日历控件
var MyCalendar = (function () {
    var controller = {
        nowYear : null,//当前年份
        nowMonth : null,//当前月份
        nowDay : null,//今天是几号

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

            if( realMonth < 10 ){
                realMonth = "0" + realMonth;
            }

            return pre_year + "-" + realMonth;
        },

        //打印日历
        FillCalendarList: function(par_month, par_year){
            var self = this;

            par_month = parseInt(par_month) - 1;

            // var startDate = self.startDate;
            // var s_mon = parseInt( startDate.split("-")[1] ) - 1;
            // var s_year = parseInt( startDate.split("-")[0] );

            //获取当前月第一天信息
            var firstDay = new Date(par_year, par_month, 1);

            //获取当前月第一天是星期几
            var week = firstDay.getDay();

            //各月份的总天数
            var leap = self.IsLeap(par_year);
            var daysMonth = new Array(31, 28 + leap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);

            //日历行数
            var rows = Math.ceil( (daysMonth[par_month] + week) / 7 );

            //日历(YYYY-MM)
            var date_time = self.GetDateString(par_month, par_year);
            document.getElementById("nowDataTime").innerText = date_time;

            //日历行
            var list = '';
            for (var i = 0; i < rows; i++) {
                list += '<li>';

                //日历每列（天）
                for (var k = 0; k < 7; k++) {
                    //单元格自然序列号
                    var index = i * 7 + k;

                    //计算日期
                    var date_str = index - week + 1;

                    //过滤无效日期（小于等于零的、大于月总天数的）
                    (date_str <= 0 || date_str > daysMonth[par_month]) ? date_str = "" : date_str = index - week + 1;

                    var isToday = "";
                    var dateValue = date_str;
                    if( date_str == self.nowDay && par_year == self.nowYear && par_month == self.nowMonth ){
                        //是否是今天
                        isToday = "today";
                        dateValue = "今天";
                    }else if( date_str > self.nowDay && par_year >= self.nowYear && par_month >= self.nowMonth ){
                        //大于当前日期的不可选
                        isToday = "hide_day";
                    }

                    var dstr = date_str;
                    if( parseInt(date_str) < 10 ){
                        dstr = "0" + date_str;
                    }
                    var str = date_time + "-" + dstr;

                    list += '<p data-str="'+ str +'" class="'+ isToday +'">'+ dateValue +'</p>';
                }

                //日历行结束
                list += "</li>";
            }

            document.getElementById("calendar_day").innerHTML = list;

            //点击事件
            $("#calendar_day").children("li").on("click", "p", function () {
                var dataStr = $(this).attr("data-str");
                var className = $(this).attr("class");

                if( className != "hide_day" ){
                    window.location.href = "everdaybill.html?date=" + dataStr;
                }
            });
        },

        Init: function () {
            var self = this;

            // document.getElementsByClassName("icon_left")[0].className = "";
            // document.getElementsByClassName("icon_right")[0].className = "";

            //我的日历
            var date = new Date(); //当前Date资讯
            self.nowDay = date.getDate(); //获取今天是几号
            self.nowYear = date.getFullYear(); //获取年份
            self.nowMonth = date.getMonth(); //获取当前的月份，返回值是0(一月)到11(十二月)之间的一个整数。

            self.FillCalendarList(self.nowMonth + 1, self.nowYear);
        },
    };

    return controller;
}());