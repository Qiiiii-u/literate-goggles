<template>
  <div style="padding: 10px;background-color: #e8e8e8;">
    <!--  数据统计    -->
    <el-col :span="24">
      <el-card>
        <div slot="header">
          <span class="ca-title">数据统计</span>
        </div>
        <el-row :gutter="20">
          <el-col :xs="8" :sm="8" :md="4" :lg="4" :xl="4" v-for="(item, index) in data" :key="index" style="margin-bottom: 5px;">
            <el-card shadow="hover" :body-style="{ padding: '10px' }" style="background: #F5F5F5">
              <span class="title">{{item.name}}</span>
              <div class="value">{{item.value}}</div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </el-col>

    <el-col :span="24" style="margin-top: 10px">
      <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8" >
         <el-row>
           <el-col>
             <el-card>
               <div slot="header">
                 <span class="ca-title">热门课程</span>
               </div>
               <ul>
                 <li v-for="(item, index) in courseList" :key="index">{{item}}</li>
               </ul>
             </el-card>
           </el-col>
            <el-col style="margin: 10px 0;">
              <el-card>
                <div slot="header">
                  <span class="ca-title">登录信息</span>
                </div>
                <div class="info"><b>IP地址：</b>{{IPdata.ip}}</div>
                <div class="info"><b>登录时间：</b>{{IPdata.time}}</div>
                <div class="info"><b>登录地址：</b>{{IPdata.country}}</div>
                <div class="info"><b>设备信息：</b>{{IPdata.browser}}</div>
              </el-card>
            </el-col>

          </el-row>
        </el-col>
        <!--   统计图   -->
       <el-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
          <el-card>
            <div slot="header">
              <span class="ca-title">用户浏览统计图</span>
            </div>
            <div class="Echarts">
              <div id="charts" style="height: 320px;width: 820px"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </div>
</template>

<script>
  import * as echarts from "echarts"
  import {
    getStatistic,
    getUserIp
  } from '../../network/manage/home.js'
  var myChart
  export default {
    name: "Main_Home",
    data() {
      return {
        data: [],
        IPdata: [],
        courseList: [],
        countData: [],
        countTime: []
      }
    },
    methods: {
      getInfo() {
        getUserIp().then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.IPdata = res.data.data.login
            this.data = res.data.data.data
            this.courseList = res.data.data.courseList
          }
        })
      },
      getData() {
        getStatistic().then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.countTime = res.data.data.time
            this.countData = res.data.data.data
            this.myEcharts()
          }
        })
      },
      myEcharts() {
        if (myChart != null && myChart != "" && myChart != undefined) {
            myChart.dispose();//销毁
        }
        myChart = echarts.init(document.getElementById('charts'))
        var option = {
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['用户浏览量', '用户登录量', '课程购买量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: this.countTime
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
              name: '用户浏览量',
              type: 'line',
              itemStyle: {
                // normal: {
                  color: '#516b91', //改变折线点的颜色
                  lineStyle: {
                    color: '#516b91' //改变折线颜色
                  }
                // }
              },
              data: this.countData.visit
            },
            {
              name: '用户登录量',
              type: 'line',
              itemStyle: {
                // normal: {
                  color: '#edafda', //改变折线点的颜色
                  lineStyle: {
                    color: '#edafda' //改变折线颜色
                  }
                // }
              },
              data: this.countData.login
            },
            {
              name: '课程购买量',
              type: 'line',
              // stack: '总量',
              itemStyle: {
                // normal: {
                  color: '#93b7e3', //改变折线点的颜色
                  lineStyle: {
                    color: '#93b7e3' //改变折线颜色
                  }
                // }
              },
              data: this.countData.buy
            },
          ]
        }
        myChart.setOption(option)
      }
    },
    created() {
      this.getInfo()
      this.getData()
    },
    mounted() {
      this.myEcharts()
    }
  }
</script>

<style lang="scss" scoped>
  .ca-title {
    font-size: 14px;
  }

  .title {
    font-size: 13px;
    color: #aaaaaa;
  }

  .value {
    font-weight: bold;
    font-size: 20px;
    margin-top: 13px;
    color: cornflowerblue;
  }

  .info,
  .list {
    padding-top: 10px;
    font-size: 13px;
  }

  ul {
    list-style: none;
  }

  li {
    position: relative;
    padding-left: 30px;
    height: 36px;
    line-height: 36px;
  }

  li:after {
    content: "";
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFF;
    background: #999999;
    text-align: center;
    position: absolute;
    left: 0;
    top: 8px;
  }

  li:first-child:after {
    content: "1";
    background: #FD8C84;
  }

  li:nth-child(2):after {
    content: "2";
    background: #FFCC99;
  }

  li:nth-child(3):after {
    content: "3";
    background: #7FD75A;
  }

  li:nth-child(4):after {
    content: "4";
    background: #CCCCFF;
  }

  li:nth-child(5):after {
    content: "5";
    background: #60C4FD;
  }

  ::v-deep .el-card{
    height: 100%;
  }
</style>
