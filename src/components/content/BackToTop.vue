<template>
  <el-backtop target=".wrap" :bottom="10" :right="30">
    <i class="fa fa-angle-up"></i>
  </el-backtop>
</template>

<script>
  export default {
    name: 'BackToTop'
  }
</script>

<style scoped lang="scss">
  .fa {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale
  }

  .fa-angle-up:before {
    content: "\f106";
    font-family: 'FontAwesome';
  }

  .el-backtop {
    background-color: #3C3D41;
    z-index: 100;
    width: 40px;
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 10px;
    border-radius: 3px;
    right: 30px;
    text-align: center;
    font-size: 28px;
    color: #ffffff !important;
    cursor: pointer;
    transition: all .7s ease-in-out;
  }
</style>
