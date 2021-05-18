<template>
  <div class="wrap">
    <home-nav-bar></home-nav-bar>

    <div class="all-title-box">
      <div class="container text-center">
        <h1>关于我们<span class="m_1">About Us</span></h1>
      </div>
    </div>

    <div class="section" style="padding-bottom: 0;">
      <div class="container">
        <el-row>
          <el-col>
            <div class="message-box">
              <h2>创建理由</h2>
              <h4>Why we create?</h4>
              <p>随着时代的变迁以及人民生活水平的提高，亚健康问题在中国日趋严重，少儿的身体正处于生长发育的关键时期，体内新陈代谢旺盛，
                身体各组织器官的结构、功能，智力、心理的发育都具有很大的潜力和可塑性，而体能训练对促进少儿身体健康发育及机能的协调发展有着重要的意义和作用。
                当代大部分少儿因缺乏体能训练被肥胖、疲乏、体弱易病等问题困扰，少儿体能训练在无形之中影响他们在学业以及未来人生的发展。
                针对少儿的体能训练是对少儿的身体素质即人体速度、力量、弹跳力、耐久力、柔韧性、灵敏性等素质进行有效训练，提高少儿的身体健康水平，
                提高有机体的工作能力，提高少儿的自我效能与高度的学习动机，让少儿获得全面的发展，为未来生活打好坚实的基础。</p>
              <p>本网站旨在为少儿与其家长提供一个线上平台，在这个平台，能够给出基本进阶提高的或图文或视频的教程，
                以及有关体能训练的百科知识，可以提供一个给家长了解体能训练的途径，制定属于孩子量身打造的计划，家长可以让孩子足不出户就能在家自主锻炼，
                且节省了很大的一笔培训班需要的开销，适应当前的社会环境以及生活习惯。其次，家长通过话题与其他有经验的家长进行线上沟通，
                能够对自己需要制定的计划更加的明确，同时也能让孩子获得他人的认同与鼓励，促进孩子对锻炼的积极度。最后，家长可以进行每日打卡，
                分享孩子的锻炼进度，坚持程度，累计下来，可以查看一段时间的锻炼结果，明显的进步能够促进孩子继续锻炼。
                当然，如果家长有线下托管教学的需求，可以选择线下课程，教练将会联系，确定详细的授课流程，如普通的培训班教学一般。</p>
            </div>
          </el-col>
          <el-col>
            <div class="post-media wow fadeIn">
              <img src="../assets/img/about_03.jpg" alt="" class="img-fluid img-rounded">
            </div>
          </el-col>
          <el-col>
            <div class="message-box">
              <h2>我们的目标</h2>
              <h4>Our Target</h4>
              <p>
                专注于6-12岁少年儿童基于身体生活的需求的动作模式，动作技能与运动技能训练与发展。以提升孩子的柔韧、平衡、协调、敏捷、速度、力量、耐力各项身体综合素质为目的，通过科学训练增强体魄，刺激大脑神经系统发育，促进身体生长，保持良好姿态与形体，建立优良品格与自律人生。
              </p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <copy-right></copy-right>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  import HomeNavBar from '../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../components/content/CopyRight.vue'
  import BackToTop from '../components/content/BackToTop.vue'
  export default {
    name: "Front_About",
    components: {
      HomeNavBar,
      CopyRight,
      BackToTop
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
    }
  }
</script>

<style lang="scss" scoped>
  @import url("../assets/css/style.css");

  ::v-deep .el-row {
    margin-right: -15px;
    margin-left: -15px;
  }

  ::v-deep .el-col {
    padding-right: 15px;
    padding-left: 15px;
  }

  // title
  .all-title-box {
    background: url(../assets/img/banner.jpg)no-repeat;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-position: center;
    min-height: 300px;
  }

  .all-title-box h1 {
    color: #fff;
    font-weight: 600;
    text-transform: capitalize;
    padding-top: 11%;
    font-size: 48px;
    line-height: 0px;
  }

  span.m_1 {
    font-weight: 300;
    font-size: 20px;
    line-height: 1.5em;
    display: block;
  }

  // end

  // picture
  .post-media img {
    width: 80%;
    display: table-cell;
    margin: 0 auto;
  }
</style>
