<template>
  <div class="nodata">
    <div><img class="nodata-img" :src="state.srcUrl" /></div>
    <p>暂无数据！</p>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  const state = reactive({
    srcUrl: require('@/assets/images/xiaofulogo/table-nodata.png'),
  });
</script>
<style lang="less" scoped>
  .nodata {
    margin: 24px 0;
    .nodata-img {
      width: 80px;
      height: 80px;
      text-align: center;
    }
    div {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      margin-top: 12px;
      text-align: center;
    }
  }
</style>
