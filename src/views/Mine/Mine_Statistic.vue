<template>
  <div>
    <p class="card_title">今日网课统计</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="row" style="margin: 0;">
        <div class="col-2">
          <div class="satis_title">累计学习</div>
          <div class="satis_data">
            <span class="satis_num">{{today.hour}}</span>
            <span class="satis_unit">小时</span>
            <span class="satis_num">{{today.minutes}}</span>
            <span class="satis_unit">分钟</span>
            <span class="satis_num">{{today.seconds}}</span>
            <span class="satis_unit">秒</span></div>
        </div>
        <div class="col-2">
          <div class="satis_title">完成计划</div>
          <div class="satis_data"><span class="satis_num">{{today.plan_count}}</span><span class="satis_unit">项</span></div>
        </div>
      </div>
    </el-card>

    <p class="card_title">学习情况统计图</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="row">
        <div class="Echarts col-6">
          <div id="echartsTime" style="height: 200px;width: 450px;"></div>
        </div>
        <div class="Echarts col-6">
          <div id="echartsPlan" style="height: 200px;width: 450px;"></div>
        </div>
      </div>
    </el-card>

    <p class="card_title">年度学习时长图（单位: 秒）</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="Echarts">
        <div id="echartsDate" style="height: 200px;width: 900px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as echarts from "echarts"
  import * as re_sta from '../../network/mine/statistic.js'
  export default {
    name: 'Mine_Statistic',
    data(){
      return{
        learnData: [],
        learnTime: [],
        planData: [],
        today: [],
        total: [],

        is_login: false,
        user: '',
        userInfoList: [],
        loading: true,
      }
    },
    methods: {
      myEcharts(){
        var myChart1 = echarts.init(document.getElementById('echartsTime'))
        var option = {
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: '15%',
            left: '5%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.learnTime
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '时长（s）'
            }
          ],
          series: [
            {
              name: '学习时长',
              type: 'line',
              itemStyle: {
                // normal: {
                  color: '#516b91', //改变折线点的颜色
                  lineStyle: {
                    color: '#516b91' //改变折线颜色
                  }
                // }
              },
              data: this.learnData
            },
          ]
        }
        myChart1.setOption(option)
      },
      echartsPlan(){
        var myChart = echarts.init(document.getElementById('echartsPlan'))
        var option = {
          tooltip: {
            trigger: 'axis',
          },
          grid: {
            top: '15%',
            left: '5%',
            right: '10%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.learnTime
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '数量（项）'
            }
          ],
          series: [
            {
              name: '完成计划数',
              type: 'line',
              itemStyle: {
                // normal: {
                  color: '#edafda', //改变折线点的颜色
                  lineStyle: {
                    color: '#edafda' //改变折线颜色
                  }
                // }
              },
              data: this.planData
            },
          ]
        }
        myChart.setOption(option)
      },
      echartsDate(){
        var myChart3 = echarts.init(document.getElementById('echartsDate'))
        var option = {
          tooltip: {},
          visualMap: {
              min: 0,
              max: 10000,
              type: 'piecewise',
              orient: 'horizontal',
              left: 'center',
              top: 5
          },
          calendar: {
            top: 60,
            left: 30,
            right: 30,
            bottom: 30,
            cellSize: ['auto', 13],
            range: '2021',
            itemStyle: {
                borderWidth: 0.5
            },
            yearLabel: {show: true},
            dayLabel: {
              nameMap: ['日', '一', '二', '三', '四', '五', '六']
            },
            monthLabel: {
              nameMap: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
          },
          series: {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: this.total
          }
        }
        myChart3.setOption(option)
      },
      getList(){
        re_sta.getTimeStatistic(this.userInfoList.uid).then(res => {
            // console.log(res.data)
            if(res.data.error_code == 0){
              this.learnTime = res.data.data.time
              this.learnData = res.data.data.learn_time
              this.planData = res.data.data.plan_count
              this.today = res.data.data.today
              this.total = res.data.data.total
              console.log(this.total)
              this.getTime()
              this.myEcharts()
              this.echartsPlan()
              this.echartsDate()
            }
          })
      },
      getTime(){
        this.today.hour = parseInt(this.today.learn_time / 3600 % 24)
        this.today.minutes = parseInt(this.today.learn_time % 3600 / 60)
        this.today.seconds = this.today.learn_time % 60
      }
    },
    mounted() {
      setInterval(() => {
        this.loading = false
      }, 500)
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
    },
  }
</script>

<style lang="scss" scoped>

  // start transition
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  // end transition
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }
  // this week statisfy
  .satis_title {
    font-size: 14px;
    color: #757c82;
    font-weight: 700;
    text-align: center;
  }

  .satis_data {
    text-align: center;
  }

  .satis_num {
    color: lightsalmon;
    font-size: 25px;
  }

  .satis_unit {
    font-size: 12px;
    color: #757c82;
  }

  // end
</style>
