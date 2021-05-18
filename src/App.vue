<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  html,
  body,
  #app{
    height: 100%;
    font-size: 14px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F4F4F4;
  }

  @import url("assets/css/base.css");

  ::v-deep .el-loading-spinner .el-loading-text{
  	color: #eea412 !important;
  }

  ::v-deep .el-loading-spinner i{
  	color: #eea412 !important;
  }
</style>
