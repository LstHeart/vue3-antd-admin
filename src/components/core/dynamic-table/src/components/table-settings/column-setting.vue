<template>
  <Tooltip placement="top">
    <template #title>
      <span>列设置</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      overlay-class-name="cloumn-list"
      @visible-change="handleVisibleChange"
    >
      <template #title>
        <div class="popover-title">
          <Checkbox
            v-model:checked="checkAll"
            :indeterminate="indeterminate"
            @change="handleCheckAllChange"
          >
            列展示
          </Checkbox>
          <Checkbox v-model:checked="checkIndex" @change="handleIndexCheckChange">
            序号列
          </Checkbox>
          <!-- <Checkbox v-model:checked="checkBordered" @change="handleBorderedCheckChange">
            边框
          </Checkbox> -->
          <a-button size="small" type="link" @click="reset"> 重置 </a-button>
        </div>
      </template>
      <template #content>
        <div ref="columnListRef">
          <template v-for="item in tableColumns" :key="table.getColumnKey(item)">
            <div class="check-item">
              <div style="padding: 4px 16px 8px 0">
                <DragOutlined class="table-column-drag-icon pr-6px cursor-move" />
                <Checkbox
                  v-model:checked="item.hideInTable"
                  :true-value="false"
                  :false-value="true"
                  @change="handleColumsCheckChange()"
                >
                  {{ item.title }}
                </Checkbox>
              </div>
              <div class="column-fixed">
                <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                  <template #title> 固定到左侧 </template>
                  <VerticalRightOutlined
                    class="fixed-left"
                    :class="{ active: item.fixed === 'left' }"
                    @click="handleColumnFixed(item, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="bottomLeft" :mouse-leave-delay="0.4">
                  <template #title> 固定到右侧 </template>
                  <VerticalLeftOutlined
                    class="fixed-right"
                    :class="{ active: item.fixed === 'right' }"
                    @click="handleColumnFixed(item, 'right')"
                  />
                </Tooltip>
              </div>
            </div>
          </template>
        </div>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>

<script lang="ts" setup>
  import { computed, nextTick, ref, unref, watchEffect } from 'vue';
  import {
    SettingOutlined,
    VerticalRightOutlined,
    VerticalLeftOutlined,
    DragOutlined,
  } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import { Tooltip, Popover, Divider } from 'ant-design-vue';
  import { useTableContext } from '../../hooks/useTableContext';
  import Checkbox from '@/components/basic/check-box/index.vue';
  import { useSortable } from '@/hooks/useSortable';
  import { isNullAndUnDef } from '@/utils/is';
  // import {
  //   sysProjectTableInsert,
  //   updateTableSetting,
  //   sysProjectTableTableSetting,
  // } from '@/api/login';
  // import { getRunProject, getUserId } from '@/utils/authUtil';
  // import { useUserStore } from '@/store/modules/user';
  import type { TableColumn } from '../../types/column';

  // const userStore = useUserStore();
  // const corpId = userStore.userInfo.mgrCorpId;
  // const projectCode = getRunProject();
  // const userId = getUserId();

  // type TableColumnType<T = any> = TableColumn<T> & {
  //   /** 目的是解决：类型实例化过深，且可能无限 */
  //   formItemProps?: any;
  // };

  const table = useTableContext();
  // const tableName = table.tableName;

  // let tableId = null;
  let inited = false;

  let defaultShowIndex = !!table.showIndex;
  let defaultBordered = table.bordered;
  defaultBordered = false;
  let defaultColumns = cloneDeep(table.columns);
  const tableColumns = ref([] as any[]);

  const checkAll = computed<boolean>({
    get() {
      return tableColumns.value.length > 0 && tableColumns.value.every((n) => !n.hideInTable);
    },
    set(value) {
      tableColumns.value.forEach((item) => (item.hideInTable = !value));
    },
  });

  const checkIndex = ref(defaultShowIndex);
  const checkBordered = ref(table.bordered);
  const columnListRef = ref<HTMLDivElement>();

  // 初始化选中状态
  const initCheckStatus = async () => {
    // const dataProp = await sysProjectTableTableSetting({
    //   corpId: userStore.userInfo.mgrCorpId,
    //   projectCode,
    //   tableName,
    //   userId,
    // });
    // tableId = dataProp.id;
    // if (dataProp && dataProp.columns && dataProp.columns.length) {
    //   const temp: any = cloneDeep(table.columns);
    //   for (let i = 0; i < temp.length; i++) {
    //     const res = dataProp.columns.find((item) => {
    //       return item.title === temp[i].title && item.dataIndex === temp[i].dataIndex;
    //     });
    //     if (res) {
    //       temp[i].fixed = temp[i].fixed ? temp[i].fixed : res.fixed;
    //       temp[i].hideInTable = res.hideInTable;
    //       temp[i].sort = res.sort;
    //     }
    //   }
    //   dataProp.bordered = dataProp?.border ? true : false;
    //   dataProp.bordered = false;
    //   defaultColumns = temp;
    //   defaultColumns.sort((a, b) => {
    //     return Number(a.sort) - Number(b.sort);
    //   });
    // } else {
    //   defaultColumns = cloneDeep(table.columns);
    //   dataProp.bordered = true;
    //   dataProp.bordered = false; // 暂时去掉表格边框，后面可能会需要动态配置边框
    //   dataProp.showIndex = true;
    // }
    // defaultBordered = dataProp.bordered;
    // defaultShowIndex = dataProp.showIndex;
    table.setProps({ showIndex: defaultShowIndex });
    resetInit();
  };

  const resetInit = () => {
    tableColumns.value = cloneDeep(defaultColumns);
    checkIndex.value = defaultShowIndex;
    checkBordered.value = defaultBordered;
    tableColumns.value.forEach((item: any) =>
      item.hideInTable ? (item.hideInTable = true) : (item.hideInTable = false),
    );
  };

  resetInit();
  initCheckStatus();

  const indeterminate = computed(() => {
    return (
      tableColumns.value.length > 0 &&
      tableColumns.value.some((n: any) => n.hideInTable) &&
      tableColumns.value.some((n: any) => !n.hideInTable)
    );
  });

  watchEffect(() => {
    table.setProps({ columns: tableColumns.value });
  });
  // 设置序号列
  const handleIndexCheckChange = (e) => {
    table.setProps({ showIndex: e.target.checked });
    updateOrInsertTable();
  };
  const handleCheckAllChange = () => {
    updateOrInsertTable();
  };
  // 设置边框
  // const handleBorderedCheckChange = (e) => {
  //   table.setProps({ bordered: e.target.checked });
  //   updateOrInsertTable();
  // };
  const handleColumsCheckChange = () => {
    updateOrInsertTable();
  };

  const handleColumnFixed = (columItem: TableColumn<any>, direction: 'left' | 'right') => {
    columItem.fixed = columItem.fixed === direction ? false : direction;
    updateOrInsertTable();
  };

  const updateOrInsertTable = async () => {
    const columsItem = tableColumns.value.map((item) => {
      let { title, dataIndex, fixed = '', hideInTable, sort = 0 } = item;
      hideInTable = hideInTable ? 1 : 0;
      return { title, dataIndex, fixed, hideInTable, sort };
    });
    // 设置sort 便于后面保存
    for (let i = 0; i < columsItem.length; i++) {
      columsItem[i].sort = i;
    }
    // const params = {
    //   border: checkBordered.value ? 1 : 0,
    //   showIndex: checkIndex.value ? 1 : 0,
    //   columns: [...columsItem],
    //   tableName,
    //   projectCode,
    //   userId,
    //   corpId,
    // };
    // if (tableId) {
    //   updateTableSetting(params);
    // } else {
    //   await sysProjectTableInsert(params);
    //   const res = await sysProjectTableTableSetting({
    //     corpId,
    //     projectCode,
    //     tableName,
    //     userId,
    //   });
    //   tableId = res?.id;
    // }
  };

  async function handleVisibleChange() {
    if (inited) return;
    await nextTick();
    const columnListEl = unref(columnListRef);
    if (!columnListEl) return;

    // Drag and drop sort
    const { initSortable } = useSortable(columnListEl, {
      handle: '.table-column-drag-icon',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt;

        if (isNullAndUnDef(oldIndex) || isNullAndUnDef(newIndex) || oldIndex === newIndex) {
          return;
        }
        // Sort column
        const columns = tableColumns.value;
        columns.splice(newIndex, 0, columns.splice(oldIndex, 1)[0]);
        updateOrInsertTable();
      },
    });
    initSortable();
    inited = true;
  }

  const reset = () => {
    defaultColumns = defaultColumns.map((item) => {
      // item.hideInTable = 0;
      return item;
    });
    defaultBordered = table.bordered;
    defaultBordered = false;
    resetInit();
    updateOrInsertTable();
    table.setProps({ showIndex: defaultShowIndex, bordered: defaultBordered });
  };
</script>

<style lang="less">
  .cloumn-list {
    .ant-popover-inner-content {
      border: 1px solid #fcfcfc;
      max-height: 450px;
      overflow-y: scroll;
    }
  }
</style>
<style lang="less" scoped>
  .check-item {
    // @apply flex justify-between;
    display: flex;
    justify-content: space-between;
  }
  .column-fixed {
    .fixed-right,
    .fixed-left {
      &.active,
      &:hover {
        color: @primary-color;
      }
    }
  }
</style>
