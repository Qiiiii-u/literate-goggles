<template>
  <div style="padding: 30px;">
    <el-card>
      <div class="text item infobox">
        <div class="infoitem clearfix">
          <label class="label">昵称</label>
          <div class="text">
            {{userInfoList.username}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.username)">编辑</el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">性别</label>
          <div class="text">
            {{userInfoList.sex}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.sex)">编辑</el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">身份类型</label>
          <div class="text">
            {{userInfoList.identity}}
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">手机号码</label>
          <div class="text">
            {{userInfoList.phone ? userInfoList.phone : '未设置'}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.phone)">编辑</el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">邮箱号码</label>
          <div class="text">
            {{userInfoList.email ? userInfoList.email : '未设置'}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.email)">编辑</el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix" v-if="userInfoList.identity === 'coach' || userInfoList.identity === '教练'">
          <label class="label">机构地址</label>
          <div class="text">
            {{userInfoList.address}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.address)">编辑</el-link>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- dialog -->
    <el-dialog :title="'修改' + currentSec" :visible.sync="dialogVisible" width="30%" class="dialog">
      <span class="edit_label">{{currentSec}}：</span>
      <!-- 昵称 -->
      <el-input v-model="editUserInfoList.username" v-show="currentSec == '昵称'"></el-input>
      <el-input v-model="editUserInfoList.address" v-show="currentSec == '机构地址'"></el-input>
      <!-- 性别 -->
      <el-radio-group v-model="editUserInfoList.sex" v-show="currentSec == '性别'">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
        <el-radio label="保密"></el-radio>
      </el-radio-group>
      <el-input v-model="editUserInfoList.phone" v-show="currentSec == '手机号码'"></el-input>
      <el-input v-model="editUserInfoList.email" v-show="currentSec == '邮箱号码'"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as re_info from '../../network/manage/manage_info.js'
  export default {
    name: 'Manage_Info',
    data() {
      return {
        // state数据
        is_login: false,
        user: '',
        userInfoList: [],

        // 修改数据
        editUserInfoList: [],
        dialogVisible: false, // 对话框1
        dialog: false,
        currentSec: '',
      }
    },
    methods: {
      confirm() {
        if (this.currentSec == '昵称') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.username = this.editUserInfoList.username
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.userInfoList.username = res.data.data.username
              this.user = res.data.data.username
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.dialogVisible = false
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }

          })
        } else if (this.currentSec == '性别') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.sex = this.editUserInfoList.sex
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.sex = this.editUserInfoList.sex
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else if (this.currentSec == '手机号码') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.phone = this.editUserInfoList.phone
          console.log(formData);
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.phone = this.editUserInfoList.phone
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else if (this.currentSec == '邮箱号码') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.email = this.editUserInfoList.email
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.email = this.editUserInfoList.email
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else if (this.currentSec == '机构地址') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.address = this.editUserInfoList.address
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.address = this.editUserInfoList.address
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        }
      },
      // 取消
      cancel() {
        if (this.currentSec == '昵称') {
          this.editUserInfoList.username = this.userInfoList.username
        } else if (this.currentSec == '性别') {
          this.editUserInfoList.sex = this.userInfoList.sex
        } else if (this.currentSec == '手机号码') {
          this.editUserInfoList.phone = this.userInfoList.phone
        } else if (this.currentSec == '邮箱号码') {
          this.editUserInfoList.email = this.userInfoList.email
        } else if (this.currentSec == '机构地址') {
          this.editUserInfoList.address = this.userInfoList.address
        }
        this.dialogVisible = false
      },
      // 数据处理
      userDataDeal() {
        if (this.userInfoList.sex == 0) {
          this.userInfoList.sex = '男'
        } else if (this.userInfoList.sex == 1) {
          this.userInfoList.sex = '女'
        } else if (this.userInfoList.sex == 2) {
          this.userInfoList.sex = '保密'
        }
        if (this.userInfoList.identity == 'normal') {
          this.userInfoList.identity = '普通用户'
        } else if (this.userInfoList.identity == 'admin') {
          this.userInfoList.identity = '管理员'
        } else if (this.userInfoList.identity == 'coach') {
          this.userInfoList.identity = '教练'
        }
      },
      // 显示第一个对话框
      showDialog(val) {
        if (val == this.userInfoList.username) {
          this.currentSec = '昵称'
        } else if (val == this.userInfoList.sex) {
          this.currentSec = '性别'
        } else if (val == this.userInfoList.phone) {
          this.currentSec = '手机号码'
        } else if (val == this.userInfoList.email) {
          this.currentSec = '邮箱号码'
        } else if (val == this.userInfoList.address) {
          this.currentSec = '机构地址'
        }
        this.dialogVisible = true
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.userDataDeal()

      // 数组不能直接相等
      this.editUserInfoList = JSON.parse(JSON.stringify(this.userInfoList))
    }
  }
</script>

<style lang="scss" scoped>
  .infobox {
    margin: 24px auto 24px 40px;

    .edit {
      display: inline-block;
      float: right;

      ::v-deep .el-link.el-link--default:hover {
        color: #409EFF;
      }
    }

    .infoitem {
      margin-bottom: 12px;

      .label {
        width: 120px;
        line-height: 20px;
        padding: 20px 0;
        text-align: center;
        background-color: #f3f5f7;
        color: #07111b;
        font-weight: 700;
        float: left;
      }

      .text {
        width: 80%;
        margin-left: 8px;
        line-height: 20px;
        padding: 20px 0 20px 22px;
        border-bottom: 1px solid #d9dde1;
        float: left;
      }
    }
  }

  // start dialog
  .dialog {
    .edit_label {
      font-weight: bold;
      margin-left: 10px;
    }

    ::v-deep .el-input {
      width: 70%;
      margin-left: 20px;
    }

    ::v-deep .el-radio-group {
      margin-left: 20px;
    }

    ::v-deep .el-radio {
      margin-bottom: 0;
    }

    .verify {
      .v-left {
        margin-right: 13px;
      }

      ::v-deep .el-input__inner {
        border: none;
        border-bottom: 1px solid slategray;
        border-radius: 0;
      }

      .getCode-button {
        position: absolute;
        top: 145px;
        right: 50px;
        color: #409EFF;
        width: 90px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }

      .verifyPhone-button {
        position: absolute;
        top: 145px;
        right: 50px;
        color: #999;
        width: 90px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 14px;
      }
    }
  }

  .clearfix::after {
    display: block;
    clear: both;
    content: "";
  }

  // end dialog
</style>
