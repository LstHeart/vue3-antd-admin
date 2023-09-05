<template>
  <div class="xc-content xc-table">
    <!-- <XCSchemaForm
      v-if="search"
      ref="queryFormRef"
      class="bg-white dark:bg-black mb-16px pt-24px pr-24px"
      submit-on-reset
      v-bind="getFormProps"
      :table-instance="tableAction"
      @toggle-advanced="(e) => $emit('toggle-advanced', e)"
      @submit="handleSubmit"
    >
      <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
    </XCSchemaForm> -->
    <TableSearchForm
      v-if="search"
      ref="queryFormRef"
      class="bg-white dark:bg-black mb-16px pt-24px pr-24px"
      submit-on-reset
      v-bind="getFormProps"
      :table-instance="tableAction"
      @toggle-advanced="(e) => $emit('toggle-advanced', e)"
      @submit="handleSubmit"
    >
      <!-- <template v-for="item in getFormSlotKeys" #[replaceFormSlotKey(item)]="data">
        <slot :name="item" v-bind="data || {}"></slot>
      </template> -->
    </TableSearchForm>
    <div class="bg-white dark:bg-black dy-table">
      <ToolBar
        v-if="showToolBar"
        :title="headerTitle"
        :title-tooltip="titleTooltip"
        :show-table-setting="showTableSetting"
      >
        <template v-if="$slots.headerTitle" #headerTitle>
          <slot name="headerTitle"></slot>
        </template>
        <slot name="tableTopAction"></slot>
        <span v-if="exportFileName" class="ml-6px" @click="exportData2Excel">
          <slot name="export-button">
            <a-button type="primary">导出</a-button>
          </slot>
        </span>
        <template v-if="$slots.toolbar" #toolbar>
          <slot name="toolbar"></slot>
        </template>
      </ToolBar>
      <Table
        ref="tableRef"
        v-bind="getBindValues"
        :data-source="tableData"
        class="xc-content"
        :bordered="false"
        :scroll="{ y: '100%' }"
        :pagination="props.pagination"
        @change="handleTableChange"
        :locale="state.localeObj"
      >
        <template
          v-for="slotName in defaultSlots.filter((name) => Reflect.has($slots, name))"
          #[slotName]="slotData"
          :key="slotName"
        >
          <slot :name="slotName" v-bind="slotData"></slot>
        </template>

        <!-- 个性化单元格 start -->
        <template
          v-for="slotName in ['bodyCell', 'headerCell']"
          #[slotName]="slotData"
          :key="slotName"
        >
          <slot :name="slotName" v-bind="slotData"></slot>
          <!-- 表格行操作start -->
          <template v-if="slotName === 'bodyCell' && getColumnKey(slotData.column) === '$action'">
            <TableAction :actions="slotData.column.actions(slotData)" />
          </template>
          <!-- 表格行操作end -->
          <template
            v-for="slotItem in getBindValues.columns?.filter((item) => item[slotName])"
            :key="getColumnKey(slotItem)"
          >
            <component
              :is="getComponent(slotItem?.[slotName]?.(slotData))"
              v-if="getColumnKey(slotData.column) === getColumnKey(slotItem)"
            />
          </template>
        </template>
        <!-- 个性化单元格 end -->
      </Table>
      <!-- <span>入库品种：1111</span> -->
      <div class="summary-table"> <slot name="summaryTable"></slot></div>
      <xcTableNoData style="display: none"></xcTableNoData>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { useSlots, reactive } from 'vue';
  import { Table } from 'ant-design-vue';
  import {
    useTableMethods,
    createTableContext,
    useExportData2Excel,
    useTableForm,
    useTableState,
  } from './hooks';
  import { TableAction, ToolBar } from './components';
  import { dynamicTableProps, defaultSlots, dynamicTableEmits } from './dynamic-table';
  import { TableActionType } from './types';
  // import { XCSchemaForm } from '@/components/xc/xc-schema-form';
  import { TableSearchForm } from '@/components/core/table-search-form';
  import xcTableNoData from '@/components/xc/xc-table/xc-table-noData/index.vue';
  // require('@/assets/images/login/resource_login_bg.png')

  const state = reactive({
    localeObj: {
      emptyText: <xcTableNoData></xcTableNoData>,
    },
  });

  // const localeObj = {
  //   emptyText: (
  //     <div>
  //       <img src="@/assets/images/xiaofulogo/table-nodata.png"></img>
  //       <p>暂无数据！</p>
  //     </div>
  //   ),
  // };
  defineOptions({
    name: 'DynamicTable',
    inheritAttrs: false,
  });

  const props = defineProps(dynamicTableProps);
  const emit = defineEmits(dynamicTableEmits);
  const slots = useSlots();

  // 表格内部状态
  const tableState = useTableState({ props, slots });
  const { tableData, queryFormRef, getBindValues } = tableState;
  // 表格内部方法
  const tableMethods = useTableMethods({ state: tableState, props, emit });
  const {
    getColumnKey,
    setProps,
    fetchData,
    handleSubmit,
    reload,
    handleTableChange,
    getComponent,
  } = tableMethods;

  // 搜索表单
  // const { getFormProps, replaceFormSlotKey, getFormSlotKeys } = useTableForm({
  //   tableState,
  //   tableMethods,
  //   slots,
  // });
  const { getFormProps } = useTableForm({
    tableState,
    tableMethods,
    slots,
  });

  // 当前组件所有的状态和方法
  const instance = {
    ...props,
    ...tableState,
    ...tableMethods,
  };

  // 表单导出
  const { exportData2Excel } = useExportData2Excel({
    props,
    state: tableState,
    methods: tableMethods,
  });

  const tableAction: TableActionType = {
    setProps,
    reload,
    fetchData,
  };
  createTableContext(instance);

  fetchData();

  defineExpose(instance);
</script>

<style lang="less" scoped>
  .summary-table {
    position: absolute;
    bottom: 0;
    left: 16px;
    height: 40px;
    display: flex;
    align-items: center;
    span {
      display: inline-block;
    }
    span + span {
      margin-right: 8px;
    }
  }
  :deep(.ant-table-wrapper) {
    // padding: 0 6px 6px 6px;

    .ant-table {
      padding: 0 16px;
      .ant-table-title {
        display: flex;
      }

      .ant-image:hover {
        cursor: zoom-in;
      }

      // .ant-btn {
      //   margin-right: 10px;
      // }
    }
  }

  .actions > * {
    margin-right: 10px;
  }

  .dy-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    padding-top: 8px;
    :deep(.ant-table-pagination.ant-pagination) {
      height: 40px;
      display: flex;
      align-items: center;
      margin: 0;
      padding: 0px 24px;
      border-top: 1px solid #e6e6e6;
    }
    .ant-table-wrapper {
      height: 100%;
    }
  }
</style>
