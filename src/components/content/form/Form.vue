<template>
  <el-form :inline="inline" :model="form" ref="form" label-width="100px" :rules="rules">
    <el-form-item v-for="item in formLabel" :key="item.model" :label="item.label" :prop="item.model" v-show="item.show">
      <el-input v-model="form[item.model]" :placeholder="'请输入' + item.label" v-if="item.type==='input'"
        :type="item.ttype" autosize :disabled="item.disabled">
      </el-input>
      <el-select v-model="form[item.model]" placeholder="请选择" v-if="item.type === 'select'"
        @change="selectChange($event, item)">
        <el-option v-for="item in item.opts" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <!-- 富文本编辑器-->
      <quill-editor v-model="form[item.model]" class="editor" v-if="item.type === 'content'" :options="editorOption" />
      <!-- end -->

      <el-switch v-model="form[item.model]" v-if="item.type === 'switch'"></el-switch>
      <el-date-picker v-model="form[item.model]" type="date" placeholder="选择日期" v-if="item.type === 'date'"
        value-format="yyyy-MM-dd"></el-date-picker>
      <el-input-number v-model="form[item.model]" :step="1" v-if="item.type === 'number'" :min="0" :precision="2"
        :disabled="item.disabled"></el-input-number>

      <!-- 视频上传 -->
      <el-upload v-if="item.type === 'uploadVideo'" v-model="form[item.model]" :action="item.url"
        :headers="{'Content-Type':'multipart/form-data'}" :http-request="uploadVideo" :show-file-list="false">
        <el-button style="position:absolute;top: 0" size="small">点击上传</el-button>
        <video id="video" style="margin-top: 50px;height: 200px" v-if="videoForm.path" :src="videoForm.path"
          controls="controls" :key="videoForm.path">您的浏览器不支持视频播放</video>
      </el-upload>
      <!-- end -->

      <!-- 图片上传 -->
      <el-upload v-if="item.type === 'uploadImg'" v-model="form[item.model]" :action="item.url" :show-file-list="false"
        :headers="{'Content-Type':'multipart/form-data'}" :http-request="uploadImg" class="avatar-uploader">
        <!-- <img v-if="imgForm.url" :src="imgForm.url" class="avatar" /> -->
        <el-image v-if="imgForm.url" class="avatar" :src="imgForm.url" fit="cover" :key="imgForm.url"></el-image>
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <!-- end -->

      <el-checkbox-group v-if="item.type === 'checkbox'" v-model="form[item.model]" @change="handleCheckBoxChange">
        <el-checkbox v-for="i in checkbox_list" :key="i" :label="i">{{i}}</el-checkbox>
      </el-checkbox-group>

    </el-form-item>
    <!--留一个插槽-->
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
  import {
    quillEditor
  } from 'vue-quill-editor'
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import axios from 'axios'
  export default {
    name: "Form",
    components: {
      quillEditor
    },
    data() {
      return {
        id: 0,
        editorOption: { //配置工具栏
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
              ['blockquote', 'code-block'], //引用，代码块
              [{
                'header': 1
              }, {
                'header': 2
              }], // 几级标题
              [{
                'list': 'ordered'
              }, {
                'list': 'bullet'
              }], // 有序列表，无序列表
              [{
                'script': 'sub'
              }, {
                'script': 'super'
              }], // 下角标，上角标
              [{
                'indent': '-1'
              }, {
                'indent': '+1'
              }], // 缩进
              [{
                'direction': 'rtl'
              }], // 文字输入方向
              [{
                'size': ['12px', '14px', false, '18px', '22px', '26px', '30px', '36px']
              }], // 字体大小
              [{
                'header': [1, 2, 3, 4, 5, 6, false]
              }], // 标题
              [{
                'color': []
              }, {
                'background': []
              }], // 颜色选择
              [{
                'font': ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong']
              }], // 字体
              [{
                'align': []
              }], // 居中
              ['clean'], // 清除样式
              ["link", "image"]
            ]
          },
        }
      }
    },
    props: {
      inline: Boolean,
      form: Object,
      formLabel: Array,
      rules: Object,
      videoForm: Object,
      imgForm: Object,
      checkbox_list: Array
    },
    methods: {
      selectChange(selectValue, item) {
        console.log(selectValue)
        // if (item.model === 'identity') {
        this.$emit('selectChange', selectValue)
        // }
      },
      uploadVideo(item) {
        let file = item.file
        // console.log(this.$refs.form)
        // console.log(file)
        // console.log(item)
        if (['video/mp4', 'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的视频格式')
          return false
        }

        let formData = new FormData()
        formData.append('file', file)
        formData.append('id', this.videoForm.id)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post("http://www.train.com/index.php/index/course/uploadVideo", formData, config)
          .then(res => {
            console.log(res.data)
            this.videoForm.videoFlag = false
            this.videoForm.path = 'http://www.train.com/' + res.data.data
          })
      },
      uploadImg(item) {
        let file = item.file
        // console.log(this.$refs.form)
        // console.log(file)
        // console.log(item)
        if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) === -1) {
          this.$message.error('请上传正确的图片格式')
          return false
        }
        let formData = new FormData()
        formData.append('file', file)
        formData.append('id', this.imgForm.id)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post("http://www.train.com/index.php/index/course/uploadImg", formData, config)
          .then(res => {
            console.log(res.data)
            this.imgForm.imgFlag = false
            this.imgForm.dialogVisible = true
            this.imgForm.url = 'http://www.train.com/' + res.data.data //重复上传时显示的是上次的图片
          })
      },
      handleCheckBoxChange(value) {
        this.$forceUpdate() // 强制更新
        this.$emit('handleCheckBoxChange', value)
      },
      getLength() {
        var vid = document.getElementById("video")
        this.videoForm.length = parseInt(vid.duration)
        console.log("videoForm: ", this.videoForm)
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import './form.scss';
</style>
