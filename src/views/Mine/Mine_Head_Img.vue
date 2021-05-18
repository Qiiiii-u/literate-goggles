<template>
  <div>
    <p class="card_title">修改头像</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <p style="margin: 0 0 30px 20px;">选择本地图片，上传编辑自己的头像</p>

        <el-upload action="http://www.train.com/index.php/index/Userinfo/saveTempHeadImg" :show-file-list="false"
          :headers="{'Content-Type':'multipart/form-data'}" :http-request="uploadImg" class="avatar-uploader">
          <el-avatar v-if="head_img" shape="square" :size="178" :src="head_img" :key="head_img" fit="cover"></el-avatar>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="tips">支持jpg、jpeg、png格式的图片</span>
        <span style="display: flex;"><a class="learn_button" @click="save">确认修改</a></span>
      </div>
    </el-card>

  </div>
</template>

<script>
  import * as re_info from '../../network/mine/user_info.js'
	import axios from 'axios'
  export default {
    name: 'Mine_Head_Img',
    data() {
      return {
        // state数据
        is_login: false,
        user: '',
        userInfoList: [],

        // 修改数据
        dialogVisible: false, // 对话框
        head_img: ''
      }
    },
    methods: {
      uploadImg(val) {
        let file = val.file
        if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的图片格式')
          return false
        }
        let formData = new FormData()
        formData.append('file', file)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post("http://www.train.com/index.php/index/Userinfo/saveTempHeadImg", formData, config).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.head_img = 'http://www.train.com/' + res.data.data
          }
        })
      },
      save() {
        re_info.editHeadImg(this.head_img, this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.head_img = 'http://www.train.com/' + res.data.data
            this.userInfoList.head_img = res.data.data
            this.$store.dispatch("setUser", this.userInfoList) // 异步存储数据
            this.$notify.success({
              title: '提示',
              message: '修改头像成功',
              showClose: false
            })
          }
        })

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
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

  ::v-deep .avatar-uploader {
    display: inline-block;
    margin-left: 20px;
  }

  ::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    height: 178px;
  }

  ::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  ::v-deep .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .tips {
    color: #ccc;
    font-size: 13px;
    margin-left: 10px;
  }

  .learn_button {
    display: inline-block;
    margin-left: 20px;
    margin-top: 20px;
    font-size: 14px;
    border: none;
    color: #fff;
    width: 104px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: rgba(240, 20, 20, .6);
    border-radius: 4px;
  }

  .learn_button:hover {
    background-color: rgba(240, 20, 20, 0.8);
  }
</style>
