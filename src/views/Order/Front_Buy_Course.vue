<template>
  <div style="background-color: #f8fafc;">
    <home-nav-bar></home-nav-bar>
    <div class="order_bg">
      <p class="order_title">确认订单</p>
    </div>
    <div class="container">
      <el-row>
        <el-col>
          <el-card class="box-card" style="margin: -40px 0 30px 0;">
            <div class="order_wrap">

              <div>
                <p class="title">商品信息</p>
                <div class="row" style="background-color: #f3f5f7; margin: 0;">
                  <el-image style="width: 240px;margin: 20px;" :src="'http://www.train.com/' + course_data.img"
                    fit="contain"></el-image>
                  <div class="course_info">
                    <p class="course_name">{{course_data.group_name}}</p>
                    <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                    <p class="intro2">购买成功后立即加入课程/班级</p>
                  </div>
                  <div class="price">{{course_data.newPrice === '免费' ? '￥0.00' : course_data.newPrice}}</div>
                </div>
              </div>

              <el-divider></el-divider>

              <div>
                <p class="title">需支付金额</p>
                <div>
                  <p class="course_price">课程金额：<span
                      class="money">{{course_data.newPrice === '免费' ? '￥0.00' : course_data.newPrice}}</span></p>
                  <p class="preferential">优惠折扣：<span class="money">-￥0.00</span></p>
                  <p class="pay_price">应付金额：<span
                      class="pay">{{course_data.newPrice === '免费' ? '￥0.00' : course_data.newPrice}}</span></p>
                  <a class="pay_button" @click="toPayment()">提交订单</a>
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
    name: 'Front_Buy_Course',
    components: {
      HomeNavBar,
      CopyRight
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        course_data: [],
        orderID: '', //订单号
      }
    },
    methods: {
      toPayment() {
        re_order.userGenerateOrder(this.course_data.group_id, this.user, this.course_data.price).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.orderID = res.data.data.orderID
            this.$router.push({
              name: 'Order_Payment',
              query: {
                course_data: JSON.stringify(this.course_data),
                orderID: this.orderID
              }
            })
          } else {
            this.orderID = ''
            this.$message({
              type: 'error',
              message: '订单生成错误'
            })
          }
        })
      },
    },
    mounted() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    },
    created() {
      if (this.$route.query) {
        this.course_data = JSON.parse(this.$route.query.course_data)
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

    .price {
      margin: auto;
      font-size: 18px;
      color: #f01414;
    }

    .title {
      font-size: 16px;
    }

    .course_price {
      margin-bottom: 10px;
    }

    .preferential {
      margin-bottom: 5px;
    }

    .money {
      text-align: end;
      width: 100px;
      display: inline-block;
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

  // end
</style>
