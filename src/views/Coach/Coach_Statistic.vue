<template>
  <div>
    <p class="card_title">网课新增学员统计</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="Echarts">
        <div id="echarts" style="height: 400px;width: 800px;"></div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as echarts from "echarts"
  import * as re_sta from '../../network/mine/statistic.js'
  export default {
    name: 'Coach_Statistic',
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        loading: true,

        countData: [],
        countTime: []
      }
    },
    methods: {
      myEcharts() {
        var myChart = echarts.init(document.getElementById('echarts'))
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
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.countTime
          }],
          yAxis: [{
            type: 'value',
            name: '数量（名）'
          }],
          series: [{
            name: '新增人数',
            type: 'line',
            itemStyle: {
              // normal: {
              color: '#516b91', //改变折线点的颜色
              lineStyle: {
                color: '#516b91' //改变折线颜色
              }
              // }
            },
            data: this.countData
          }, ]
        }
        myChart.setOption(option)
      },
      getList() {
        re_sta.getCountStatistic(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.countTime = res.data.data.time
            this.countData = res.data.data.add_num
            this.myEcharts()
          }
        })
      },
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
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }
</style>
