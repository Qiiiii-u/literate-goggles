<template>
  <div>
    <div class="logo">
      后台管理系统
    </div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="current.path" v-if="current">{{current.label}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-menu class="header" mode="horizontal" background-color="#242f42" text-color="#fff" active-text-color="#409EFF">
      <el-menu-item index="1">
        <el-popover placement="bottom" width="200" trigger="click">
          <div v-if="message.length != 0">
            <div v-for="item in message" >
              <span class="time">{{item.time}}</span>
              <span class="content">{{item.content}}</span>
            </div>
          </div>
          <div v-else>
            <span class="content">暂无通知</span>
          </div>
          <i class="el-icon-bell" style="color: white" slot="reference" />
        </el-popover>
      </el-menu-item>
      <el-submenu index="2">
        <template slot="title">{{user}}</template>
        <el-menu-item index="3-1" @click="info">个人信息</el-menu-item>
        <el-menu-item index="3-2" @click="toFront" v-show="userInfoList.identity == 'coach'">返回前台</el-menu-item>
        <el-menu-item index="3-3" @click="exit">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  export default {
    name: "Header",
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        message: [{'id': 1, 'time': '2021-4-30', 'content': '测试通知'}],
        // message: ''
      }
    },
    methods: {
      exit() {
        this.$confirm('是否退出账号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            this.$store.dispatch("setUser", null) // 清空登录
            this.$store.dispatch("setUsername", null)
            localStorage.removeItem("Flag")
            localStorage.removeItem("Userinfo")
            this.$store.commit('clearMenu')
            this.$router.push('/Login')
          })

      },
      info() {
        this.$router.push('/Manage/Manage_Info')
      },
      toFront() {
        this.$router.push('/Coach/Mine_Home_Re')
      }
    },
    mounted() {
      // document.addEventListener('click', this.hidden)
    },
    computed: {
      //获取vuex数据的另一种写法
      ...mapState({
        current: state => state.currentMenu
      }),
      // isLogin() {
      //   return this.$store.getters.getIsLogin;
      // },
      // currentUser() {
      //   return this.$store.getters.getCurrentUser;
      // }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    }
  }
</script>

<style lang="scss" scoped>
  .header {
    float: right;
  }

  .logo {
    height: 60px;
    padding-left: 20px;
    line-height: 60px;
    font-weight: bold;
    color: #fff;
    float: left;
  }

  .bread {
    float: left;
    height: 60px;
    line-height: 60px;
    padding-left: 90px;
  }
  .time{
        color: lightcoral;
        font-size: 13px;
        margin-right: 10px;
  }
  .content {
    font-size: 13px;
  }
</style>

<style lang="scss">
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    cursor: pointer;
  }

  .el-menu--horizontal>.el-menu-item.is-active {
    border: none;
  }

  .el-submenu__title:hover {
    background-color: #ecf5ff;
    color: #36A2EB;

    .el-icon-s-custom,
    .el-icon-message-solid,
    .el-icon-s-comment,
    .icon-kechengbiao {
      color: #36A2EB !important;
    }
  }

  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #fff;
      font-weight: normal;
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #36A2EB;
      }
    }
  }

  .el-breadcrumb__item {
    .el-breadcrumb__inner:hover {
      color: #fff;
      font-weight: normal;
    }

    &:last-child {
      .el-breadcrumb__inner:hover {
        color: #87CEFA;
      }
    }
  }
</style>
