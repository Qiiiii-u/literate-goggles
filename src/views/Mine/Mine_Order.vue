<template>
  <div>
    <el-tabs value="first" @tab-click="handleClick">
      <el-tab-pane label="全部" name="first">
        <div v-if="orderListAll.length != 0">
          <el-card class="box-card" style="margin-bottom: 10px;" v-for="item in orderListAll">

            <div class="text item order">
              <span class="order_id">订单编号：{{item.id}}</span>
              <span class="order_time">{{item.buy_time}}</span>
              <el-link :underline="false" icon="el-icon-delete" @click="delOrder(item)">删除</el-link>
              <el-divider></el-divider>
              <el-row align="middle" type="flex">
                <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                  <el-row type="flex" align="middle">
                    <el-col :xs="24"  :md="10" :lg="10" :xl="10" style="display: inline-flex;">
                      <el-image style="width: 200px;margin: 20px 20px 20px 0;height: 133px;"
                        :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
                    </el-col>
                    <el-col :xs="0" :md="14" :lg="14" :xl="14" style="display: inline-flex;">
                      <div class="course_info">
                        <p class="course_name">{{item.group_name}}</p>
                        <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                  <div class="price">
                    <p class="old">原价：￥{{item.price}}</p>
                    <p class="pay">实付：<span class="money">￥{{item.pay}}</span></p>
                  </div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" style="text-align: center;">
                  <div v-if="item.status != '未支付' && item.status != '已删除'" class="status">{{item.status}}</div>
                  <div v-else-if="item.status == '未支付'" class="other_status">
                    <span style="display: block;">{{item.status}}</span>
                    <span style="display: inline-block;">
                      <el-link :underline="false" @click="toPay(item)">去支付</el-link>
                      <el-link :underline="false" @click="recycleOrder(item)">取消</el-link>
                    </span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-else>
          <el-card class="box-card">
            <p class="nulltips">暂无此类订单</p>
          </el-card>
        </div>

      </el-tab-pane>
      <el-tab-pane label="未支付" name="second">
        <div v-if="orderListAll.length != 0">
          <el-card class="box-card" style="margin-bottom: 10px;" v-for="item in orderListAll">

            <div class="text item order">
              <span class="order_id">订单编号：{{item.id}}</span>
              <span class="order_time">{{item.buy_time}}</span>
              <el-link :underline="false" icon="el-icon-delete" @click="delOrder(item)">删除</el-link>
              <el-divider></el-divider>
              <el-row align="middle" type="flex">
                <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                  <el-row type="flex" align="middle">
                    <el-col :xs="24"  :md="10" :lg="10" :xl="10" style="display: inline-flex;">
                      <el-image style="width: 200px;margin: 20px 20px 20px 0;height: 133px;"
                        :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
                    </el-col>
                    <el-col :xs="0" :md="14" :lg="14" :xl="14" style="display: inline-flex;">
                      <div class="course_info">
                        <p class="course_name">{{item.group_name}}</p>
                        <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                  <div class="price">
                    <p class="old">原价：￥{{item.price}}</p>
                    <p class="pay">实付：<span class="money">￥{{item.pay}}</span></p>
                  </div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" style="text-align: center;">
                  <div class="other_status">
                    <span style="display: block;">{{item.status}}</span>
                    <span style="display: inline-block;">
                      <el-link :underline="false" @click="toPay(item)" style="padding-left: 10px;">去支付</el-link>
                      <el-link :underline="false" @click="recycleOrder(item)">取消</el-link>
                    </span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-else>
          <el-card class="box-card">
            <p class="nulltips">暂无此类订单</p>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已完成" name="third">
        <div v-if="orderListAll.length != 0">
          <el-card class="box-card" style="margin-bottom: 10px;" v-for="item in orderListAll">

            <div class="text item order">
              <span class="order_id">订单编号：{{item.id}}</span>
              <span class="order_time">{{item.buy_time}}</span>
              <el-link :underline="false" icon="el-icon-delete" @click="delOrder(item)">删除</el-link>
              <el-divider></el-divider>
              <el-row align="middle" type="flex">
                <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                  <el-row type="flex" align="middle">
                    <el-col :xs="24"  :md="10" :lg="10" :xl="10" style="display: inline-flex;">
                      <el-image style="width: 200px;margin: 20px 20px 20px 0;height: 133px;"
                        :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
                    </el-col>
                    <el-col :xs="0" :md="14" :lg="14" :xl="14" style="display: inline-flex;">
                      <div class="course_info">
                        <p class="course_name">{{item.group_name}}</p>
                        <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                  <div class="price">
                    <p class="old">原价：￥{{item.price}}</p>
                    <p class="pay">实付：<span class="money">￥{{item.pay}}</span></p>
                  </div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" style="text-align: center;">
                  <div class="status">{{item.status}}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-else>
          <el-card class="box-card">
            <p class="nulltips">暂无此类订单</p>
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已取消" name="fourth">
        <div v-if="orderListAll.length != 0">
          <el-card class="box-card" style="margin-bottom: 10px;" v-for="item in orderListAll">

            <div class="text item order">
              <span class="order_id">订单编号：{{item.id}}</span>
              <span class="order_time">{{item.buy_time}}</span>
              <el-link :underline="false" icon="el-icon-delete" @click="delOrder(item)">删除</el-link>
              <el-divider></el-divider>
              <el-row align="middle" type="flex">
                <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
                  <el-row type="flex" align="middle">
                    <el-col :xs="24"  :md="10" :lg="10" :xl="10" style="display: inline-flex;">
                      <el-image style="width: 200px;margin: 20px 20px 20px 0;height: 133px;"
                        :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
                    </el-col>
                    <el-col :xs="0" :md="14" :lg="14" :xl="14" style="display: inline-flex;">
                      <div class="course_info">
                        <p class="course_name">{{item.group_name}}</p>
                        <p class="intro1">视频不限期，老师专属答疑，多种形式教学服务</p>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4">
                  <div class="price">
                    <p class="old">原价：￥{{item.price}}</p>
                    <p class="pay">实付：<span class="money">￥{{item.pay}}</span></p>
                  </div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" style="text-align: center;">
                  <el-divider direction="vertical"></el-divider>
                </el-col>
                <el-col :xs="12" :sm="12" :md="4" :lg="4" :xl="4" style="text-align: center;">
                  <div class="status">{{item.status}}</div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
        <div v-else>
          <el-card class="box-card">
            <p class="nulltips">暂无此类订单</p>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as re_order from '../../network/mine/order.js'
  export default {
    name: 'Mine_Order',
    data() {
      return {
        status: 4,
        orderListAll: [],
        userInfoList: [],
        loading: true
      }
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.status = 4
        } else if (tab.name === 'second') {
          this.status = 0
        } else if (tab.name === 'third') {
          this.status = 1
        } else if (tab.name === 'fourth') {
          this.status = 2
        } else if (tab.name === 'fifth') {
          this.status = 3
        }
        this.getOrderList()
      },
      getOrderList() {
        re_order.getUserAllOrder(this.status, this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.orderListAll = res.data.data.list
            this.dataDeal()
          } else {
            this.orderListAll = []
          }

        })
      },
      delOrder(val) {
        var id = val.id
        this.$confirm('是否删除本条订单？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_order.delOrder(id).then(res => {
              // console.log(res.data)
              if (res.data.error_code == 0) {
                this.$notify.success({
                  title: '提示',
                  message: '删除成功',
                  showClose: false
                })
                this.getOrderList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '删除错误',
                  showClose: false
                })
              }

            })
          })
      },
      dataDeal2(val){
          if(val.pay){
            if (val.pay === 0) {
              val.newPrice = '免费'
            } else {
              val.pay = Math.round(val.pay * 100) / 100;
              var s = val.pay.toString().split(".");
              if (s.length == 1) {
                val.pay = val.pay.toString() + ".00";
              } else if (s.length > 1) {
                if (s[1].length < 2) {
                  val.pay = val.pay.toString() + "0";
                }
              }
              val.newPrice = '¥' + val.pay
            }
          }
      },
      toPay(val) {
        let data = val
        this.dataDeal2(data)
        this.$router.push({
          name: 'Order_Payment',
          query: {
            course_data: JSON.stringify(data),
            orderID: val.id
          }
        })
      },
      dataDeal() {
        this.orderListAll.forEach(item => {
          if (item.price === 0) {
            item.newPrice = '免费'
          } else {
            item.newPrice = '¥' + item.price
          }
        })
      },
      recycleOrder(val) {
        var id = val.id
        // this.$confirm('是否恢复本条订单？', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   })
          // .then(() => {
            re_order.recycleOrder(id).then(res => {
              // console.log(res.data)
              if (res.data.error_code == 0) {
                this.$notify.success({
                  title: '提示',
                  message: '取消订单',
                  showClose: false
                })
                this.getOrderList()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '取消错误',
                  showClose: false
                })
              }

            })
          // })
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getOrderList()
    },
  }
</script>

<style lang="scss" scoped>
  // start transition
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  // end transition
  .order {
    .order_id {
      font-size: 12px;
      font-weight: 700;
      color: #4d555d;
    }

    .order_time {
      font-size: 12px;
      color: #93999f;
      font-weight: 500;
      margin-left: 50px;
    }

    ::v-deep .el-divider--horizontal {
      margin: 8px 0;
      height: 0.5px;
    }

    ::v-deep .el-link.el-link--default {
      float: right;
    }

    ::v-deep .el-link--inner {
      font-size: 12px;
    }

    ::v-deep .el-link.el-link--default:hover {
      color: lightcoral;
    }

    .course_info {
      margin: auto 0;
      display: inline-block;

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
      // margin: auto;
      padding-left: 30px;

      .old {
        margin-bottom: 0;
        font-size: 12px;
        color: #93999f;
      }

      .pay {
        margin-bottom: 0;
        font-size: 12px;
        color: #93999f;

        .money {
          color: #f01414;
          font-size: 16px;
        }
      }
    }

    ::v-deep .el-divider--vertical {
      // margin: auto 70px;
      width: 0.5px;
      height: 120px;
      text-align: center;
    }

    .status {
      margin: auto 0;
      color: #93999f;
      display: inline-block;
    }

    .other_status {
      text-align: center;
      margin: auto 0;
      color: #93999f;

      .status_label {
        display: block;
        color: #93999f;
      }

      .status_opt {
        display: inline-block;
      }

      ::v-deep .el-link--inner {
        color: rgba(240, 20, 20, .6);
        font-weight: 600;
      }
    }

  }

  ::v-deep .el-card__body {
    padding-bottom: 0;
  }

  // data is null tips
  .nulltips {
    padding: 100px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }

  // end tips

  //tabs
  ::v-deep .el-tabs__active-bar {
    background-color: rgba(240, 20, 20, .6);
  }

  ::v-deep .el-tabs__item.is-active,
  ::v-deep .el-tabs__item:hover {
    color: lightcoral;
  }

  // end tabs
</style>
