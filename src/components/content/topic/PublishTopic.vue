<template>
  <div>
    <div>
      <el-input id="input" v-model="topic_text" type="textarea" placeholder="今天有什么特殊的事情值得分享呢……" maxlength="300"
        show-word-limit :autosize="{ minRows: 4, maxRows: 8}"></el-input>
    </div>

    <!-- 表情选择 -->
    <i class="icon-biaoqing" @click="showDialog = true" v-clickoutside="closeEmoji">
      <VEmojiPicker @select="onSelectEmoji" v-show="showDialog" />
    </i>

    <!-- 图片选择 -->
    <el-popover placement="bottom-start" title="图片上传" width="350" trigger="click">
      <el-upload action="#" :limit="limit" multiple list-type="picture-card" :file-list="imgFileList"
        :on-preview="handlePictureCardPreview" :on-change="OnChange" :on-remove="handleRemove" :on-exceed="handleExceed"
        accept="image/jpeg,image/png" :auto-upload="false" :class="hideUpload ? 'hide' : ''" ref="imgRef">
        <i class="el-icon-plus"></i>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，最多上传9张且单张图片不超过5M</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <i slot="reference" class="el-icon-picture-outline"></i>
    </el-popover>

    <a class="publish" @click="publish">发布</a>
  </div>
</template>

<script>
  import * as re_topic from '../../../network/mine/home.js'
  import axios from 'axios'
  const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
      function documentHandler(e) {
        // 判断点击的元素是否是本身（表情图标）
        if (el.contains(e.target)) {
          return false;
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数（closeEmoji）
          binding.value(e);
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
  };
  export default {
    name: 'PublishTopic',
    data() {
      return {
        topic_text: '',
        showDialog: false,
        dialogImageUrl: '',
        dialogVisible: false,
        limit: 9,
        hideUpload: false, //是否显示上传图片的加号
        imgFileList: [], //绑定用户上传的图片List
      }
    },
    methods: {
      // 插入表情
      onSelectEmoji(emoji) {
        let input = document.getElementById("input")
        let startPos = input.selectionStart // 光标位置
        let endPos = input.selectionEnd
        let resultText = input.value.substring(0, startPos) + emoji.data + input.value.substring(endPos)
        input.value = resultText
        input.focus()
        input.selectionStart = startPos + emoji.data.length
        input.selectionEnd = startPos + emoji.data.length
        this.topic_text = resultText
      },
      // 关闭表情框
      closeEmoji(e) {
        this.showDialog = false
      },
      // 预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      // 判断图片格式等条件并加入列表
      OnChange(file, fileList) {
        const isType = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
        const isLt5M = file.size / 1024 / 1024 < 5

        if (!isType) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          fileList.pop()
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
          fileList.pop()
        }
        this.imgFileList.push(file)
        this.hideUpload = fileList.length >= this.limit
        console.log(this.imgFileList)
      },
      // 删除图片
      handleRemove(file, fileList) {
        this.imgFileList = fileList
        this.hideUpload = fileList.length >= this.limit
      },
      // 文件超出个数限制时
      handleExceed(files, fileList) {
        this.$message.warning(`本条动态只限 9 张图片噢`)
      },
      // 发布动态
      publish() {
        let formData = new FormData()
        this.imgFileList.forEach(file => {
          formData.append('file[]', file.raw)
        })
        formData.append('uid', this.$store.getters.getCurrentUserList.uid)
        formData.append('text', this.topic_text)
        let config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
        axios.post("http://www.train.com/index.php/index/Topic/uploadPictures", formData, config).then(res => {
            if (res.data.error_code == 0) {
              this.$notify.success({
                title: '提示',
                message: '发布成功',
                showClose: false
              })
              this.topic_text = ''
              this.imgFileList = []
              this.$refs.imgRef.clearFiles()
              this.$emit('publishSuccess')
            } else {
              this.$notify.success({
                title: '提示',
                message: '哎呀，发布失败',
                showClose: false
              })
            }

          })
      },
    },
    directives: {
      clickoutside
    },
  }
</script>

<style lang="scss" scoped>
  a{
    cursor: pointer;
  }
  .publish {
    display: inline-block;
    margin: 10px 20px 20px 0;
    float: right;
    font-size: 14px;
    border: none;
    color: #fff;
    width: 104px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: rgba(240, 20, 20, .6);
    border-radius: 18px;
  }

  .publish:hover {
    background-color: #f01414;
  }

  ::v-deep .el-textarea__inner:focus {
    border-color: lightcoral;
  }

  // start emojipicker
  .icon-biaoqing {
    color: #999;
    cursor: pointer;
  }

  .icon-biaoqing:hover {
    color: lightcoral;
  }

  ::v-deep .el-icon-picture-outline {
    font-size: 21px;
    position: absolute;
    margin-top: 5px;
    color: #999;
    cursor: pointer;
  }

  ::v-deep .el-icon-picture-outline:hover {
    color: lightcoral;
  }

  ::v-deep .emoji-picker {
    position: absolute;
    width: 450px !important;
    z-index: 1;
  }

  ::v-deep #InputSearch {
    display: none !important;
  }

  ::v-deep .grid-emojis {
    grid-template-columns: repeat(10, 10%) !important;
  }

  ::v-deep .container-emoji {
    height: 168px !important;
  }

  //end emojipicker
  // start picture_list
  ::v-deep .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  :v-deep .el-upload--picture-card i {
    font-size: 20px;
  }

  ::v-deep .el-upload-list--picture-card li {
    width: 100px !important;
    height: 100px !important;
    border: none;
  }

  .hide {
    ::v-deep .el-upload--picture-card {
      display: none;
    }
  }

  // end picture_list
</style>
