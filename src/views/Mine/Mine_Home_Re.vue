<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <publish-topic ref="topic" @publishSuccess="publishSuccess"></publish-topic>
      </div>
    </el-card>
    <topic @preview="preview" ref="topic_box"></topic>
  </div>
</template>

<script>
  import PublishTopic from '../../components/content/topic/PublishTopic.vue'
  import Topic from '../../components/content/topic/Topic.vue'
  export default {
    name: "Mine_Home_Re",
    components: {
      PublishTopic,
      Topic
    },
    methods:{
      preview(val){
        this.$refs.topic.dialogImageUrl = 'http://www.train.com/' + val
        this.$refs.topic.dialogVisible = true
      },
      publishSuccess(){
        this.$refs.topic_box.getList()
      }
    }
  }
</script>

<style scoped>

</style>
