<template>
  <div class="times">
    <div class="time-top">
      <div class="row">
        <div class="aui-col-xs-4" style="text-align: center;"><i class="aui-iconfont aui-icon-left" tapmode="" @click="beforeDate('left')"></i></div>
        <div class="aui-col-xs-4 currenttime">{{today}}</div>
        <div class="aui-col-xs-4" style="text-align: center"><i class="aui-iconfont aui-icon-right" tapmode="" @click="nextDate('right')"></i></div>
      </div>
    </div>
    <div class="time-bottom">
      <p class="week">
        <span v-for="(item,index) of weeks" :key="index">{{item}}</span>
      </p>
      <p class="day">
        <span v-for="(item,index) of months" :key="index"><span class="dayitem"
        :class="{'fontcolor':item.state,'finish':item.date==flag & item.state,}"
            tapmode="" @click="getIndex(index,item.date)">{{item.showDate}}</span></span>
      </p>
    </div>
  </div>
</template>

<script>
  var temp = new Date();
  export default {
    name: "AWeek",
    data() {
      return {
        weeks: [],
        months: [],
        day: 0,
        date: 0,
        month: 0,
        d: 0,
        today: '',
        flag: 0,
      }
    },
    props: {
    },
    methods: {
      index(){
        this.d = new Date(); //当前日期
        this.day = this.d.getDay(); //周几
        this.date = this.d.getDate(); //几号
        this.month = this.d.getMonth() + 1; //月
        var timestr = this.month + "月" + this.date + "日";
        this.today = timestr;
        // this.flag = this.date;
        this.flag = this.formatDate(this.d);
        this.getResult(this.d);
        var ctime = parseInt(this.d.getFullYear().toString() + this.month.toString() + this.date.toString());
      },
      getMonDate: function(test) {
        if (test.getDay() == 1)
          return test;
        if (test.getDay() == 0)
          test.setDate(test.getDate() - 6);
        else
          test.setDate(test.getDate() - test.getDay() + 1);
        return test;
      },
      // 0-6转换成中文名称
      getDayName: function(day) {
        var day = parseInt(day);
        if (isNaN(day) || day < 0 || day > 6)
          return false;
        var weekday = ["日", "一", "二", "三", "四", "五", "六"];
        return weekday[day];
      },
      getResult: function(time, a) {
        var timeobj = this.getMonDate(time); // timeobj是当前星期一的日期对象
        var temTime = new Date(timeobj.getTime()); //当前当前星期一对象转换成时间戳
        var arr = [];
        var week = [];
        var dayss = new Date();
        for (var i = 0; i < 7; i++) {
          var time1 = new Date(temTime.getTime());
          var time2 = dayss.getTime();
          var result = time1 <= time2;
          var ymd = this.formatDate(temTime);
          // arr.push({'dayss':temTime.getDate(),'daystate':false}); //一周几号
          arr.push({
            'date': ymd,
            'state': true,
            'showDate': temTime.getDate()
          });
          week.push(this.getDayName(temTime.getDay())); //一周 周几
          temTime.setDate(temTime.getDate() + 1);
        }
        this.weeks = week;
        this.months = arr;
        console.log(this.months);

        if (a == 'left') {
          // $(".dayitem").removeClass("finish");
          this.flag = this.months[this.months.length - 1].date;
          var temp1 = temp;
          temp1.setDate(temp1.getDate() - temp1.getDay() + 7);
          this.getTimes(temp1);
        } else if (a == 'right') {
          // $(".dayitem").removeClass("finish");
          this.flag = this.months[0].date;
          var temp1 = temp;
          this.getTimes(temp1);
        }
      },
      getTimes: function(temp2) {
        var m = temp2.getMonth() + 1;
        var d = temp2.getDate();
        if (m < 10) {
          m = "0" + m;
        }
        if (d < 10) {
          d = "0" + d;
        }
        this.today = m + "月" + d + "日";
      },
      beforeDate: function(action) {
        temp.setDate(temp.getDate() - 7);
        this.getResult(temp, action);
      },
      nextDate: function(action) {
        temp.setDate(temp.getDate() + 7);
        this.getResult(temp, action);
      },
      formatDate: function(date) {
        var year = date.getFullYear();
        var months = date.getMonth() + 1;
        var month = (months < 10 ? '0' + months : months).toString();
        var day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
        return year + month + day;
      },
      getIndex: function(idx, item) {
        this.flag = this.months[idx].date;
        var year = item.substring(0, 4);
        var month = item.substring(4, 6);
        var day = item.substring(6, 8);
        var str = month + "月" + day + "日";
        this.today = str;
        console.log(item);
        // getReportList(year + '-' + month + '-' + day);
        this.$emit('getSelectDate', year + '-' + month + '-' + day)
      }
    },
    created() {
      this.index()
    }
  }
</script>

<style lang="scss">
  .times {
    height: 5.4rem;
    width: 100%;
    padding: 0.75rem 0.75rem 0rem;
    text-align: center;
    margin-bottom: 0.75rem;
  }

  .time-top {
    width: 100%;
    height: 1.5rem;
  }

  .aui-icon-left,
  .aui-icon-right {
    width: 0.35rem;
    height: 0.7rem;
    color: #999999;
  }

  .currenttime {
    font-size: 15px;
    font-weight: bold;
    color: #8ACBAD;
  }

  .week,
  .day {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .week span {
    flex: 1;
    color: #8A8A8A;
    font-size: 14px;
  }

  .day span {
    flex: 1;
  }

  .dayitem {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    color: #838385;
    font-size: 14px;
    display: inline-block;
    line-height: 1.5rem;
    text-align: center;
    cursor: pointer;
  }

  .time-bottom span {
    text-align: center;
  }

  .week {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .walk {
    width: 100%;
    height: 11rem;
    margin-bottom: 10px;
    // background: url("../image/cdshwalk.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 0.25rem;
    position: relative;
  }

  .walk-top {
    padding-top: 0.5rem;
    padding-left: 0.4rem;
    padding-right: 0.5rem;
  }

  .walk-top span:nth-of-type(2) {
    margin-right: 0.15rem;
    color: #999;
    font-size: 0.6rem;
  }

  .walk-top img {
    display: inline-block;
  }

  .walk-top img:nth-of-type(1) {
    width: 0.75rem;
    height: 0.75rem;
    vertical-align: middle;
  }

  .walk-top .self {
    display: inline-block;
    width: 2.25rem;
    text-align: center;
    border-radius: 0.25rem;
    line-height: 0.75rem;
    height: 0.75rem;
    // background: url("../image/cdsbradiu.png") no-repeat;
    background-size: 100% 100%;
    font-size: 0.4rem;
    color: #fff;
  }

  .walk-top span:nth-of-type(4) {
    float: right;
    color: #23ACF8;
    font-size: 0.6rem;
  }

  .bodystate {
    position: absolute;
    bottom: 0.5rem;
    width: 100%;
    padding-left: 0.75rem;
    color: #959595;
    font-size: 0.6rem;
  }

  .btcl {
    width: 100%;
    height: 6rem;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    padding-right: 20px;
  }

  .bodystate img {
    width: 0.6rem;
    height: 0.6rem;
    margin-right: 0.25rem;
    display: inline-block;
  }

  .btcl p {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 2.5rem;
    background: #55CB93;
    box-shadow: 0.05rem 0.05rem 0.75rem 0.1rem #9af7cb;
    color: #FFFFFF;
    line-height: 3.5rem;
    text-align: center;
    font-size: 0.75rem;
  }

  .finish {
    background: #8ACBAD;
    color: #fff !important;
  }

  .fontcolor {
    color: #191919;
  }

  .test {
    pointer-events: none;
  }

  .warp {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
