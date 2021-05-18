<template>
  <div class="align-content-center">
    <!-- 文章列表 -->
    <el-table :data="dataList" style="width: 100%">
      <el-table-column prop="title" label="文章列表">
        <template slot-scope="scope">
          <el-link :underline="false" @click="onClick(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="time" label="" align="right">
      </el-table-column>
    </el-table>
    <!-- end list -->

    <!-- 分页 -->
    <el-pagination layout="prev, pager, next" :current-page="page" @current-change="getList" :total="total"
      :page-size="20">
    </el-pagination>
    <!-- end pagination-->
  </div>
</template>

<script>
  import {
    getKnowledgeAll
  } from '../../network/news.js'
  export default {
    name: "News_All",
    data() {
      return {
        dataList: [],
        page: 1,
        total: 10,
        data: []
      }
    },
    methods: {
      getList(page) {
        this.page = page
        console.log(page)
        getKnowledgeAll(this.page ? this.page : 1).then(res => {
          // console.log(res.data)
          this.dataList = res.data.data.list
          this.total = res.data.data.count
          this.dataDeal()
        })
      },
      dataDeal() {
        this.dataList = this.dataList.reverse()
        for (var i = 0; i < this.dataList.length; i++) {
          this.dataList[i].oldtime = this.dataList[i].time
          this.dataList[i].time = this.dataList[i].time.split(" ")[0]
        }
      },
      onClick(val) {
        // console.log(val)
        this.data = val
        this.$router.push({
          name: 'News_Detail',
          query: {
            data: JSON.stringify(this.data)
          }
        })
      },
    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table th>.cell {
    font-size: 20px;
    color: #eea412
  }

  ::v-deep .el-pagination {
    margin-top: 30px;
    float: right;
  }

  ::v-deep .el-link.el-link--default:hover {
    color: #eea412;
  }
</style>
