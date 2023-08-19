<template>
  <Space :size="8" class="table-size">
    <!-- <RefreshSetting /> -->
    <ColumnSetting />
    <SizeSetting />
  </Space>
</template>

<script lang="ts" setup>
  import { Space } from 'ant-design-vue';
  import SizeSetting from './size-setting.vue';
  import ColumnSetting from './column-setting.vue';
</script>
<style lang="less">
  .table-size {
    .ant-space-item {
      border: 1px solid #e6e6e6;
      width: 32px;
      text-align: center;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
    }
  }
</style>
