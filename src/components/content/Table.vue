<template>
  <div class="common-table">
    <el-table :data="tableData" stripe v-loading="config.loading" @sort-change="changeTableSort"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <!--   表头   -->
      <el-table-column show-overflow-tooltip v-for="item in tableLabel" :prop="item.prop" :key="item.prop"
        :label="item.label" :width="item.width ? item.width : 100" :sortable="item.sort ? item.sort : false">
        <!--    插槽  slot-scope="scope" 获取当前单元格数据  -->
        <template slot-scope="scope">
          <span
            v-if="!item.tag && !item.link && !item.money && !item.taglabel && !item.stop && !item.button">{{ scope.row[item.prop] }}</span>
          <el-link :underline="false" v-if="item.link" @click="toContent(scope.row)">{{ scope.row[item.prop] }}
          </el-link>

          <!--    标签tag （用于消息管理）     -->
          <el-tag v-if="item.tag" size="medium"
            :type="scope.row[item.prop] === '已删除' ? 'danger' : (scope.row[item.prop] === '未发布' || scope.row[item.prop] === '已取消' ? 'info':(scope.row[item.prop] === '未付款' ?'warning':'success'))">
            {{ scope.row[item.prop] }}
          </el-tag>

          <el-tag v-for="i in scope.row[item.prop]" :key="i" v-if="item.taglabel" size="medium" :type="'succsee'"
            style="margin-right: 5px;">{{ i }}</el-tag>
          <el-tag @click="handleUse(scope.row)" v-if="item.stop" size="medium"
            :type="scope.row[item.prop] === 0 ? 'success' : 'danger'">{{ scope.row[item.prop] == 0 ? '启用' : '禁用' }}
          </el-tag>
          <!-- end tag -->

          <!-- 订单 -->
          <div v-if="item.money" style="color: #aaaaaa">商品金额：{{scope.row[item.prop2]}}</div>
          <div v-if="item.money" style="color: #aaaaaa">交易金额：{{scope.row[item.prop]}}</div>
          <!-- end order -->
        </template>
      </el-table-column>
      <!--操作-->
      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <el-button size="small" @click="handleScan(scope.row)" v-if="opt === 'scan'">查看</el-button>
          <el-button size="small" type='primary' @click="handlePublish(scope.row)" v-if="opt === 'publish'">发布
          </el-button>
          <el-button size="small" @click="handleEdit(scope.row)"
            v-if="opt === 'normal' || opt === 'publish' || scope.row['status'] == 0">编辑</el-button>
          <el-button size="small" @click="handleRecycle(scope.row)" v-if="opt === 'recycle'">恢复</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)"
            v-if="opt === 'normal' || opt === 'publish' || opt === 'review'  || scope.row['status'] == 1 || opt === 'recycle'">
            删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination class="pager" layout="prev, pager, next" :total="config.total" :current-page.sync="config.page"
      @current-change="changePage"></el-pagination>
  </div>
</template>

<script>
  export default {
    name: "Table",
    props: {
      tableData: Array,
      tableLabel: Array,
      opt: String,
      config: {
        type: Object,
        default: function() {
          return {
            page: 1,
            total: 10,
            loading: false
          }
        }
      }
    },
    methods: {
      // 启用账号
      handleUse(row) {
        this.$emit('use', row)
      },
      //更新
      handleEdit(row) {
        this.$emit('edit', row)
      },
      //删除
      handleDelete(row) {
        this.$emit('del', row)
      },
      //分页
      changePage(page) {
        this.$emit('changePage', page)
      },
      handleRecycle(row) {
        this.$emit('recycle', row)
      },
      handlePublish(row) {
        this.$emit('publish', row)
      },
      handleScan(row) {
        this.$emit('scan', row)
      },
      changeTableSort(column) {
        this.$emit('changeTableSort', column)
      },
      handleSelectionChange(val) {
        this.$emit('handleSelectionChange', val)
      },
      toContent(row) {
        this.$emit('toContent', row)
      }
    }
  }
</script>

<style lang="scss">
  .el-table th,
  .el-table td {
    text-align: center;
  }

  .common-table {
    height: calc(100% - 65px);
    position: relative;

    .pager {
      margin-top: 20px;
      position: absolute;
    }
  }
  
  .el-tag {
    cursor: pointer;
  }
</style>
