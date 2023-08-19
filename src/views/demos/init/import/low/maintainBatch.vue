<template>
  <a-form
    ref="batchFormRef"
    class="xc-content return-table"
    :model="state.batchForm"
    autocomplete="off"
  >
    <DynamicTable
      :columns="batchColumns"
      :data-source="state.batchForm.tableList"
      :scroll="{ y: '100%' }"
      :table-name="'HERP_INIT_IMPORT_DETAIL_LOW_BATCH_TABLE'"
      :pagination="false"
      :show-index="false"
      @resizeColumn="handleResizeColumn"
    >
      <template #tableTopAction v-if="canEdit">
        <a-button type="primary" @click="addBatch">添加</a-button>
      </template>

      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'batchCode'">
          <a-form-item
            :name="['tableList', index, 'batchCode']"
            :rules="{
              required: true,
              message: '请输入批号!',
            }"
          >
            <a-input :placeholder="'请输入批号'" v-model:value="record.batchCode"></a-input>
          </a-form-item>
        </template>
        <template v-if="column.dataIndex === 'productDate'">
          <a-form-item
            :name="['tableList', index, 'productDate']"
            :rules="{
              required: true,
              message: '请选择生产日期!',
            }"
          >
            <a-date-picker v-model:value="record.productDate" format="YYYY-MM-DD" />
          </a-form-item>
        </template>
        <template v-if="column.dataIndex === 'expdtDate'">
          <a-form-item
            :name="['tableList', index, 'expdtDate']"
            :rules="{
              required: true,
              message: '请选择效期!',
            }"
          >
            <a-date-picker v-model:value="record.expdtDate" format="YYYY-MM-DD" />
          </a-form-item>
        </template>
        <template v-if="column.dataIndex === 'stockQty'">
          <a-form-item
            :name="['tableList', index, 'stockQty']"
            :rules="{
              required: true,
              message: '请输入库存数量!',
            }"
          >
            <a-input-number
              v-model:value="record.stockQty"
              style="margin: -5px 0"
              :min="1"
              :precision="0"
              :disabled="record.snCode"
              @change="handleQtyChange"
            />
          </a-form-item>
        </template>
        <template v-if="column.dataIndex === 'pkgDefId'">
          <a-form-item
            :name="['tableList', index, 'pkgDefId']"
            :rules="{
              required: true,
              message: '请输入选择单元含量!',
            }"
          >
            <a-select
              v-model:value="record.pkgDefId"
              :options="pkgDefList"
              :field-names="{ label: 'pkgDefName', value: 'id' }"
              style="width: 100%"
              allowClear
            ></a-select>
          </a-form-item>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-button type="link" @click="removeBatchRow(index)">移除</a-button>
        </template>
      </template>
    </DynamicTable>
  </a-form>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref, watch } from 'vue';
  import { batchColumns } from './columns';
  import { useTable } from '@/components/core/dynamic-table';

  const [DynamicTable] = useTable();

  const props = defineProps({
    batchRecord: {
      type: Object as PropType<any>,
      required: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
    pkgDefList: {
      type: Array as PropType<Array<any>>,
      required: true,
    },
  });
  const emit = defineEmits(['update:batchRecord']);

  // Data Definition
  const state = reactive({
    batchForm: {
      tableList: (props.batchRecord?.initStockBatchVOS as any[]) || [],
    },
    totalStockQty: 0,
  });
  const batchFormRef = ref();
  const tableRef = ref();

  // Common Functions(Table/Pagination/Styles...)
  const handleResizeColumn = (w, col) => {
    col.width = w;
  };

  // Life Cycle Functions
  onMounted(() => {
    console.log('props', props);
    console.log('emit', emit);
    console.log('state', state);
    // state.batchForm.tableList = props.batchRecord?.initStockBatchVOS || [];
  });

  // Get Dicts Functions

  // Business Functions
  // 添加批次
  const addBatch = () => {
    const tempData = {
      batchCode: '',
      productDate: '',
      expdtDate: '',
      stockQty: 0,
      pkgDefId: '',
    };
    // if(props.batchRecord)
    state.batchForm.tableList.push(tempData);
    console.log('ADD BATCH batchRecord', props.batchRecord);
    console.log('ADD BATCH tableList', state.batchForm.tableList);
    console.log('ADD BATCH tableRef', tableRef);

    emit('update:batchRecord', {
      ...props.batchRecord,
      initStockBatchVOS: state.batchForm.tableList,
    });
  };
  // 批次行移除
  const removeBatchRow = (index: number): void => {
    state.batchForm.tableList.splice(index, 1);
    emit('update:batchRecord', {
      ...props.batchRecord,
      initStockBatchVOS: state.batchForm.tableList,
    });
  };

  const handleQtyChange = ($event) => {
    console.log('stockQty Change', $event);
    console.log('formRef', batchFormRef.value.getFieldsValue());
  };

  watch(
    () => state.batchForm.tableList,
    (val) => {
      if (val.length) {
        state.totalStockQty = state.batchForm.tableList.reduce((pre, current) => {
          return pre + current.stockQty;
        }, 0);
      } else {
        state.totalStockQty = 0;
      }
      console.log('batchData change', state.totalStockQty);
    },
  );
</script>

<style scoped lang="less"></style>
