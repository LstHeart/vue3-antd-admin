<template>
  <div class="flex justify-between" style="padding: 0 16px 8px 16px">
    <slot name="tableTopAction"></slot>
    <slot name="headerTitle">
      <div class="title">
        {{ title }}
        <BasicHelp v-if="titleTooltip" class="ml-6px pt-3px" :text="titleTooltip" />
      </div>
    </slot>

    <div style="display: flex; align-items: flex-end">
      <Space>
        <slot name="toolbar"></slot>

        <span v-if="exportFileName" @click="exportData2Excel">
          <slot name="export-button">
            <a-button type="primary">导出</a-button>
          </slot>
        </span>
      </Space>

      <Divider v-if="$slots.toolbar && showTableSetting" type="vertical" />
      <TableSetting v-if="showTableSetting" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Divider, Space } from 'ant-design-vue';
  import TableSetting from '../table-settings/index.vue';
  import BasicHelp from '@/components/basic/basic-help/index.vue';
  import { useTableContext } from '../../hooks';

  defineOptions({
    name: 'ToolBar',
  });

  defineProps({
    title: {
      type: String,
      default: '',
    },
    exportFileName: {
      type: String,
      default: '',
    },
    titleTooltip: {
      type: String,
      default: '',
    },
    showTableSetting: {
      type: Boolean,
      default: true,
    },
  });

  const { exportData2Excel } = useTableContext();
</script>

<style lang="less" scoped>
  .title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
  }
</style>
