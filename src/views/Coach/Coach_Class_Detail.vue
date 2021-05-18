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

    <!-- dialog -->
    <el-dialog title="添加课程表" :visible.sync="addCourse" @close="cancel">
      <el-form ref="courseForm" :model="courseForm">
        <el-form-item label="课程内容" label-width="120px">
          <el-input v-model="courseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" label-width="120px">
          <el-time-select placeholder="开始时间" v-model="courseForm.start_time" value-format="HH:mm:ss" :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '21:30'
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="结束时间" label-width="120px">
          <el-time-select placeholder="结束时间" v-model="courseForm.end_time" value-format="HH:mm:ss" :picker-options="{
              start: '08:00',
              step: '00:15',
              end: '21:30',
              minTime: courseForm.start_time
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item label="每周周几" label-width="120px">
          <el-select v-model="courseForm.week" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCourse = false">取 消</el-button>
        <el-button type="primary" @click="addCourseList()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end dialog -->

    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <el-table
          :data="studentList.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()))"
          style="width: 100%" height="250" highlight-current-row @current-change="handleCurrentChange">
          <el-table-column label="ID" prop="uid">
          </el-table-column>
          <el-table-column label="用户名" prop="username">
          </el-table-column>
          <el-table-column label="性别" prop="sex">
          </el-table-column>
          <el-table-column label="手机号" prop="phone">
          </el-table-column>
          <el-table-column label="邮箱" prop="email">
          </el-table-column>
          <el-table-column align="right">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" size="mini" placeholder="输入用户名搜索" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <p class="card_title">训练情况与记录</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <div v-if="student">
          <p class="card_title" style="font-size: 16px;">出勤情况<el-link :underline="false" @click="addLeave = true">添加
            </el-link>
          </p>
          <div>
            <p>请假次数：<a style="color: lightcoral;" @click="leaveDialog = true">{{leave_count}}次</a></p>
            <el-dialog title="请假情况" :visible.sync="leaveDialog">
              <div v-if="leaveList.length != 0">
                <div v-for="item in leaveList" style="display: flex;margin: 5px 0;">
                  <span style="width: 200px;"><span>请假时间：</span><span>{{item.time}}</span></span>
                  <span><span>请假原因：</span><span>{{item.reason}}</span></span>
                </div>
              </div>
              <div v-else class="nulltips">无请假记录</div>
            </el-dialog>
            <!-- 添加请假dialog -->
            <el-dialog title="添加请假记录" :visible.sync="addLeave">
              <el-form :model="leaveForm">
                <el-form-item label="请假时间" label-width="120px">
                  <el-date-picker v-model="leaveForm.time" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="请假原因" label-width="120px">
                  <el-input v-model="leaveForm.reason" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="addLeave = false">取 消</el-button>
                <el-button type="primary" @click="addLeaveLog()">确 定</el-button>
              </div>
            </el-dialog>
            <!-- end dialog -->
          </div>

          <el-divider></el-divider>

          <p class="card_title" style="font-size: 16px;">训练情况<el-link :underline="false" @click="addLog = true">添加
            </el-link>
          </p>
          <!-- 添加记录dialog -->
          <el-dialog title="添加记录" :visible.sync="addLog">
            <el-form :model="form">
              <el-form-item label="项目名称" label-width="120px">
                <el-input v-model="form.title" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="教练记录" label-width="120px">
                <el-input v-model="form.evaluation" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="训练视频" label-width="120px">
                <el-upload v-model="form.video" :action="form.video" :headers="{'Content-Type':'multipart/form-data'}"
                  :http-request="uploadVideo" :show-file-list="false">
                  <el-button style="position:absolute;top: 0" size="small">点击上传</el-button>
                  <video id="video" style="margin-top: 50px;height: 200px" v-if="form.video" :src="form.video"
                    controls="controls">您的浏览器不支持视频播放</video>
                </el-upload>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="addLog = false">取 消</el-button>
              <el-button type="primary" @click="addTrainLog()">确 定</el-button>
            </div>
          </el-dialog>
          <!-- end dialog -->
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
        <div v-else class="nulltips">
          选择一名学生，查看记录训练情况
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import tippy from "tippy.js"
  import * as re_class from '../../network/coach/class.js'

  export default {
    name: 'Coach_Class_Detail',
    components: {
      FullCalendar
    },
    data() {
      let self = this
      return {
        // state数据
        user: '',
        is_login: false,
        userInfoList: [],

        class_data: [], // 前页传输数据——班级信息
        studentList: [], // 学生列表
        leave_count: 0, // 请假次数
        leaveList: [], // 请假列表
        leaveDialog: false,
        addLeave: false,
        addLog: false,
        addCourse: false,
        trainLog: [], // 训练日志
        student: null, // 表格选中行
        form: {
          evaluation: '',
          title: '',
          video: ''
        },
        leaveForm: {
          time: '',
          reason: ''
        },
        courseForm: {
          name: '',
          start_time: '',
          end_time: '',
          week: ''
        },
        options: [{
            label: '周日',
            value: 0
          },
          {
            label: '周一',
            value: 1
          },
          {
            label: '周二',
            value: 2
          },
          {
            label: '周三',
            value: 3
          },
          {
            label: '周四',
            value: 4
          },
          {
            label: '周五',
            value: 5
          },
          {
            label: '周六',
            value: 6
          }
        ],

        search: '',

        // 日程表数据
        calendarOptions: {
          timeZone: 'local',
          locale: "zh-cn",
          plugins: [dayGridPlugin],
          initialView: 'dayGridWeek',
          headerToolbar: {
            left: 'title',
            center: '',
            right: 'setting'
          },
          events: [{}],
          contentHeight: 'auto',
          editable: true,
          selectable: true,
          eventMouseEnter: this.handleTooltips,
          displayEventEnd: true,
          eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            meridiem: false,
            hour12: false //设置时间为24小时
          },
          customButtons: {
            // 自定义一个设置图标按键
            setting: {
              theme: "true",
              text: "添加",
              click: function() {
                self.addCourse = true
              },
            },
          },
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
      // 添加课程表
      addCourseList() {
        console.log(this.courseForm)
        let formData = {}
        formData.class_id = this.class_data.id
        formData.name = this.courseForm.name
        formData.start_time = this.courseForm.start_time
        formData.end_time = this.courseForm.end_time
        formData.week = this.courseForm.week
        re_class.addTimeTables(formData).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.$notify.success({
              title: '提示',
              message: '添加成功',
              showClose: false
            })
            this.$refs['courseForm'].resetFields()
            this.addCourse = false
            this.getEventsList()
          } else {
            this.$notify.error({
              title: '提示',
              message: '添加错误',
              showClose: false
            })
          }

        })
      },
      cancel() {
        console.log('cancel')
        this.$refs['courseForm'].resetFields()
        this.addCourse = false
      },
      // 自定义按钮
      eventDidMount() {
        if (!this.$refs.myCalendar.$el.querySelector(".header-setting-btn")) {
          let parentsDivs = this.$refs.myCalendar.$el.querySelectorAll(
            ".fc-toolbar-chunk"
          );
          let parentsDiv = parentsDivs[parentsDivs.length - 1]
          let settingBtnDiv = this.$refs.myCalendar.$el.querySelector(
            ".fc-setting-button"
          );
          let settingEle = document.createElement("DIV");
          settingEle.innerHTML = '<div class="header-setting-btn"></div>';
          // console.log(settingEle);
          parentsDiv.insertBefore(settingEle, settingBtnDiv);
          settingBtnDiv.style.display = 'none';
        }
      },
      handleTooltips(info) {
        var plan_info = info.event
        plan_info.start_time = this.timestampToTime(plan_info.start)
        plan_info.end_time = this.timestampToTime(plan_info.end)
        let that = this
        tippy(info.el, {
          content: '<div>' + '<div style="font-size: 12px"><b>课程内容：</b>' + info.event.title + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>开始时间：</b>' + plan_info.start_time + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>结束时间：</b>' + plan_info.end_time +
            '<a id="del" style="float: right;color: red;"">删除</a>' + '</div>' +
            '</div>',
          placement: 'right',
          interactive: true, // 可交互的
          allowHTML: true,
          arrow: false,
          onShown(instance) {
            var obj = document.getElementById('del')
            obj.onclick = function() {
              console.log(plan_info.id)
              re_class.delTimeTables(plan_info.id).then(res => {
                // console.log(res.data)
                if (res.data.error_code == 0) {
                  that.$notify.success({
                    title: '提示',
                    message: '删除成功',
                    showClose: false
                  })
                  that.getEventsList()
                } else {
                  that.$notify.error({
                    title: '提示',
                    message: '删除失败',
                    showClose: false
                  })
                }

              })
            }
          }
        })

      },
      timestampToTime(timestamp) {
        var date = timestamp;
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return h + m + s;
      },
      // 获取事件列表
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
      // 获取学生列表数据
      getList() {
        re_class.getStudents(this.class_data.id).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.studentList = res.data.data.list
            this.studentList.forEach(item => {
              if (item.email == null) {
                item.email = '无'
              }
              if (item.phone == null) {
                item.phone = '无'
              }
              if (item.sex == 0) {
                item.sex = '男'
              } else if (item.sex == 1) {
                item.sex = '女'
              } else {
                item.sex = '未知'
              }
            })
          }
        })
      },
      // 获取请假信息
      getLeave(val) {
        re_class.getLeave(this.class_data.id, val.uid).then(res => {
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
      getTrainLog(val) {
        re_class.getTrainLog(this.class_data.id, val.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.trainLog = res.data.data.list
          } else {
            this.trainLog = []
          }
        })
      },
      // 上传视频
      uploadVideo(item) {
        let file = item.file
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }
        let formData = new FormData()
        formData.append('file', file)
        formData.append('id', this.videoForm.id)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post("http://www.train.com/index.php/index/coachCourse/uploadVideo", formData, config).then(res => {
          console.log(res.data)
          this.form.video = 'http://www.train.com/' + res.data.data
        })
      },
      // 新增记录
      addTrainLog() {
        let formData = {}
        formData.class_id = this.class_data.id
        formData.uid = this.student.uid
        formData.title = this.form.title
        formData.video = this.form.video
        formData.evaluation = this.form.evaluation
        re_class.addTrainLog(formData).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.addLog = false
            this.$notify.success({
              title: '提示',
              message: '添加成功',
              showClose: false
            })
            this.getTrainLog(this.student)
          } else {
            this.$notify.error({
              title: '提示',
              message: '添加失败',
              showClose: false
            })
          }
        })
      },
      // 新增请假记录
      addLeaveLog() {
        let formData = {}
        formData.class_id = this.class_data.id
        formData.uid = this.student.uid
        formData.time = this.leaveForm.time
        formData.reason = this.leaveForm.reason
        re_class.addLeave(formData).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.addLeave = false
            this.$notify.success({
              title: '提示',
              message: '添加成功',
              showClose: false
            })
            this.getLeave(this.student)
          } else {
            this.$notify.error({
              title: '提示',
              message: '添加失败',
              showClose: false
            })
          }
        })
      },
      // 点击表格选择学生
      handleCurrentChange(val) {
        this.student = val
        this.getLeave(this.student)
        this.getTrainLog(this.student)
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      if (this.$route.query) {
        this.class_data = JSON.parse(this.$route.query.class)
      }
      console.log(this.class_data)
      this.getList()
      this.getEventsList()
    },
  }
</script>

<style lang="scss" scoped>
  @import '~tippy.js/dist/tippy.css';

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
    margin-bottom: 10px;
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
    margin-bottom: 2px;
  }

  ::v-deep .fc .fc-button:focus,
  ::v-deep .fc .fc-button-primary:focus {
    box-shadow: none;
  }

  ::v-deep .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 1em;
    margin-top: 1em;
  }

  // end fullcalendar

  // tooltip
  ::v-deep .tippy-box {
    background-color: #fff;
    color: #000;
    width: 200px;
  }

  ::v-deep .tippy-arrow {
    color: brown;
  }

  ::v-deep .tippy-content {
    border: 1px solid brown;
    border-radius: 4px;
  }

  // end tooltip
</style>
