<template>
  <div>
    <p class="card_title">{{class_data.name}}</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <div class="class_title"><span class="class_label">开课时间：</span><span
            class="class_data">{{class_data.start_time}}</span></div>
        <div class="class_title"><span class="class_label">结课时间：</span><span
            class="class_data">{{class_data.end_time}}</span></div>
        <div class="class_title"><span class="class_label">课时：</span><span
            class="class_data">{{class_data.hour}}课时</span></div>
      </div>
    </el-card>

    <p class="card_title">本周课程表</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div>
        <FullCalendar :options="calendarOptions" />
      </div>
    </el-card>

    <p class="card_title">训练情况与记录</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <p class="card_title" style="font-size: 16px;">出勤情况</p>
        <div>
          <p>请假次数：<a style="color: lightcoral;cursor: pointer;" @click="leaveDialog = true">{{leave_count}}次</a></p>
          <el-dialog title="请假情况" :visible.sync="leaveDialog">
            <div v-if="leaveList.length != 0">
              <div v-for="item in leaveList" style="display: flex;margin: 5px 0;">
                <span style="width: 200px;"><span>请假时间：</span><span>{{item.time}}</span></span>
                <span><span>请假原因：</span><span>{{item.reason}}</span></span>
              </div>
            </div>
            <div v-else class="nulltips">无请假记录</div>
          </el-dialog>
        </div>

        <el-divider></el-divider>

        <p class="card_title" style="font-size: 16px;">训练情况</p>
        <div class="train_situation" v-if="trainLog.length != 0">
          <el-collapse accordion>
            <el-collapse-item v-for="item in trainLog" @click.native="handleChange(item)">
              <template slot="title">
                <span class="time">{{item.time}}</span><span class="title">{{item.title}}</span>
              </template>
              <el-row style="margin: 0;" :gutter="15">
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <p class="train_label"><i class="el-icon-video-camera" style="margin-right: 5px;"></i>训练视频：</p>
                  <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
                    :options="playerOptions"></video-player>
                </el-col>
                <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                  <p class="train_label"><i class="el-icon-edit-outline" style="margin-right: 5px;"></i>教练记录：</p>
                  <div style="font-size: 14px;">{{item.evaluation}}</div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else class="nulltips">暂未上传记录</div>
      </div>
    </el-card>

  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import * as re_class from '../../network/mine/class.js'
  export default {
    name: 'Mine_Class_Detail',
    components: {
      FullCalendar
    },
    data() {
      return {
        // state数据
        user: '',
        is_login: false,
        userInfoList: [],

        class_data: [], // 前页传输数据——班级信息
        leave_count: 0, // 请假次数
        leaveList: [], // 请假列表
        leaveDialog: false,
        trainLog: [], // 训练日志

        // 日程表数据
        calendarOptions: {
          timeZone: 'local',
          locale: "zh-cn",
          plugins: [dayGridPlugin],
          initialView: 'dayGridWeek',
          headerToolbar: {
            left: 'title',
            center: '',
            right: ''
          },
          events: [{}],
          contentHeight: 'auto',
          editable: true,
          displayEventEnd: true,
          eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            meridiem: false,
            hour12: false //设置时间为24小时
          }
        },

        // video配置
        playerOptions: {
          height: 100,
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4", // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: '' // url地址
          }],
          notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        },

      }
    },
    methods: {
      getEventsList() {
        re_class.getTimeTables(this.class_data.id).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.calendarOptions.events = res.data.data.list
            // console.log(this.calendarOptions)
            this.eventDidMount()
            $('#calendar').fullCalendar('calendarOptions');
          } else {
            this.calendarOptions.events = []
          }

        })
      },
      // 点击手风琴
      handleChange(val) {
        if (val.video != '') {
          this.playerOptions.sources[0].src = 'http://www.train.com/' + val.video
        } else {
          this.playerOptions.sources[0].src = ''
        }
      },
      // 获取请假信息
      getLeave() {
        re_class.getLeave(this.class_data.id, this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.leaveList = res.data.data.list
            this.leave_count = res.data.data.count
          } else {
            this.leaveList = []
            this.leave_count = 0
          }
        })
      },
      // 获取训练信息
      getTrainLog() {
        re_class.getTrainLog(this.class_data.id, this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.trainLog = res.data.data.list
          } else {
            this.trainLog = []
          }
        })
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      if (this.$route.query) {
        this.class_data = JSON.parse(this.$route.query.class)
      }
      console.log(this.class_data)
      this.getLeave()
      this.getTrainLog()
      this.getEventsList()
    },
  }
</script>

<style lang="scss" scoped>
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

  ::v-deep .el-table th,
  .el-table td {
    padding: 10px 0;
  }

  ::v-deep .el-table tr {
    font-size: 14px;
  }

  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td,
  ::v-deep .el-table__body tr.current-row>td {
    background-color: rgba(65, 153, 202, 0.55);
    color: white;
  }

  .class_title {
    margin: 2px 0;
    font-size: 14px;

    .class_label {
      font-weight: bold;
    }

    .class_data {
      font-weight: normal;
    }
  }

  //dialog
  ::v-deep .el-dialog__body {
    padding: 20px;
  }

  .nulltips {
    padding: 30px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }

  .train_situation {
    .title {
      margin-left: 30px;
    }

    ::v-deep .el-collapse-item__header {
      font-size: 14px;
      display: flex;
    }

    .train_label {
      font-weight: bold;
      font-size: 14px;
    }
  }

  ::v-deep .el-link.el-link--default {
    float: right;
    color: cornflowerblue;
  }

  // start fullcalendar
  ::v-deep .fc .fc-button-primary {
    background-color: #fff;
    color: lightcoral;
    border-color: lightcoral;

  }

  ::v-deep .fc .fc-button-primary:hover,
  ::v-deep .fc .fc-button-primary:not(:disabled):active,
  ::v-deep .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: lightcoral;
    color: #fff;
    border-color: lightcoral;
    box-shadow: none;
  }

  ::v-deep .fc .fc-toolbar-title {
    font-size: 18px;
    margin: 0;
    font-weight: bold;
    padding: 0;
  }

  ::v-deep .fc .fc-col-header-cell-cushion:hover {
    color: lightcoral;
  }

  ::v-deep .fc-direction-ltr .fc-daygrid-event.fc-event-end,
  ::v-deep .fc-direction-rtl .fc-daygrid-event.fc-event-start {
    // background-color: #fff0f1;
    font-weight: normal;
    white-space: normal;
  }

  ::v-deep .fc-direction-ltr .fc-daygrid-event.fc-event-end:hover,
  ::v-deep .fc-direction-rtl .fc-daygrid-event.fc-event-start:hover {
    color: #fff;
    background-color: #ECAD9E;
  }

  ::v-deep .fc-direction-ltr .fc-daygrid-event.fc-event-end,
  ::v-deep .fc-direction-rtl .fc-daygrid-event.fc-event-start,
  ::v-deep .fc-direction-ltr .fc-list-day-text,
  ::v-deep .fc-direction-rtl .fc-list-day-side-text,
  ::v-deep .fc-direction-ltr .fc-list-day-side-text,
  ::v-deep .fc-direction-rtl .fc-list-day-text {
    color: #fff;
  }

  ::v-deep .fc .fc-daygrid-day.fc-day-today {
    background-color: #ffe8e0;
  }

  ::v-deep .fc-theme-standard .fc-list-day-cushion {
    background-color: #ECAD9E;
    color: #fff;
  }

  ::v-deep .fc-direction-ltr .fc-daygrid-event.fc-event-end {
    background-color: #ECAD9E;
  }

  ::v-deep .fc-daygrid-event-dot,
  ::v-deep .fc .fc-list-event-dot {
    border: 4px solid #8f4b2e;
  }

  ::v-deep .fc .fc-daygrid-event-harness {
    margin-bottom: 5px;
  }

  ::v-deep .fc-daygrid-dot-event {
    display: block;
  }

  ::v-deep .fc-daygrid-dot-event .fc-event-title {
    margin-left: 4px;
    font-size: 14px;
  }

  ::v-deep .fc-direction-ltr .fc-daygrid-event .fc-event-time {
    margin-top: 2px;
    margin-left: 3px;
    font-size: 14px;
  }

  // end fullcalendar
</style>
