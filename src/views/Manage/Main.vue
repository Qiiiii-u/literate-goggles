<template>
  <el-container direction="vertical">
    <!--   标题栏   -->
    <el-header>
      <Header v-on:listenToChildEvent="onclick"></Header>
    </el-header>
    <el-container>
      <!--   导航栏   -->
      <el-aside width="auto">
        <navigation></navigation>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import navigation from '../../components/content/Navigation'
  import Header from '../../components/content/Header.vue'
  export default {
    name: "Main",
    data() {
      return {}
    },
    components: {
      navigation,
      Header
    },
    methods: {
      onclick(data) {
        this.$router.push(data)
      },
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-header {
    background-color: #242f42;
    line-height: 60px;
    width: 100%;
  }

  ::v-deep .el-aside{
    background-color: #fff;
    height: 100%;
    overflow: hidden;
    border-right: solid 1px #e6e6e6;
  }

  ::v-deep .el-main {
    padding: 0;
    // background-color: #e8e8e8;
    display: flex;
    flex-direction: column;
  }
  ::v-deep .el-container {
    // min-height: 100%;
    overflow-y: hidden;
    background-color: #fff;
  }

  ::v-deep .el-menu {
    border: none;
  }
</style>
