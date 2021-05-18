<template>
  <el-card style="margin-top: 8px;">
    <div slot="header" class="clearfix">
      <span><span class="line"></span>联系方式</span>
    </div>
    <div class="text item">
      <div>
        <span>手机：</span>
        <span v-if="contact.phone">{{contact.phone}}</span>
        <span v-else>暂无此联系方式</span>
      </div>
      <div>
        <span>地址：</span>
        <span v-if="contact.address">{{contact.address}}</span>
        <span v-else>暂无此联系方式</span>
      </div>
    </div>
  </el-card>
</template>

<script>
  import * as re_course from '../../../network/front_course.js'
  export default {
    name: 'Contact',
    props:{
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data(){
      return {
        contact: []
      }
    },
    methods:{
      // 获取班级列表数据
      getClassList() {
        re_course.getClassList(this.data.group_id).then(res => {
            if (res.data.error_code == 0) {
              this.contact = res.data.data.contact
            } else {
              this.contact = []
            }
            console.log(this.contact);
          })
      },
    },
    created() {
      this.getClassList()
    },
    watch:{
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.getClassList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .line {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #fc5531;
    vertical-align: -2px;
    margin-right: 8px;
  }
</style>
