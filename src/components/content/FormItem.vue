<template>
  <div class='form-item'>
    <el-input v-if="isInput" v-model="currentVal" v-bind="bindProps" v-on="bindEvents" placeholder="请输入" size="mini">
    </el-input>

    <el-input-number v-if="isInputNumber" v-model="currentVal" v-bind="bindProps" v-on="bindEvents"
      :controls-position="itemOptions['controls-position'] || 'right'" size="mini" placeholder="请输入" @clear="clear">
    </el-input-number>

    <el-select v-if="isSelect" v-model="currentVal" v-bind="bindProps" v-on="bindEvents" size="mini" clearable
      @clear="clear" placeholder="请选择">
      <el-option v-for="item in itemOptions.options" :key="item.value" :label="item.label" :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  export default {
    name: "FormItem",
    inheritAttrs: false,
    currentVal: undefined,
    props: {
      value: {},
      itemOptions: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    computed: {
      // 双向绑定数据值
      currentVal: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      },
      // 绑定属性
      bindProps() {
        let obj = {
          ...this.itemOptions
        }
        // 移除冗余属性
        delete obj.label
        delete obj.prop
        delete obj.element
        delete obj.initValue
        delete obj.rules
        delete obj.events
        if (obj.element === 'el-select') {
          delete obj.options
        }
        return obj
      },
      // 绑定方法
      bindEvents() {
        return this.itemOptions.events || {}
      },
      // el-input
      isInput() {
        return this.itemOptions.element === 'el-input'
      },
      // el-input-number
      isInputNumber() {
        return this.itemOptions.element === 'el-input-number'
      },
      // el-select
      isSelect() {
        return this.itemOptions.element === 'el-select'
      },

    },
    methods: {
      clear() {
        this.currentVal = undefined
      }
    }
  }
</script>

<style scoped>

</style>
