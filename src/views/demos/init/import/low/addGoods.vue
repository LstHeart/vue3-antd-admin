<template>
  <DraggableModal
    :title="'添加产品'"
    :wrap-class-name="'modal-select-box'"
    width="90%"
    :wrap-style="{ overflow: 'hidden' }"
    :ok-text="`确定（${rowSelectionEntity.selectedRowKeys.length}）`"
    cancel-text="取消"
    :ok-button-props="{
      disabled: !rowSelectionEntity.selectedRowKeys.length,
    }"
    @ok="saveEnt"
    @cancel="handleCancel"
  >
    <div class="xc-page modal-box">
      <a-form
        class="xc-header"
        style="padding-bottom: 16px"
        :model="state.addQuery"
        layout="inline"
        autocomplete="off"
      >
        <a-col :span="5" style="margin-right: 10px">
          <a-form-item label="产品名称" name="goodsName">
            <a-input v-model:value="state.addQuery.goodsName" placeholder="产品名称"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="5" style="margin-right: 10px">
          <a-form-item label="规格型号" name="goodsSpec">
            <a-input v-model:value="state.addQuery.goodsSpec" placeholder="规格型号"></a-input>
          </a-form-item>
        </a-col>
        <a-button type="primary" @click="searchList">查询</a-button>
        <a-button type="default" @click="resetAdd">重置</a-button>
      </a-form>
      <a-table
        class="xc-content"
        :scroll="{ y: '100%' }"
        :row-key="(record) => record.id"
        :columns="addGoodsColumns"
        :row-selection="rowSelectionEntity"
        :data-source="state.productAddList"
        :pagination="state.paginationHos"
        @change="handleHosTableChange"
      >
      </a-table>
    </div>
  </DraggableModal>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import cloneDeep from 'lodash-es/cloneDeep';
  import { PAGE_OBJ } from '@/enums/paginationEnums';
  import { DraggableModal } from '@/components/core/draggable-modal';
  import { addGoodsColumns } from './columns';
  import { message } from 'ant-design-vue';
  import initImportApi from '@/api/init/import';
  import { BaseDetail, DetailGoods, Goods } from '../typing';

  const props = defineProps({
    baseDetail: {
      type: Object as PropType<BaseDetail>,
      required: true,
    },
    addedList: {
      type: Array as PropType<Array<DetailGoods>>,
      required: true,
    },
  });
  const emit = defineEmits(['update:visible', 'update:addedList', 'save']);

  // Data Definition
  const state = reactive({
    productAddList: [] as any[],
    paginationHos: cloneDeep(PAGE_OBJ),
    addQuery: {} as any, // 新增查询条件
  });

  // 弹框显示
  const rowSelectionEntity = ref({
    selectedRowKeys: [] as number[],
    selectedList: [] as any[],
    onChange: (selectedRowKeys: number[], selectedRows) => {
      rowSelectionEntity.value.selectedList = selectedRows;
      rowSelectionEntity.value.selectedRowKeys = selectedRowKeys;
    },
  });

  // Common Functions(Table/Pagination/Styles...)
  // 添加=弹框=翻页
  const handleHosTableChange = (pagination) => {
    state.paginationHos.current = pagination.current;
    state.paginationHos.pageSize = pagination.pageSize;
    loadAddTable();
  };

  // Life Cycle Functions
  // 初始化加载
  onMounted(async () => {
    searchList();
  });

  // Business Functions
  // 获取产品表格数据
  const loadAddTable = async () => {
    state.productAddList = [];

    const params = {
      queryObject: {
        ...props.baseDetail,
        ...state.addQuery,
      },
      pageNum: state.paginationHos.current,
      pageSize: state.paginationHos.pageSize,
    };
    const result = await initImportApi.getInitStockGoodsList(params);
    state.productAddList = result.data.data;
    state.paginationHos.total = result.data.total;
  };
  // 查询
  const searchList = () => {
    state.paginationHos.current = 1;
    loadAddTable();
  };

  // 重置
  const resetAdd = () => {
    state.addQuery = {};
    searchList();
  };

  // 产品添加-保存
  const saveEnt = async () => {
    const list = rowSelectionEntity.value.selectedList;

    const tempGoodsList = [] as any[];
    list.forEach((item: Goods) => {
      if (props.addedList.length > 0) {
        let isAdd = true;
        props.addedList.forEach((item2: any) => {
          if (item2.hosGoodsId == item.hosGoodsId) {
            message.success('该条已存在');
            isAdd = false;
          }
        });
        if (isAdd) {
          tempGoodsList.push({
            ...item,
            initStockBatchVOS: [],
          });
        }
      } else {
        tempGoodsList.push({
          ...item,
          initStockBatchVOS: [],
        });
      }
    });
    const tableData = [...props.addedList, ...tempGoodsList];
    emit('update:visible', false);
    emit('update:addedList', tableData);
    emit('save', tableData);
  };

  // 取消或关掉弹窗
  const handleCancel = () => {
    emit('update:visible', false);
  };
</script>

<style lang="less" scoped>
  .custom-modal-drag .ant-modal {
    position: relative !important;
  }
</style>
