<template>
  <div >
    <el-row v-for="(item, index) in dataList" :key="index">
      <el-col class="inner-hmv " style="margin: 10px;padding: 20px;">
        <el-row style="margin: 0;">
          <el-col :xs="10" :sm="8" :md="6" :lg="2" :xl="2">
            <h3>{{item.date}}</h3>
            <p>{{item.year}}</p>
          </el-col>
          <el-col :xs="10" :sm="8" :md="6" :lg="20" :xl="20">
           <div style="font-size: 17px;"><a @click="onclick(item)">{{item.title}}</a></div>
           <div class="content">{{item.content}}</div>
          </el-col>
          <el-col :xs="10" :sm="8" :md="6" :lg="2" :xl="2">
           <div class="tr-pa">{{item.date}}</div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <a class="hover-btn-new orange" @click="toMore"><span>查看更多</span></a>
  </div>
</template>

<script>
  import {getKnowledgeAll} from '../../network/news.js'
  import {dataDeal,contentDeal} from '../../assets/js/normal.js'
  export default {
    name: "Front_News",
    data() {
      return {
        dataList: []
      }
    },
    methods: {
      getList() {
        getKnowledgeAll(1).then(res => {
          // console.log(res.data)
          this.dataList = res.data.data.list
          this.dataList = this.dataList.reverse()
          dataDeal(this.dataList)
          contentDeal(this.dataList)
        })
      },
      onclick(val){
        this.$router.push({name: 'News_Detail', query: {data: JSON.stringify(val)}})
      },
      toMore(){
        this.$router.push('/News_All')
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../assets/css/style.css';

  .inner-hmv h3 {
    font-size: 20px;
    margin-bottom: 5px;
  }

  .inner-hmv:hover p {
    color: #eea412;
    transition: all 0.3s;
  }

  .content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    color: gray;
  }

  .tr-pa {
    font-size: 40px;
    top: -30px;
  }

  .container .orange {
    background-color: #000;
    font-size: 15px;
    float: right;
    transition: all 0.3s;
  }

  .container .orange:hover {
    color: #000;
    background: #eea412;
    content: '';
    transition: all 0.3s;
  }

  .inner-hmv a:hover {
    color: #eea412 !important;
    transition: all 0.3s;
    cursor: pointer;
  }
  .tr-pa{
    color: #f1f1f1;
  }

  ::v-deep .el-row {
    margin-right: -15px;
    margin-left: -15px;
  }

  ::v-deep .el-col {
    padding-right: 15px;
    padding-left: 15px;
  }
</style>
