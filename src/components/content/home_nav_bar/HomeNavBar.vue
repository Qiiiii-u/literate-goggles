<template>
  <div class="top-navbar">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img class="img" src="../../../assets/img/logo.png" alt="" />
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbars-host"
          aria-controls="navbars-rs-food" aria-expanded="false" aria-label="Toggle navigation">
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbars-host">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item" :class="{'active': this.$route.path === '/'}" @click="home"><a class="nav-link">首页</a></li>
            <li class="nav-item" :class="{'active': this.$route.path === '/Front_Course'}" @click="course"><a class="nav-link">课程</a></li>
            <li class="nav-item" :class="{'active': this.$route.path === '/News'}" @click="news"><a class="nav-link">新闻资讯</a></li>
            <li class="nav-item" :class="{'active': this.$route.path === '/About'}" @click="about"><a class="nav-link">关于我们</a></li>
            <li class="nav-item" :class="{'active': this.$route.path === '/Mine'}" @click="mine"><a class="nav-link">我的训练</a></li>
          </ul>
          <el-dropdown @command="handleCommand" v-if="is_login == true">
            <span class="el-dropdown-link">
              <el-avatar class="head_img" :size="40"
                :src="userInfoList ? href + userInfoList.head_img : href + 'head_img/0.png'"
                :key="userInfoList ? href + userInfoList.head_img : href + 'head_img/0.png'"></el-avatar>
              <span class="userinfo">{{user}}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1">课程中心</el-dropdown-item>
              <el-dropdown-item command="2">通知中心</el-dropdown-item>
              <el-dropdown-item command="3">个人中心</el-dropdown-item>
              <el-dropdown-item command="4" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          
          <ul class="nav navbar-nav navbar-right" v-else>
            <li @click="login"><a class="hover-btn-new log orange"><span>登录</span></a></li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
  import '../../../assets/js/all.js'
  export default {
    name: "HomeNavBar",
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        href: 'http://www.train.com/'
      }
    },
    methods: {
      home() {
        this.$router.push('/')
      },
      login() {
        this.$router.push('/Login')
      },
      about() {
        this.$router.push('/Front_About')
      },
      news() {
        this.$router.push('/Front_News')
      },
      mine() {
        if (this.is_login === true) {
          if (this.userInfoList.identity == 'coach') {
            this.$router.push('/Coach/Mine_Home_Re')
          } else {
            this.$router.push('/Mine')
          }
        } else {
          this.$router.push('/Login')
        }
      },
      handleCommand(command) {
        if (command == '4') {
          this.$router.push('/Login')
        }
        if (this.userInfoList.identity == 'coach') {
          if (command == '1') {
            this.$router.push('/Coach_Course')
          } else if (command == '2') {
            this.$router.push('/Coach/Mine_Message')
          } else if (command == '3') {
            this.$router.push('/Coach/Mine_User')
          }
        } else {
          if (command == '1') {
            this.$router.push('/Mine_Course_Home')
          } else if (command == '2') {
            this.$router.push('/Mine_Message')
          } else if (command == '3') {
            this.$router.push('/Mine_User')
          }
        }

      },
      course() {
        this.$router.push('/Front_Course')
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      // console.log('isLogin: ', this.is_login)
      // console.log('user: ', this.user)
    }
  }
</script>

<style scoped lang="scss">
  @import url("../../../assets/css/bootstrap.min.css");
  @import url("./home_nav_bar.css");
  @import url("../../../assets/css/responsive.css");

  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover,
  ::v-deep .el-dropdown-menu__item:focus {
    color: #eea412;
    background-color: white;
  }
  a{
    cursor: pointer;
  }
</style>
