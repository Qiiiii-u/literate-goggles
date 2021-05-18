<template>
  <div style="background-color: #f8fafc;">
    <home-nav-bar></home-nav-bar>
    <div class="order_bg">
      <p class="order_title">支付中心</p>
    </div>
    <div class="container">
      <el-row>
        <el-col>
          <el-card class="box-card" style="margin: -40px 0 30px 0;">
            <div class="order_wrap">

              <div>
                <p class="title">商品订单：<span class="order_num">{{orderID}}</span></p>
                <div class="row" style="background-color: #f3f5f7; margin: 0;">
                  <el-image style="width: 240px;margin: 20px;" :src="'http://www.train.com/' + course_data.img"
                    fit="contain"></el-image>
                  <div class="course_info">
                    <p class="course_name">{{course_data.group_name}}</p>
                    <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                    <p class="intro2">购买成功后立即加入课程/班级</p>
                  </div>
                  <div style="margin: auto;"><span class="price_label">实付金额：</span><span
                      class="price">{{course_data.newPrice === '免费' ? '￥0.00' : course_data.newPrice}}</span></div>
                </div>
              </div>

              <el-divider></el-divider>

              <div>
                <p class="title">支付方式</p>
                <div class="row">
                  <el-image :class="{'img_pay':chooseImg == 1}" @click="handleImg(1)" style="width: 200px;margin: 10px;"
                    :src="require('../../assets/img/Alipay.png')" fit="contain"></el-image>
                  <el-image :class="{'img_pay':chooseImg == 2}" @click="handleImg(2)" style="width: 200px;margin: 10px;"
                    :src="require('../../assets/img/wechat.jpg')" fit="contain"></el-image>
                </div>
                <div>
                  <p class="pay_price">应付金额：<span
                      class="pay">{{course_data.newPrice === '免费' ? '￥0.00' : course_data.newPrice}}</span></p>
                  <a class="pay_button" @click="toPaySuccess()">立即支付</a>
                </div>
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
  import * as re_order from '../../network/front_buy_course.js'
  export default {
    name: 'Order_Payment',
    components: {
      HomeNavBar,
      CopyRight
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        chooseImg: '',
        course_data: [],
        orderID: '', // 订单号
      }
    },
    methods: {
      handleImg(val) {
        this.chooseImg = val
      },
      toPaySuccess() {
        re_order.userOrderSuccess(this.orderID).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.$router.push({
              name: 'Pay_Success',
              query: {
                orderID: this.orderID
              }
            })
          } else {
            this.orderID = ''
            this.$message({
              type: 'error',
              message: '购买错误'
            })
          }
        })
      }
    },
    mounted() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    },
    created() {
      if (this.$route.query) {
        this.course_data = JSON.parse(this.$route.query.course_data)
        console.log(this.course_data);
        this.orderID = this.$route.query.orderID
      }
    }
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

  .order_wrap {
    .order_num {
      font-weight: bold;
    }

    .course_info {
      margin: auto 0;

      .course_name {
        margin: 0;
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 10px;
      }

      .intro1 {
        margin: 0;
        color: #93999f;
        font-size: 12px;
      }

      .intro2 {
        margin: 0;
        color: #93999f;
        font-size: 12px;
      }
    }

    .price_label {
      color: #93999f;
    }

    .price {
      font-size: 18px;
      color: #f01414;
    }

    .title {
      font-size: 16px;
    }

    .pay {
      text-align: end;
      width: 100px;
      display: inline-block;
      color: #f01414;
      font-size: 20px;
    }

    .pay_button {
      display: inline-block;
      margin-top: 10px;
      margin-bottom: 20px;
      float: right;
      font-size: 14px;
      border: none;
      color: #fff;
      width: 140px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background-color: #f20d0d;
      border-color: #f20d0d;
      border-radius: 24px;
      cursor: pointer;
    }

    .pay_button:hover {
      border-color: #c20a0a;
      background: #c20a0a;
    }
  }

  .img_pay ::v-deep .el-image__inner {
    border: 2px solid #f20d0d;
    border-radius: 10px;
  }

  .img_pay:after {
    bottom: 0px;
    right: 0px;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 42px solid #f20d0d;
    border-left: 42px solid transparent;
  }

  .img_pay::before {
    content: '';
    position: absolute;
    width: 14px;
    height: 8px;
    background: transparent;
    bottom: 12px;
    right: 5px;
    border: 2px solid white;
    border-top: none;
    border-right: none;
    transform: rotate(-55deg);
    z-index: 9;
  }

  // end
</style>
