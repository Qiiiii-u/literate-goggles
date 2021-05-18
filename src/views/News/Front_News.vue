<template>
  <div class="wrap">
    <home-nav-bar></home-nav-bar>

    <div class="all-title-box">
      <div class="container text-center">
        <h1>新闻资讯<span class="m_1">NEWS</span></h1>
      </div>
    </div>

    <div style="padding-bottom: 0;background-color: #ffffff;" class="section">
      <div class="container">
        <el-row>
          <el-col>
            <div>
              <router-view/>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <copy-right></copy-right>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  import HomeNavBar from '../../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../../components/content/CopyRight.vue'
  import BackToTop from '../../components/content/BackToTop.vue'
  export default {
    name: "Front_News",
    components: {
      HomeNavBar,
      CopyRight,
      BackToTop
    },
    data() {
      return {
        childData: [],
        is_login: false,
        user: '',
        userInfoList: [],
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/style.css';

  .all-title-box {
    background: url(../../assets/img/banner.jpg)no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center;
    min-height: 300px;
  }
  
  // title
  
  .all-title-box h1 {
    color: #fff;
    font-weight: 600;
    text-transform: capitalize;
    padding-top: 11%;
    font-size: 48px;
    line-height: 0px;
  }
  
  span.m_1 {
    font-weight: 300;
    font-size: 20px;
    line-height: 1.5em;
    display: block;
  }
  
  // end
</style>
