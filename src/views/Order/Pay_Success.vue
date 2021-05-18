<template>
  <div style="background-color: #f8fafc;">
    <home-nav-bar></home-nav-bar>

    <div class="order_bg">
      <p class="order_title">支付成功</p>
    </div>
    <div class="container">
      <el-row>
        <el-col>

          <el-card class="box-card" style="margin: -40px 0 30px 0;">
            <div>
              <p class="title">商品订单：<span class="order_num">{{orderID}}</span></p>
              <div style="text-align: center;">
                <i class="icon-chenggong1" style="font-size: 120px; color: #2abe3d;" />
                <p style="font-size: 16px; font-weight: bold;">支付成功！</p>
                <p>感谢您购买本课程！该页面将在<span class="second">&nbsp;{{initTime}}&nbsp;</span>秒后关闭！</p>
              </div>
            </div>
          </el-card>

        </el-col>
      </el-row>
    </div>
    <copy-right></copy-right>
  </div>
</template>

<script>
  import HomeNavBar from '../../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../../components/content/CopyRight.vue'
  export default {
    name: 'Pay_Success',
    components: {
      HomeNavBar,
      CopyRight
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: '',
        initTime: 5, //倒计时

        orderID: '',
      }
    },
    methods: {
      leftTime() {
        this.initTime--
        if (this.initTime == 0) {
          this.$router.push('/Mine')
        }
      }
    },
    created() {
      if (this.$route.query) {
        this.orderID = this.$route.query.orderID
      }
      setInterval(this.leftTime, 1000)
    },
    mounted() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    },
  }
</script>

<style lang="scss" scoped>
    @import '../../assets/css/style.css';
  // start orderinfo
  .order_bg {
    height: 160px;
    background-color: #e3e6e9;
    background: url(../../assets/img/cart-header-bg.jpg) repeat-x left bottom;
  }

  .order_title {
    font-size: 32px;
    line-height: 120px;
    color: #07111b;
    font-weight: 200;
    margin: 0;
    padding-left: 14%;
  }


  .order_num {
    font-weight: bold;
  }

  .title {
    font-size: 16px;
  }

  .second {
    color: dodgerblue
  }


  // end
</style>
