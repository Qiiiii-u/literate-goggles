<template>
  <div>
    <!-- <span @click="isCollapse = !isCollapse" title="菜单">菜单</span> -->
    <el-menu :default-active="home.path" active-text-color="#fff" :unique-opened="true"
      class="navigation el-menu-vertical-demo" :collapse="isCollapse">
      <el-menu-item :index="home.path" @click="clickMenu(home)">
        <!-- <span slot="title"> -->
          <i :class="home.icon"></i>
          <span slot="title">{{home.label}}</span>
        <!-- </span> -->
      </el-menu-item>
      <el-submenu :index="item.label" v-for="(item, index) in hasChildren" :key="index">
        <template slot="title">
          <i :class="item.icon"></i>
          <span slot="title">{{item.label}}</span>
        </template>
        <el-menu-item :index="subItem.path" v-for="(subItem, subIndex) in item.children" :key="subIndex"
          @click="clickMenu(subItem)">{{subItem.label}}</el-menu-item>
      </el-submenu>
      <el-menu-item :index="item.path" v-for="item in noChildren" :key="item.path" @click="clickMenu(item)">
        <!-- <span slot="title"> -->
          <i :class="item.icon"></i>
          <span slot="title">{{item.label}}</span>
        <!-- </span> -->
      </el-menu-item>
    </el-menu>
  </div>

</template>

<script>
  export default {
    name: "Navigation",
    computed: {
      noChildren() {
        return this.menu.filter(item => !item.children)
      },
      hasChildren() {
        return this.menu.filter(item => item.children)
      },
      menu() {
        return this.$store.state.menu
      },
      isCollapse(){
        console.log(this.screenWidth);
        return this.screenWidth >= 800 ? false : true;
      }
    },
    data() {
      return {
        home: {
          path: 'Home',
          name: 'Home',
          label: '首页',
          icon: 'el-icon-s-home',
        },
        screenWidth: document.body.clientWidth
      }
    },
    methods: {
      clickMenu(item) {
        this.$store.commit('selectMenu', item)
        this.$router.push({
          name: item.name
        })
      }
    },
    mounted() {
      window.onresize = () => {
        this.screenWidth = document.body.clientWidth
      }
    },
    watch: {
      screenWidth(newValue) {
        // 为了避免频繁触发resize函数导致页面卡顿，使用定时器
        if (!this.timer) {
          // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenWidth
          this.screenWidth = newValue;
          this.timer = true;
          setTimeout(() => {
            //console.log(this.screenWidth);
            this.timer = false;
          }, 400);
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
    }
  //单行菜单
  .navigation .el-menu-item.is-active {
    background-color: #36A2EB !important;
    color: #fff !important;

    i {
      color: #fff !important;
    }
  }

  .navigation .el-menu-item:hover {
    background: #ecf5ff;
    color: #36A2EB;

    i {
      color: #36A2EB;
    }
  }

  //存在子项目的菜单
  ::v-deep .navigation .el-submenu .el-submenu__title:hover {
    background-color: #ecf5ff;
    color: #36A2EB;

    i {
      color: #36A2EB;
    }
  }

  .el-menu-item:hover,
  .el-menu-item:focus{
    background-color: #ecf5ff;
    color: #36A2EB !important;

    i {
      color: #36A2EB !important;
    }
  }
  .el-menu-item.is-active{
    color: #36A2EB !important;
  }
</style>
