<template>
  <div>
    <p class="card_title">制定计划</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div>
        <FullCalendar :options="calendarOptions" />
      </div>
    </el-card>

    <el-card class="box-card" v-if="showAdd == false">
      <div class="nulltips">
        <div class="show" @click="showAdd = true"><i class="el-icon-edit-outline" style="margin-right: 5px;"></i>制定新的计划
        </div>
      </div>
    </el-card>

    <el-card class="box-card" v-if="showAdd">
      <div>
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="计划名称" prop="name" required>
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="详细内容" prop="content">
            <el-input v-model="form.content"></el-input>
          </el-form-item>
          <el-form-item label="选择课程">
            <el-cascader v-model="form.course" :options="options" :props="{ expandTrigger: 'hover' }"
              :show-all-levels="false"></el-cascader>
          </el-form-item>
          <el-form-item label="执行时间" required>
            <el-col :span="6">
              <el-form-item prop="start_time">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="form.start_time"
                  value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="1" style="text-align: center;">至</el-col>
            <el-col :span="6">
              <el-form-item prop="end_time">
                <el-date-picker type="datetime" placeholder="选择日期" v-model="form.end_time"
                  value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="循环执行" prop="loop" required>
            <el-select v-model="form.loop" placeholder="请选择">
              <el-option label="无" value="no"></el-option>
              <el-option label="每天" value="day"></el-option>
              <el-option label="每周" value="week"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">添加</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script src="@fullcalendar/core/locales/zh-cn.js"></script>
<script>
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import listPlugin from '@fullcalendar/list'
  import tippy from "tippy.js"
  import * as re_plan from '../../network/mine/plan.js'

  export default {
    name: 'Mine_Plan',
    components: {
      FullCalendar
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],

        loading: true,
        showAdd: false,
        // 日程表数据
        calendarOptions: {
          timeZone: 'local',
          locale: "zh-cn",
          plugins: [listPlugin, dayGridPlugin],
          initialView: 'dayGridWeek',
          headerToolbar: {
            left: 'title',
            center: '',
            right: 'dayGridWeek,listWeek'
          },
          events: [{}],
          contentHeight: 'auto',
          editable: true,
          selectable: true,
          eventClick: this.handleEventClick,
          eventMouseEnter: this.handleTooltips,
          displayEventEnd: true,
          eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            meridiem: false,
            hour12: false //设置时间为24小时
          }
        },
        form: {
          name: '',
          content: '',
          course: '',
          start_time: '',
          end_time: '',
          loop: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          loop: [{
            required: true,
            message: '请至少选择一项',
            trigger: 'blur'
          }],
        },
        options: [],
        selected_course: '',

      }
    },
    methods: {
      handleEventClick(info) {
        re_plan.changePlanStatus(parseInt(info.event.id), this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.getEventsList()
          }
        })
      },
      handleTooltips(info) {
        var plan_info = info.event
        plan_info.start_time = this.timestampToTime(plan_info.start)
        plan_info.end_time = this.timestampToTime(plan_info.end)
        plan_info.content = plan_info._def.extendedProps.content ? plan_info._def.extendedProps.content : '无'
        plan_info.course = plan_info._def.extendedProps.course ? plan_info._def.extendedProps.course : '无'
        plan_info.is_finished = plan_info._def.extendedProps.is_finished != 0 ? '已完成' : '未完成'
        let that = this
        tippy(info.el, {
          content: '<div>' + '<div style="font-size: 12px"><b>计划名称：</b>' + info.event.title + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>开始时间：</b>' + plan_info.start_time + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>结束时间：</b>' + plan_info.end_time + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>计划详情：</b>' + plan_info.content + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>涉及课程：</b>' + plan_info.course + '</div>' +
            '<div style="font-size: 12px;margin-bottom: 1px;"><b>计划进度：</b>' + plan_info.is_finished +
            '<a id="del" style="float: right;color: red;cursor:pointer;"">删除</a>' + '</div>' +
            '</div>',
          placement: 'right',
          interactive: true, // 可交互的
          allowHTML: true,
          arrow: false,
          onShown(instance) {
            var obj = document.getElementById('del')
            obj.onclick = function() {
              // console.log(plan_info.id)
              re_plan.deletePlan(plan_info.id).then(res => {
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
      getCourseList() {
        re_plan.getCourseList(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.options = res.data.data.list
          } else {
            this.options = []
          }

        })

      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            console.log(this.form)
            this.options.forEach(item => {
              if (item.value == this.form.course[0]) {
                item.children.forEach(i => {
                  if (i.value == this.form.course[1]) {
                    this.selected_course = i.label
                  }
                })
              }
            })
            let formData = {}
            formData.uid = this.userInfoList.uid
            formData.name = this.form.name
            formData.start_time = this.form.start_time
            formData.end_time = this.form.end_time
            formData.content = this.form.content
            formData.course = this.selected_course
            formData.loop = this.form.loop
            re_plan.addPlan(formData).then(res => {
              // console.log(res.data)
              if (res.data.error_code == 0) {
                this.$notify.success({
                  title: '提示',
                  message: '添加成功',
                  showClose: false
                })
                this.$refs['form'].resetFields()
                this.selected_course = ''
                this.getEventsList()
              } else {
                this.$notify.error({
                  title: '提示',
                  message: '添加失败',
                  showClose: false
                })
              }
            })

          }

        })
      },
      cancel() {
        console.log('cancel')
        this.$refs['form'].resetFields()
        this.selected_course = ''
        this.showAdd = false
      },
      eventDidMount() {
        this.calendarOptions.events.forEach(item => {
          if (item.is_finished == 1) {
            item.borderColor = '#8f4b2e'
          } else {
            item.borderColor = '#ffd400'
          }
        })
      },
      getEventsList() {
        re_plan.getPlanList(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.calendarOptions.events = res.data.data.list
            console.log(this.calendarOptions)
            this.eventDidMount()
            $('#calendar').fullCalendar('calendarOptions');
          } else {
            this.calendarOptions.events = []
          }

        })
      },

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
      this.getCourseList()
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
    margin: 5px 0 3px 5px;
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

  ::v-deep .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 1em;
    margin-top: 1em;
  }

  // end fullcalendar
  // start plan
  .nulltips {
    padding: 10px 0;
    font-size: 16px;
    text-align: center;
    line-height: 24px;
  }

  .show:hover {
    color: lightcoral;
  }

  .show {
    color: #9199a1;
    font-size: 16px;
    cursor: pointer;
  }

  ::v-deep .el-button--primary,
  ::v-deep .el-button--primary:active,
  ::v-deep .el-button--primary:hover {
    background-color: lightcoral !important;
    border-color: lightcoral !important;
    color: #fff !important;
  }

  ::v-deep .el-button:hover,
  ::v-deep .el-button:focus,
  ::v-deep .el-button:active {
    color: lightcoral;
    background-color: rgba(#f08080, 0.1);
    border-color: rgba(#f08080, 0.7);
  }

  ::v-deep .el-cascader-node.in-active-path,
  ::v-deep .el-cascader-node.is-selectable.in-checked-path,
  ::v-deep .el-cascader-node.is-active,
  ::v-deep .el-date-table td.available:hover,
  ::v-deep .el-button--text,
  ::v-deep .el-date-picker__header-label:hover,
  ::v-deep .el-time-panel__btn.confirm,
  ::v-deep .el-select-dropdown__item.selected {
    color: lightcoral !important;
  }

  ::v-deep .el-input__inner:focus,
  ::v-deep .el-cascader .el-input .el-input__inner:focus,
  ::v-deep .el-select .el-input.is-focus .el-input__inner {
    border-color: lightcoral;
  }

  // end form


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
