<template>
  <div class="wrap">
    <home-nav-bar></home-nav-bar>

    <div id="carouselExampleControls" class="carousel slide bs-slider box-slider" data-ride="carousel"
      data-pause="hover" data-interval="false">
      <!--指示器-->
      <ol class="carousel-indicators">
        <li data-target="#carouselExampleControls" data-slide-to="0" class="active"></li>
        <li data-target="#carouselExampleControls" data-slide-to="1"></li>
        <li data-target="#carouselExampleControls" data-slide-to="2"></li>
      </ol>
      <!--   轮播图主体   -->
      <div class="carousel-inner" role="listbox">
        <div class="carousel-item active">
          <div id="home" class="first-section">
            <div class="big-tagline">
              <h2 data-animation="animated zoomInRight">让更多的儿童<strong>爱上运动</strong></h2>
              <p class="lead" data-animation="animated fadeInLeft">Let more Chinese children fall in love with sports.
              </p>
            </div>
          </div>
        </div>

        <div class="carousel-item">
          <div id="home" class="second-section">
            <div class="big-tagline">
              <h2 data-animation="animated zoomInRight">让孩子在<strong>快乐</strong>中玩出<strong>强大</strong></h2>
              <p class="lead" data-animation="animated fadeInLeft">Let kids have fun and play stronger.</p>
            </div>
          </div>
        </div>

        <div class="carousel-item">
          <div id="home" class="third-section">
            <div class="big-tagline">
              <h2 data-animation="animated zoomInRight"><strong>体适能</strong>改变孩子大脑</h2>
              <p class="lead" data-animation="animated fadeInLeft">Physical fitness can change a child's brain</p>
            </div>
          </div>
        </div>
        <!-- Left Control -->
        <a class="new-effect carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span class="fa fa-angle-left" aria-hidden="true"></span>
        </a>

        <!-- Right Control -->
        <a class="new-effect carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span class="fa fa-angle-right" aria-hidden="true"></span>
        </a>
      </div>
    </div>

    <div id="overviews" class="section wb">
      <div class="container">
        <div class="section-title row text-center">
          <div class="col-md-8 offset-md-2">
            <h3>关于我们</h3>
            <h1 style="color: #eea412"><strong>About us</strong></h1>
          </div>
        </div><!-- end title -->

        <el-row align="middle">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="message-box">
              <h2>什么是体适能？</h2>
              <h4>What is physical fitness?</h4>
              <p>
                体适能是指人体应具备的充足的精力，包含身体适能、心理适能、健康体适能及竞技体适能，身体适能单纯从生理发育的角度的训练，目的是保持精力旺盛，没有过度疲劳；健康体适能则侧重于保持健康的身体状态，非心理、运动专业领域，一般不纳入心理适能与竞技体适能的内容。
              </p>
              <p>Physical fitness refers to the body should have enough energy, including physical fitness,
                psychological fitness, healthy fitness and competitive fitness. Physical fitness training is only from
                the perspective of physical development, the purpose is to maintain energy, without excessive
                fatigue;Healthy physical fitness focuses on maintaining a healthy physical state, which is not in the
                field of psychology and sports, and is generally not included in the content of psychological fitness
                and competitive physical fitness.</p>
              <a class="hover-btn-new orange"><span @click="toAbout">查看更多</span></a>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="post-media wow fadeIn">
              <img src="../assets/img/about_02.jpg" alt="" class="img-fluid img-rounded">
            </div>
          </el-col>
        </el-row>

        <el-row align="middle">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="post-media wow fadeIn">
              <img src="../assets/img/about_03.jpg" alt="" class="img-fluid img-rounded">
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <div class="message-box">
              <h2>我们的目标</h2>
              <h4>Our Target</h4>
              <p>
                专注于6-12岁少年儿童基于身体生活的需求的动作模式，动作技能与运动技能训练与发展。以提升孩子的柔韧、平衡、协调、敏捷、速度、力量、耐力各项身体综合素质为目的，通过科学训练增强体魄，刺激大脑神经系统发育，促进身体生长，保持良好姿态与形体，建立优良品格与自律人生。
              </p>
              <p>Focus on the training and development of 6-12-year-old children's movement patterns, movement skills
                and motor skills based on the needs of physical life. In order to improve children's flexibility,
                balance, coordination, agility, speed, strength, endurance and other comprehensive physical qualities,
                through scientific training to enhance physique, stimulate the development of brain nervous system,
                promote body growth, maintain good posture and shape, and establish good character and self-discipline
                life.</p>
              <a class="hover-btn-new orange"><span @click="toAbout">查看更多</span></a>
            </div>
          </el-col>
        </el-row>

      </div><!-- end container -->
    </div><!-- end section -->

    <div class="section cl">
      <div class="container">
        <div class="section-title row text-center">
          <div class="col-md-8 offset-md-2">
            <h3 style="color: white">四大功能</h3>
            <h1 style="color: #eea412"><strong>Four Functions</strong></h1>
          </div>
        </div><!-- end title -->

        <el-row justify="center" style="margin-top: 30px;">
          <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="(item, index) in intro" :key="index" style="margin-bottom: 10px;">
            <div class="pricing-table pricing-table-highlighted" style="padding: 30px">
              <div class="pricing-table-header grd1" style="background: #4babb1;text-align: center;">
                {{item}}
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="section lb">
      <div class="container">
        <div class="section-title text-center">
          <h3>课程体系</h3>
          <h1 style="color: #eea412"><strong>Choose Your Courses</strong></h1>
        </div><!-- end title -->

        <div class="row">
          <div class="col-md-6 offset-md-3">
            <div class="message-box">
              <ul class="nav nav-pills nav-stacked" id="myTabs">
                <li><a class="active" href="#tab1" data-toggle="pill" @click="flag = true">视频课程Online</a></li>
                <li><a href="#tab2" data-toggle="pill" @click="flag = false">线下课程Offline</a></li>
              </ul>
            </div>
          </div><!-- end col -->
        </div>

        <el-row justify="center" v-if="flag">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="text-align: center;" v-for="(item, index) in intro2" :key="index">
            <div class="pricing-table pricing-table-highlighted">
              <div class="pricing-table-features" style="padding: 0;text-align: center;">
                <p style="padding-top: 1rem;font-size: 22px"><strong style="color: #4babb1">{{item.name}}</strong></p>
              </div>
              <div class="pricing-table-header grd1">
                <img :src="item.img" alt="" :style="'width:' + item.width + 'px'">
              </div>
              <div class="pricing-table-space"></div>
              <div class="pricing-table-sign-up">
                <a class="hover-btn-new orange"><span @click="toCourse">查看详情</span></a>
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row justify="center" v-else>
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" style="text-align: center;" v-for="(item, index) in intro3" :key="index">
            <div class="pricing-table pricing-table-highlighted">
              <div class="pricing-table-features" style="padding: 0;text-align: center;">
                <p style="padding-top: 1rem;font-size: 22px"><strong style="color: #4babb1">{{item.name}}</strong></p>
              </div>
              <div class="pricing-table-header grd1">
                <img :src="item.img" alt="" :style="'width:' + item.width + 'px'">
              </div>
              <div class="pricing-table-space"></div>
              <div class="pricing-table-sign-up">
                <a class="hover-btn-new orange"><span @click="toCourse">查看详情</span></a>
              </div>
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
    name: 'Index',
    components: {
      HomeNavBar, CopyRight, BackToTop
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        flag: true,
        intro: ['网课+实体组合训练', '分班交流，共同进步', '制定计划，加强锻炼', ' 发布动态，展示成果'],
        intro2: [{
            name: '亲子瑜伽',
            img: require('../assets/img/1.png'),
            width: 267
          },
          {
            name: '亲子运动',
            img: require('../assets/img/5.png'),
            width: 300
          },
          {
            name: '亲子搏击',
            img: require('../assets/img/4.png'),
            width: 300
          },
        ],
        intro3: [{
            name: '体能训练',
            img: require('../assets/img/2.png'),
            width: 300
          },
          {
            name: '身体锻炼',
            img: require('../assets/img/3.png'),
            width: 300
          },
          {
            name: '球类活动',
            img: require('../assets/img/nintchdbpict000395812338.jpg'),
            width: 294
          },
        ],
      }
    },
    methods: {
      toAbout(){
        this.$router.push('/Front_About')
      },
      toCourse(){
        this.$router.push('/Front_Course')
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
  @import url("../assets/css/bootstrap.min.css");
  @import url("../assets/css/style.css");
  @import url("../assets/css/versions.css");

  ::v-deep .el-row {
    margin-right: -15px;
    margin-left: -15px;
  }

  ::v-deep .el-col {
    padding-right: 15px;
    padding-left: 15px;
  }
  
  a{
    cursor: pointer;
  }
</style>
