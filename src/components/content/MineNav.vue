<template>
  <div class="sidebar" style="margin: 20px;">
    <div class="user">
      <span style="cursor: pointer;" @click="toEditHead()">
        <el-avatar :size="60" :src="'http://www.train.com/' + userInfoList.head_img"
          :key="'http://www.train.com/' + userInfoList.head_img"></el-avatar>
      </span>
      <div style="margin-left: 10px;">
        <span style="font-size: 19px;display: flex;height: 28px;">{{user}}</span>
        <span style="font-size: 10px;">UID：{{showUID}}</span>
      </div>
    </div>
    <div class="bar">
      <div class="options">
        <ul v-if="userInfoList.identity == 'normal' || userInfoList.identity == '普通用户'">
          <li @click="toHome" :class="{'active': this.$route.path === '/Mine' || this.$route.path === '/Mine_Home_Re'}">
            主页</li>
          <li @click="toCourse"
            :class="{'active': this.$route.path === '/Mine_Course' || this.$route.path === '/Mine_Course_Home'}">课程</li>
          <li @click="toClass"
            :class="{'active': this.$route.path === '/Mine_Class' || this.$route.path === '/Mine_Class_Detail'}">班级</li>
          <li @click="toPlan" :class="{'active': this.$route.path === '/Mine_Plan'}">训练计划</li>
          <li @click="toStatistic" :class="{'active': this.$route.path === '/Mine_Statistic'}">统计</li>
          <li @click="toCollect" :class="{'active': this.$route.path === '/Mine_Collect'}">收藏</li>
          <li @click="toOrder" :class="{'active': this.$route.path === '/Mine_Order'}">全部订单</li>
          <li @click="toUser"
            :class="{'active': this.$route.path === '/Mine_User' || this.$route.path === '/Mine_Head_Img'}">个人中心</li>
          <li @click="toMessage" :class="{'active': this.$route.path === '/Mine_Message'}">通知中心</li>
        </ul>
        <ul v-if="userInfoList.identity == 'coach' || userInfoList.identity == '教练'">
          <li @click="toCoachHome"
            :class="{'active': this.$route.path === '/Coach' || this.$route.path === '/Coach/Mine_Home_Re'}">主页</li>
          <li @click="toCoachCourse" :class="{'active': this.$route.path === '/Coach_Course'}">课程</li>
          <li @click="toCoachClass"
            :class="{'active': this.$route.path === '/Coach_Class'|| this.$route.path === '/Coach_Class_Detail'}">班级
          </li>
          <li @click="toCoachStatistic" :class="{'active': this.$route.path === '/Coach_Statistic'}">统计</li>
          <li @click="toCoachUser"
            :class="{'active': this.$route.path === '/Coach/Mine_User' || this.$route.path === '/Coach/Mine_Head_Img'}">
            个人中心</li>
          <li @click="toCoachMessage" :class="{'active': this.$route.path === '/Coach/Mine_Message'}">通知中心</li>
          <li @click="toCoachManage">后台管理系统</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MineNav',
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        showUID: ''
      }
    },
    methods: {
      toHome() {
        this.$router.push('/Mine_Home_Re')
      },
      toCourse() {
        this.$router.push('/Mine_Course_Home')
      },
      toUser() {
        this.$router.push('/Mine_User')
      },
      toOrder() {
        this.$router.push('/Mine_Order')
      },
      toCollect() {
        this.$router.push('/Mine_Collect')
      },
      toClass() {
        this.$router.push('/Mine_Class')
      },
      toPlan() {
        this.$router.push('/Mine_Plan')
      },
      toStatistic() {
        this.$router.push('/Mine_Statistic')
      },
      toEditHead() {
        this.$router.push('/Mine_Head_Img')
      },
      toMessage() {
        this.$router.push('/Mine_Message')
      },
      toCoachHome() {
        this.$router.push('/Coach/Mine_Home_Re')
      },
      toCoachClass() {
        this.$router.push('/Coach_Class')
      },
      toCoachStatistic() {
        this.$router.push('/Coach_Statistic')
      },
      toCoachCourse() {
        this.$router.push('/Coach_Course')
      },
      toCoachUser() {
        this.$router.push('/Coach/Mine_User')
      },
      toCoachMessage() {
        this.$router.push('/Coach/Mine_Message')
      },
      toCoachManage() {
        this.$router.push('/Manage/Home')
      },
      toCoachEditHead() {
        this.$router.push('/Coach/Mine_Head_Img')
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.showUID = (this.userInfoList.uid / Math.pow(10, 6)).toFixed(6).substr(2);
    },
  }
</script>

<style lang="scss" scoped>
  // side bar
  .sidebar {
    width: 200px;
    background: white;
    z-index: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    box-shadow: 2px 0px 2px rgba(128, 128, 128, 0.2);
    transition: all 0.5s;
  }

  .navbar-hide {
    transform: translatex(-18.5rem);
    overflow: hidden;
  }

  .sidebar li {
    color: grey;
    font-size: 14px;
    padding-left: 2rem;
    cursor: pointer;
  }

  .sidebar .options ul {
    margin-top: 1rem;
  }

  .sidebar .options ul .active {
    background: #ef5350;
    color: white;
  }

  .sidebar .options ul li {
    position: relative;
    color: #616161;
    height: 2.8rem;
    background: none;
    transition: all 0.5s;
    display: flex;
    align-items: center;
  }

  .sidebar .options ul li:before {
    content: "";
    position: absolute;
    left: 0;
    width: 0;
    height: 100%;
    z-index: -1;
    transition: all 0.4s ease-out;
  }

  .sidebar .options ul li:hover {
    color: white;
  }

  .sidebar .options ul li:hover:before {
    background: #ef5350;
    color: white;
    width: 100%;
  }


  .sidebar .options ul li {
    margin-bottom: 0.5rem;
  }

  .button__menu {
    padding: 1rem 1rem;
    font-size: 1.2rem;
    color: grey;
    transition: all 0.3s;
    display: none;
  }

  .button__menu-checkbox {
    display: none;
  }

  .button__menu-checkbox:checked~label {
    color: #e0e0e0;
  }

  .button__menu i {
    cursor: pointer;
  }

  // end side bar

  .sidebar .user {
    color: white;
    height: 115px;
    width: 100%;
    background: #ef5350;
    -webkit-clip-path: polygon(50% 100%, 100% 80%, 100% 0, 0 0, 0 80%);
    clip-path: polygon(50% 100%, 100% 80%, 100% 0, 0 0, 0 80%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
