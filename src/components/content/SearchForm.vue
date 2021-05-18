<template>
  <div class="search-form-box">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <el-form :model="formData" ref="formRef" :inline="true">
          <el-form-item
            v-for="(item, index) in formOptions"
            :key="index"
            :prop="item.prop"
            :label="item.label ? (item.label + '：') : ''">
            <formItem v-model="formData[item.prop]" :itemOptions="item"/>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button
          v-if="btnItems.includes('search')"
          size="small"
          type="primary"
          @click="onSearch"
        >搜索</el-button>
        <el-button
          v-if="btnItems.includes('reset')"
          size="small"
          @click="onReset"
        >重置</el-button>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import formItem from './FormItem'
export default {
  name: "SearchForm",
  props:{
    formOptions: {
      type: Array,
      required: true,
      default () {
        return []
      }
    },
    btnItems: {
      type: Array,
      default () {
        return ['search', 'reset']
      }
    },
  },
  data () {
    return {
      formData: {}
    }
  },
  methods: {
    // 搜索
    onSearch () {
      this.$emit('onSearch', this.formData)
    },
    onReset () {
      this.$emit('onReset', this.formData)
    },
  },
  components: { formItem }
}
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__content{
  line-height: 30px;
}

.search-form-box {
  // padding-top: 0;
  // display: flex;
  .el-form {
    float: right;
    ::v-deep .el-form-item__label {
      padding-right: 0;
      line-height: 30px;
      padding-left:10px;
    }
  }
}

::v-deep .el-form-item{
  margin: 8px 10px 8px 0;
}
::v-deep .el-input--mini .el-input__inner{
  height: 30px;
  line-height: 30px;
}

// 时间datepicker
::v-deep .el-date-editor .el-range-separator{
  width: 20px;
}
::v-deep .el-range-editor--mini.el-input__inner{
  height: 30px;
  line-height: 30px;
  width: 220px;
}
::v-deep .el-select{
  width: 150px;
}
::v-deep .el-input{
  width: 150px;
}

</style>
