<template>
  <div>
    <div v-for="child in re.child" class="commend_box">
      <el-avatar class="head_img" :size="35" :src="'http://www.train.com/' + child.head_img"
        :key="'http://www.train.com/' + child.head_img"></el-avatar>
      <div class="commend_content">
        <span class="username">{{child.username}}</span>
        <div class="time">{{child.time}}</div>
        <div class="content">{{child.content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CommendChild',
    props: {
      re: {
        type: Object,
        default () {
          return {}
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .commend_box {
    width: 100%;
    margin: 0 auto;
    margin-top: 15px;
    margin-left: 70px;

    .commend_content {
      margin-left: 45px;

      .time {
        color: #99a2aa;
        font-size: 12px;
        display: inline-block;
        margin-left: 20px;
      }
    }
  }

  .head_img {
    height: 35px;
    width: 35px;
    line-height: 35px;
    display: block;
    position: absolute;
    margin-top: 5px;
  }

  .username {
    font-size: 13px;
    font-weight: bold;
    color: #6d757a;
    cursor: pointer;
  }

  // end commend child
</style>
