<template>
  <div v-if="data.length != 0">
    <div v-for="item in data" class="recent">
      <el-row>
        <el-col :xs="24" :sm="24" :md="9" :lg="7" :xl="7">
          <el-image class="group_img" :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
        </el-col>
        <el-col :xs="24" :sm="24" :md="15" :lg="17" :xl="17">
          <div class="data">
            <div class="first_line">
              <el-tag type="info" style="margin-right: 20px;">{{item.type}}</el-tag>
              <span class="group_name">{{item.group_name}}</span>
            </div>
            <div class="second_line">
              <span class="intro">共{{item.course_count}}节<el-divider direction="vertical"></el-divider>
                {{item.new_intro}}</span>
            </div>
            <div class="third_line">
              <span class="price">{{item.newPrice}}</span><span class="person">{{item.participants_num}}人参与</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <p class="line"></p>
    </div>
  </div>
  <div v-else>
    <p class="nulltips">您还没有创建一门课程噢</p>
  </div>
</template>

<script>
  export default {
    name: 'CoachCourseItem',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  // start courselist
  .recent {
    .line {
      border-bottom: 1px solid #d9dde1;
      margin: 10px;
    }

    .group_img {
      height: 136px;
      width: 240px;
      margin: 10px;
      box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.1);
      margin-left: 30px;
      cursor: pointer;
    }

    // .data {
    //   width: 650px;
    // }

    .group_name {
      font-size: 20px;
      color: #07111b;
      font-weight: 700;
      line-height: 36px;
      cursor: pointer;
    }

    .group_name:hover {
      color: lightsalmon;
    }

    .first_line {
      margin: 20px 10px;
    }

    .second_line {
      margin-left: 10px;

      .intro {
        font-size: 13px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        margin-left: 10px;
        color: #999;
      }

    }

    .third_line {
      // margin-left: 20px;
      float: right;
      margin-top: 10px;

      .price {
        color: red;
        font-size: 14px;
        margin-right: 30px;
      }

      .person {
        font-size: 13px;
        margin-right: 10px;
      }

    }
  }

  // data is null tips
  .nulltips {
    padding: 100px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }

  // end tips
  // end courselist
</style>
