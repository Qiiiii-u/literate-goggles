<template>
  <div>
    <ul class="bg-bubbles">
      <li v-for="i in 10" :key="i"></li>
      <div class="wrap">
        <div class="login-html">
          <el-tabs type="border-card" value="first" :stretch="true" v-show="!showReset">
            <el-tab-pane label="登录" name="first">
              <div class="sign-in-htm">
                <Form :formLabel="formLabelLogin" :form="formLogin" ref="login"></Form>
                <el-checkbox class="icon" v-model="keep">保持登录</el-checkbox>
                <button type="submit" class="button" value="登录" @click="login()">登&emsp;录</button>
                <div class="hr"></div>
                <div class="foot-lnk">
                  <a @click="showReset=true">忘记密码？</a>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="注册" name="second">
              <div class="sign-up-htm">
                <Form :formLabel="formLabelReg" :form="formReg" ref="reg" @selectChange="selectChange"></Form>
                <button type="submit" class="button" value="注册" @click="reg()">注&emsp;册</button>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="resetpw" v-show="showReset">
            <div class="reset_title">重置密码</div>
            <label class="label">邮箱号码</label>
            <el-input v-model="reset_email" placeholder="请输入邮箱"></el-input>
            <button type="submit" class="button" value="发送验证码" @click="sendEmail" v-show="isSend">发送验证码</button>
            <label class="label" v-show="!isSend">验证码</label>
            <el-input v-model="reset_code" placeholder="请输入验证码" v-show="!isSend"></el-input>
            <button type="submit" class="button" value="提交验证" @click="verifyEmail"
              v-show="!isSend && (!isSubmit)">提交验证</button>
            <label class="label" v-show="isSubmit">新密码</label>
            <el-input v-model="reset_password" show-password placeholder="请输入新密码" v-show="isSubmit"></el-input>
            <button type="submit" class="button" value="重置密码" @click="submit" v-show="isSubmit">重置密码</button>
            <div class="hr"></div>
            <div class="foot-lnk">
              <a @click="showReset=false">返回登录</a>
            </div>
          </div>

        </div>
      </div>
    </ul>
  </div>
</template>

<script>
  import Form from '../components/content/form/Form.vue'
  import {
    login,
    resetPassword,
    sendResetEmail
  } from '../network/login.js'
  export default {
    name: 'Login',
    components: {
      Form
    },
    data() {
      return {
        keep: false,
        formLogin: {
          username: '',
          password: ''
        },
        formLabelLogin: [{
            model: 'username',
            label: '用户名',
            type: 'input',
            show: true
          },
          {
            model: 'password',
            label: '密码',
            type: 'input',
            ttype: 'password',
            show: true
          }
        ],
        formReg: {
          username: '',
          password: '',
          repeat: '',
          identity: '',
          address: ''
        },
        formLabelReg: [{
            model: 'username',
            label: '用户名',
            type: 'input',
            show: true
          },
          {
            model: 'password',
            label: '密码',
            type: 'input',
            ttype: 'password',
            show: true
          },
          {
            model: 'repeat',
            label: '重复密码',
            type: 'input',
            ttype: 'password',
            show: true
          },
          {
            model: 'address',
            label: '机构地址',
            type: 'input',
            show: false
          },
          {
            model: 'identity',
            label: '选择用户类型',
            type: 'select',
            show: true,
            opts: [{
                label: '普通用户',
                value: 0
              },
              {
                label: '教练',
                value: 1
              }
            ]
          },

        ],
        reset_email: '',
        reset_code: '',
        reset_password: '',
        email_code: '',
        isSend: true,
        isSubmit: false,
        showReset: false,
      }
    },
    methods: {
      sendEmail() {
        sendResetEmail(this.reset_email).then(res => {
          console.log(res.data)
          if (res.data.error_code == 0) {
            this.$notify.success({
              title: '提示',
              message: '发送邮件成功',
              showClose: false
            })
            this.isSend = false
            this.email_code = res.data.data
          } else {
            this.$notify.error({
              title: '提示',
              message: res.data.msg,
              showClose: false
            })
          }
        })
      },
      verifyEmail() {
        if (this.email_code == this.reset_code) {
          this.isSubmit = true
        } else {
          this.$notify.error({
            title: '提示',
            message: '验证码错误',
            showClose: false
          })
        }
      },
      submit() {
        console.log(this.reset_password)

        if (this.reset_password != '') {
          resetPassword(this.reset_email, this.reset_password).then(res => {
            console.log(res.data)
            if (res.data.error_code == 0) {
              this.$notify.success({
                title: '提示',
                message: '重置密码成功',
                showClose: false
              })
              this.showReset = false
            } else {
              this.$notify.error({
                title: '提示',
                message: res.data.msg,
                showClose: false
              })
            }
          })
        } else {
          this.$notify.error({
            title: '提示',
            message: '请输入重置密码',
            showClose: false
          })
        }
      },
      // 表单用户选择类型 显示不同
      selectChange(selectValue) {
        if (selectValue === 1 || selectValue === '教练') {
          this.formLabelReg.forEach(item => {
            item.show = true
          })
        } else {
          this.formLabelReg.forEach(item => {
            item.show = !(item.model === 'address' || item.model === 'phone')
          })
        }
      },
      login() {
        if (this.$refs.login.form.username === '' || this.$refs.login.form.password === '') {
          this.$notify.error({
            message: '请输入账号或密码!',
            title: '提示',
            showClose: false
          })
          return
        }
        login(this.$refs.login.form.username, this.$refs.login.form.password).then(res => {
          // console.log(res.data)
          if (res.data.error_code !== 0) {
            alert(res.data.msg)
          } else {
            this.$message({
              type: 'success',
              message: '登录成功!'
            })
            this.$store.commit('clearMenu')
            this.$store.commit('setMenu', res.data.data.menu)
            this.$store.commit('addMenu', this.$router)
            this.$refs.login.$children[0].resetFields() //清空表单
            this.$refs.reg.$children[0].resetFields()
            this.$store.dispatch("setUser", res.data.data.user) // 异步存储数据
            // 保持登录 则保存信息至localStorage
            if (this.keep == true) {
              localStorage.setItem("Flag", "isLogin")
              localStorage.setItem("Userinfo", JSON.stringify(res.data.data.user))
            }
            if (this.$store.getters.getCurrentUserList.identity == 'admin') {
              this.$router.push('/Manage') // 跳转到后台管理系统
              // } else if (this.$store.getters.getCurrentUserList.identity == 'coach'){
              //   this.$router.push('/Coach_Class')
            } else {
              // this.$router.push('/Mine')
              this.$router.go(-1) //跳转至上一页面
            }

          }
        })
      },
      reg() {
        console.log(JSON.parse(JSON.stringify(this.$refs.reg.form)))
        if (this.$refs.reg.form.username === '' || this.$refs.reg.form.password === '' || this.$refs.reg.form.repeat ===
          '') {
          this.$notify.error({
            title: '提示',
            showClose: false,
            message: '请输入账号或密码!'
          })
          return
        }
        if (this.$refs.reg.form.identity === '') {
          this.$notify.error({
            title: '提示',
            showClose: false,
            message: '请选择注册的用户身份类型!'
          })
          return
        }
        if (this.$refs.reg.form.address === '' && this.$refs.reg.form.identity == 1) {
          this.$notify.error({
            title: '提示',
            showClose: false,
            message: '请输入机构地址!'
          })
          return
        }
        if (this.$refs.reg.form.password === this.$refs.reg.form.repeat) {
          this.$http.post(
              'http://www.train.com/index.php/index/login/register',
              JSON.parse(JSON.stringify(this.$refs.reg.form)), {
                emulateJSON: true
              }
            )
            .then(res => {
              console.log(res.data)
              if (res.data.error_code !== 0) {
                this.$notify.error({
                  title: '提示',
                  showClose: false,
                  message: res.data.msg
                })
              } else {
                this.$message({
                  type: 'success',
                  message: '注册成功!'
                })
                this.$refs.login.$children[0].resetFields() //清空表单
                this.$refs.reg.$children[0].resetFields()
              }
            })
        } else {
          this.$notify.error({
            title: '提示',
            showClose: false,
            message: '两次密码输入不一致!'
          })
        }
      }
    },
    mounted() {
      document.querySelector('body').setAttribute('style',
        'background: linear-gradient(to bottom right, rgb(75, 171, 177), #6991c7)')
      document.querySelector('#app').setAttribute('style',
        'background: none')
    },
    beforeDestroy() {
      document.querySelector('body').removeAttribute('style')
    },
    // 路由守卫 清空Vuex数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.$store.dispatch("setUser", null)
        vm.$store.dispatch("setUsername", null)
        localStorage.removeItem("Flag")
        localStorage.removeItem("Userinfo")
        vm.$store.commit('clearMenu')
      })
    },
    beforeRouteLeave(to, from, next) {
      // 导航离开该组件的对应路由时调用
      if (this.$store.getters.getCurrentUserList.identity == 'admin' || this.$store.getters.getCurrentUserList.identity == '管理员') {
        next();
      }
      // console.log(to);
      if (this.$store.getters.getCurrentUserList.identity == 'coach' || this.$store.getters.getCurrentUserList.identity == '教练') {
        if (to.path.indexOf('Manage') != -1) {
          next("/");
        }
      }
      if (this.$store.getters.getCurrentUserList.identity == 'normal' || this.$store.getters.getCurrentUserList.identity == '普通用户') {
        let flag = false
        if (to.path.indexOf('Manage') != -1) {
          flag = true
        } else if (to.path.indexOf('Coach') != -1) {
          flag = true
        }
        if (flag == true) {
          next("/");
        }
      }
      next()
    }
  }
</script>

<style lang="scss" scoped>
  li {
    border-radius: 50%;
  }

  .bg-bubbles {
    position: absolute;
    // 使气泡背景充满整个屏幕；
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // 如果元素内容超出给定的宽度和高度，overflow 属性可以确定是否显示滚动条等行为；
    overflow: hidden;

    li {
      position: absolute;
      bottom: -160px; // bottom 的设置是为了营造出气泡从页面底部冒出的效果；
      // 默认的气泡大小；
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.15);
      list-style: none;
      // 使用自定义动画使气泡渐现、上升和翻滚；
      animation: square 15s infinite;
      transition-timing-function: linear;

      // 分别设置每个气泡不同的位置、大小、透明度和速度，以显得有层次感；
      &:nth-child(1) {
        left: 10%;
      }

      &:nth-child(2) {
        left: 20%;
        width: 90px;
        height: 90px;
        animation-delay: 2s;
        animation-duration: 7s;
      }

      &:nth-child(3) {
        left: 25%;
        animation-delay: 4s;
      }

      &:nth-child(4) {
        left: 40%;
        width: 60px;
        height: 60px;
        animation-duration: 8s;
        background-color: rgba(255, 255, 255, 0.3);
      }

      &:nth-child(5) {
        left: 70%;
      }

      &:nth-child(6) {
        left: 80%;
        width: 120px;
        height: 120px;
        animation-delay: 3s;
        background-color: rgba(255, 255, 255, 0.2);
      }

      &:nth-child(7) {
        left: 32%;
        width: 160px;
        height: 160px;
        animation-delay: 2s;
      }

      &:nth-child(8) {
        left: 55%;
        width: 20px;
        height: 20px;
        animation-delay: 4s;
        animation-duration: 15s;
      }

      &:nth-child(9) {
        left: 25%;
        width: 10px;
        height: 10px;
        animation-delay: 2s;
        animation-duration: 12s;
        background-color: rgba(255, 255, 255, 0.3);
      }

      &:nth-child(10) {
        left: 85%;
        width: 160px;
        height: 160px;
        animation-delay: 5s;
      }
    }

    // 自定义 square 动画；
    @keyframes square {
      0% {
        opacity: 0.5;
        transform: translateY(0px) rotate(45deg);
      }

      25% {
        opacity: 0.75;
        transform: translateY(-400px) rotate(90deg)
      }

      50% {
        opacity: 1;
        transform: translateY(-600px) rotate(135deg);
      }

      100% {
        opacity: 0;
        transform: translateY(-1000px) rotate(180deg);
      }
    }
  }

  input,
  .button,
  .select,
  .option {
    outline: none;
    border: none;
  }

  .wrap {
    //background:lightseagreen;
    width: 500px;
    height: 550px;
    margin: 0 auto;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    box-shadow: 0 12px 15px 0 rgba(0, 0, 0, .24), 0 17px 50px 0 rgba(0, 0, 0, .19);
    //opacity: 0.9;
  }

  .hr {
    // 分割线
    height: 2px;
    margin: 35px auto;
    background: #36A2EB;
  }

  .foot-lnk {
    //忘记密码
    text-align: center;

    a {
      text-decoration: none;
      color: gray;
    }

    a:hover {
      color: #36A2EB;
    }
  }

  .login-html {
    height: 100%;
  }

  .button {
    // 按钮
    width: 60%;
    color: #fff;
    display: block;
    margin: 0 auto;
    height: 50px;
    border-radius: 25px;
    background: #36A2EB;
    cursor: pointer;
  }

  ::v-deep .el-input__inner:focus {
    // input聚焦
    border-color: #36A2EB;
  }

  ::v-deep .el-form-item__label {
    // input标签
    color: black;
    font-size: 12px;
    width: 100% ! important;
    text-align: left;
    margin-left: 50px;
    height: 30px;
    margin-bottom: 0;
  }

  ::v-deep .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active,
  // tabs点击效果
  ::v-deep .el-tabs--border-card>.el-tabs__header .el-tabs__item:not(.is-disabled):hover {
    color: #36A2EB;
  }

  ::v-deep .el-form-item__content {
    // 表单内容
    width: 80%;
    margin-left: 50px !important;
  }

  ::v-deep .el-input__inner {
    height: 50px;
    line-height: 50px;
    border-radius: 25px;
  }

  ::v-deep .el-tabs--border-card {
    // tabs
    border: none;
    box-shadow: none;
    height: 100%;
  }

  ::v-deep .sign-in-htm {
    // 登录 表单离tabs的距离
    padding-top: 30px;
  }

  ::v-deep .icon {
    // 复选框位置
    margin-left: 45px;
    margin-bottom: 20px;
  }

  ::v-deep .el-checkbox__input.is-checked+.el-checkbox__label,
  // 复选框颜色
  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    color: #36A2EB;
  }

  ::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
    // 复选框颜色
    background: #36A2EB;
    border-color: #36A2EB;
  }

  .sign-up-htm {

    //注册 布局
    // ::v-deep .el-form-item {
    //   margin-bottom: 15px;
    // }
  }

  ::v-deep .el-select .el-input.is-focus .el-input__inner {
    //select颜色
    border-color: #36A2EB;
  }

  ::v-deep .sign-up-htm .el-form-item {
    margin-bottom: 8px;
  }

  ::v-deep .sign-up-htm .el-input__inner {
    height: 45px;
    line-height: 45px;
  }

  ::v-deep .sign-up-htm .el-select-dropdown__item.selected {
    color: #36A2EB !important;
  }

  .resetpw {
    background-color: white;
    height: 100%;
    padding-top: 30px;

    ::v-deep .el-input {
      margin-bottom: 22px;
      width: 80%;
      margin-left: 50px !important
    }

    .label {
      color: black;
      font-size: 12px;
      width: 100% ! important;
      text-align: left;
      margin-left: 50px;
      height: 30px;
    }

    .reset_title {
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      padding-bottom: 20px;
    }
  }

  a {
    cursor: pointer;
  }
</style>
<style lang="scss">
  .el-select-dropdown__item.selected {
    color: #36A2EB !important;
  }
</style>
