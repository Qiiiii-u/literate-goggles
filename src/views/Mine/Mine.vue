<template>
  <div style="background-color: #f8fafc;">
    <home-nav-bar></home-nav-bar>

    <div class="container" style="padding: 0;">
      <el-container>
        <el-aside width="auto">
          <mine-nav></mine-nav>
        </el-aside>
        <el-main style="padding-right: 60px;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>

    <copy-right></copy-right>
  </div>
</template>

<script>
  import HomeNavBar from '../../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../../components/content/CopyRight.vue'
  import MineNav from '../../components/content/MineNav.vue'
  export default {
    name: 'Mine',
    components: {
      HomeNavBar,
      CopyRight,
      MineNav
    },
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/style.css';

  .container {
    max-width: 1300px;
  }
</style>
