<template>
  <div>
    <p class="card_title">
      <span @click="flag=true" class="tab">个人信息</span> /
      <span @click="flag=false" class="tab">修改密码</span></p>
    <el-card class="box-card" style="margin-bottom: 10px;" v-if="flag == true">
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
        <div class="infoitem clearfix" v-show="userInfoList.identity == '普通用户'">
          <label class="label">出生日期</label>
          <div class="text">
            {{userInfoList.birth ? userInfoList.birth : '未设置'}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog(userInfoList.birth)">编辑</el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">手机号码</label>
          <div class="text">
            {{userInfoList.phone ? userInfoList.phone : '未设置'}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog2(userInfoList.phone, 'phone')">编辑
              </el-link>
            </div>
          </div>
        </div>
        <div class="infoitem clearfix">
          <label class="label">邮箱号码</label>
          <div class="text">
            {{userInfoList.email ? userInfoList.email : '未设置'}}
            <div class="edit">
              <el-link :underline="false" icon="el-icon-edit" @click="showDialog2(userInfoList.email, 'email')">编辑
              </el-link>
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
    <el-card v-else>
      <div class="text item">
        <el-form ref="formpw" :model="form" label-width="100px">
          <el-form-item label="旧密码" required>
            <el-input placeholder="请输入旧密码" v-model="form.oldpw" show-password></el-input>
          </el-form-item>
          <el-form-item label="新密码" required>
            <el-input placeholder="请输入新密码" v-model="form.newpw" show-password></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确认修改</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card class="box-card" style="margin-bottom: 10px;">

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
      <!-- 出生日期 -->
      <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" v-model="editUserInfoList.birth"
        v-show="currentSec == '出生日期'"></el-date-picker>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="'修改' + currentSec" :visible.sync="dialog" width="30%" class="dialog">
      <div v-show="currentSec == '手机号码'" class="verify">
        <p>
          <span class="edit_label">手机号码：</span>
          <el-input v-model="editUserInfoList.phone" placeholder="请输入手机号码"></el-input>
        </p>
        <p>
          <span class="edit_label v-left">验证码：</span>
          <el-input v-model="code" placeholder="请输入验证码"></el-input>
          <a class="grid-content">
            <div @click="getCode('phone')" v-show="isgetCode" class="getCode-button">点击获取</div>
            <div v-show="!isgetCode" @click="reacquire()" v-bind:class="{ active: isActive }"
              class="verifyPhone-button">
              <span v-show="isActive" style="cursor: pointer;">重新获取</span>
              <span v-show="!isActive">{{count}}s</span>
            </div>
          </a>
        </p>
      </div>
      <div v-show="currentSec == '邮箱号码'" class="verify">
        <p>
          <span class="edit_label">邮箱号码：</span>
          <el-input v-model="editUserInfoList.email" placeholder="请输入邮箱号码"></el-input>
        </p>
        <p>
          <span class="edit_label v-left">验证码：</span>
          <el-input v-model="code" placeholder="请输入验证码"></el-input>
          <a class="grid-content">
            <div @click="getCode('email')" v-show="isgetCode" class="getCode-button">点击获取</div>
            <div v-show="!isgetCode" @click="reacquire()" v-bind:class="{ active: isActive }"
              class="verifyPhone-button">
              <span v-show="isActive" style="cursor: pointer;">重新获取</span>
              <span v-show="!isActive">{{count}}s</span>
            </div>
          </a>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="confirm()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- end dialog -->

  </div>
</template>

<script>
  import * as re_info from '../../network/mine/user_info.js'
  export default {
    name: 'Mine_User',
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
        code: '', // 验证码
        isgetCode: true,
        isActive: false,
        count: 0,
        timer: null,
        email_code: '',

        flag: true,
        form: {
          oldpw: '',
          newpw: ''
        }
      }
    },
    methods: {
      onSubmit(){
        console.log(this.form.oldpw);
        re_info.editPw(this.userInfoList.uid,this.form.oldpw,this.form.newpw).then(res => {
          if(res.data.error_code == 0){
            this.$notify.success({
              title: '提示',
              message: '修改成功',
              showClose: false
            })
            this.form.oldpw = ''
            this.form.newpw = ''
          }else{
            this.$notify.error({
              title: '错误',
              message: res.data.msg
            })
          }
        })
      },
      reset(){
        this.form.oldpw = ''
        this.form.newpw = ''
      },
      // 确认修改
      confirm() {
        if (this.currentSec == '昵称') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.username = this.editUserInfoList.username
          re_info.editInfo(formData).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.userInfoList.username = res.data.data.username
              this.user = res.data.data.username
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.dialogVisible = false
              this.$notify.success({
                title: '提示',
                message: '修改成功',
                showClose: false
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
          console.log(formData);
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.sex = this.editUserInfoList.sex
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功',
                showClose: false
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else if (this.currentSec == '出生日期') {
          re_info.editBirth(this.userInfoList.uid, this.editUserInfoList.birth).then(res => {
            if (res.data.error_code == 0) {
              this.dialogVisible = false
              this.userInfoList.birth = this.editUserInfoList.birth
              this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
              this.$notify.success({
                title: '提示',
                message: '修改成功',
                showClose: false
              })
            } else {
              this.$notify.error({
                title: '错误',
                message: res.data.msg
              })
            }
          })
        } else if (this.currentSec == '邮箱号码') {
          if (this.email_code == this.code) {
            let formData = {}
            formData.uid = this.userInfoList.uid
            formData.email = this.editUserInfoList.email
            re_info.editInfo(formData).then(res => {
              if (res.data.error_code == 0) {
                this.dialog = false
                this.userInfoList.email = this.editUserInfoList.email
                this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
                this.$notify.success({
                  title: '提示',
                  message: '修改成功',
                  showClose: false
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: res.data.msg
                })
              }
            })
          }
        } else if (this.currentSec == '手机号码') {
          let formData = {}
          formData.uid = this.userInfoList.uid
          formData.phone = this.editUserInfoList.phone
          // console.log(formData);
          re_info.editInfo(formData).then(res => {
            if (res.data.error_code == 0) {
              this.dialog = false
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
        } else if (this.currentSec == '出生日期') {
          this.editUserInfoList.birth = this.userInfoList.birth
        } else if (this.currentSec == '手机号码') {
          this.editUserInfoList.phone = this.userInfoList.phone
        } else if (this.currentSec == '邮箱号码') {
          this.editUserInfoList.email = this.userInfoList.email
        } else if (this.currentSec == '机构地址') {
          this.editUserInfoList.address = this.userInfoList.address
        }
        this.dialogVisible = false
        this.dialog = false
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
        } else if (val == this.userInfoList.birth) {
          this.currentSec = '出生日期'
        } else if (val == this.userInfoList.address) {
          this.currentSec = '机构地址'
        }
        this.dialogVisible = true
      },
      // 显示第二个对话框
      showDialog2(val, type) {
        if (type == 'phone') {
          this.editUserInfoList.phone = ''
          this.currentSec = '手机号码'
        } else if (type == 'email') {
          this.editUserInfoList.email = ''
          this.currentSec = '邮箱号码'
        }
        this.dialog = true
      },
      // 60s验证码
      getCode(type) {
        this.isgetCode = false;
        if (!this.timer) {
          this.count = 60;
          this.isActive = false;
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= 60) {
              this.count--;
            } else {
              this.isActive = true;
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 1000);
        }
        if (type == 'email') {
          re_info.sendEmail(this.editUserInfoList.email).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.$notify.success({
                title: '提示',
                message: '发送邮件成功',
                showClose: false
              })
              this.email_code = res.data.data
            } else {
              this.$notify.error({
                title: '提示',
                message: '发送邮件失败',
                showClose: false
              })
            }
          })
        }
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.userDataDeal()

      // 数组不能直接相等
      this.editUserInfoList = JSON.parse(JSON.stringify(this.userInfoList));
      console.log('created userInfoList: ', this.userInfoList)
    },
  }
</script>

<style lang="scss" scoped>
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

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

  // end dialog

  .tab{
    cursor: pointer;
  }
  .tab:hover{
    color: lightcoral;
  }

  ::v-deep .el-button--primary:active,
  ::v-deep .el-button--primary:hover,
  ::v-deep .el-button--primary:focus{
    background: rgba(240, 20, 20, 0.8);
  }

  ::v-deep .el-button--primary{
    background: rgba(240, 20, 20, .6);
    border-color: rgba(240, 20, 20, .6);
  }

  ::v-deep .el-button:active,
  ::v-deep .el-button:hover,
  ::v-deep .el-button:focus{
    color: rgba(240, 20, 20, 0.8);
    border-color: rgba(240, 20, 20, 0.8);
    background-color: rgba(240, 20, 20, .1);
  }

  ::v-deep .el-input__inner:focus{
border-color:rgba(240, 20, 20, 0.6);
  }

  .el-form-item{
    width: 400px;
  }
</style>
