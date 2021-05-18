<template>
  <div>
    <p class="card_title">通知中心</p>
    <el-card class="box-card">
      <div v-if="messageList.length != 0">
        <el-collapse accordion>
          <el-collapse-item v-for="item in messageList">
            <template slot="title">
              <div class="mess_data" v-if="item.status == '未读'">
                <span class="mess_type">【{{item.type}}】</span>
                <span class="mess_title">{{item.title}}</span>
                <span class="mess_time">{{item.time}}</span>
              </div>
              <div class="mess_data" v-else>
                <span class="mess_type_read">【{{item.type}}】</span>
                <span class="mess_title">{{item.title}}</span>
                <span class="mess_time">{{item.time}}</span>
              </div>
              <div class="mess_opt">
                <span @click="userRead(item)">
                  <el-link :underline="false" v-if="item.status == '未读'">标为已读</el-link>
                </span>
                <span @click="userDelete(item)">
                  <el-link :underline="false">删除</el-link>
                </span>
              </div>
            </template>
            <div v-html="item.content"></div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-else class="nulltips">
        未收到一则通知
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as re_message from '../../network/mine/message.js'
  export default {
    name: 'Mine_Message',
    data() {
      return {
        // state数据
        user: '',
        userInfoList: '',
        // 后端数据
        messageList: [],
        count: 0,
      }
    },
    methods: {
      // 手风琴
      handleChange(val) {
        console.log(val)
      },
      // 获取通知数据
      getList() {
        re_message.getUserMessageList(this.userInfoList.uid).then(res => {
          if (res.data.error_code == 0) {
            this.messageList = res.data.data.list
            this.count = res.data.data.count
          }
        })
      },
      // 已读
      userRead(val) {
        // console.log(val)
        if (val.mess_id) {
          // console.log('mess_id')
          let formData = {}
          formData.mess_id = val.mess_id
          formData.uid = this.userInfoList.uid
          re_message.userReadMessage(formData).then(res => {
            if (res.data.error_code == 0) {
              this.getList()
            }
          })
        } else if (val.id) {
          // console.log('id')
          let formData = {}
          formData.id = val.id
          formData.uid = this.userInfoList.uid
          re_message.userReadMessage(formData).then(res => {
            if (res.data.error_code == 0) {
              this.getList()
            }
          })
        }

      },
      // 删除
      userDelete(val) {
        re_message.userDeleteMessage(val.id, this.userInfoList.uid).then(res => {
          if (res.data.error_code == 0) {
            this.getList()
          }
        })
      }
    },
    created() {
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-row {
    margin: 15px -15px 10px -15px;
  }

  ::v-deep .el-col {
    padding-right: 15px;
    padding-left: 15px;
  }
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

  .mess_data {
    width: 80%;

    .mess_type {
      color: lightsalmon;
      font-size: 14px;
    }

    .mess_type_read {
      color: #D3D3D3;
      font-size: 14px;
    }

    .mess_time {
      margin-left: 30px;
      color: #ccc;
    }

  }

  .mess_opt {
    width: 15%;
    text-align: end;

    ::v-deep .el-link.el-link--default {
      margin-left: 15px;
    }

    ::v-deep .el-link--inner {
      font-size: 13px;
    }

    ::v-deep .el-link.el-link--default:hover {
      color: red
    }
  }

  ::v-deep .el-collapse-item__content {
    margin-left: 10px;
  }

  .nulltips {
    padding: 30px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
  }
</style>
