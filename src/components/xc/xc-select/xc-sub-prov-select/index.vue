<template>
  <div>
    <template v-if="column.dataIndex === props.provDataIndex"
      ><a-form-item :name="props.provDataName" :rules="props.provDataRules">
        <a-select
          v-model:value="record.provName"
          :options="record.provList"
          :field-names="{ label: 'provName', value: 'provName' }"
          @select="change(record)"
          @focus="focusProv(record)"
          style="width: 100%"
          allowClear
        ></a-select></a-form-item
    ></template>
    <!-- 二级供应商名称 -->
    <template v-else-if="column.dataIndex === props.subProvDataIndex"
      ><a-form-item :name="props.subProvDataName" :rules="props.subProvDataRules">
        <a-select
          v-model:value="record.subProvName"
          :options="record.subProvList"
          @select="subProvChange($event, record)"
          @focus="focusSubProv(record)"
          style="width: 100%"
          :field-names="{ label: 'provName', value: 'provName' }"
          allowClear
        ></a-select></a-form-item
    ></template>
  </div>
</template>
<script lang="ts" setup>
  // 一级供应商、二级供应商级联查询
  import { computed } from 'vue';
  import planApi from '@/api/purchase/plan';
  let column = computed({
    get() {
      return props.column;
    },
    set(value) {
      return value;
    },
  });
  let record = computed({
    get() {
      return props.record;
    },
    set(value) {
      return value;
    },
  });
  const props = defineProps({
    column: {
      type: Object,
      required: true,
      default: () => {},
    },
    record: {
      type: Object,
      required: true,
      default: () => {},
    },
    provDataIndex: {
      type: String,
      required: true,
      default: () => '',
    },
    subProvDataIndex: {
      type: String,
      required: true,
      default: () => '',
    },
    provDataName: {
      type: Array,
      required: false,
      default: () => [],
    },
    provDataRules: {
      type: Object,
      required: false,
      default: () => {},
    },
    subProvDataName: {
      type: Array,
      required: false,
      default: () => [],
    },
    subProvDataRules: {
      type: Object,
      required: false,
      default: () => {},
    },
  });
  const change = async (row) => {
    if (row.provName && row.provList && row.provList.length) {
      const target = row.provList.find((sub) => sub.provName === row.provName);
      target ? (row.provId = target.provId) : (row.provId = '');
    }
    const result = await planApi.mcmsGoodsSubProvList({
      hosGoodsId: row.hosGoodsId,
      provId: row.provId,
    });
    if (result.code == 0) {
      row.subProvList = result.data;
      row.subProvName = '';
      row.subProvId = '';
    } else {
      row.subProvList = [];
    }
    emit('rowChange', row);
  };
  const focusProv = async (row) => {
    const result = await planApi.mcmsGoodsInfoSupply({ id: row.hosGoodsId });
    if (result.code == 0) {
      row.provList = result.data;
    } else {
      row.provList = [];
    }
    emit('rowChange', row);
  };
  const subProvChange = (_item, row) => {
    if (row.subProvName && row.subProvList && row.subProvList.length) {
      const target = row.subProvList.find((sub) => sub.provName === row.subProvName);
      target ? (row.subProvId = target.provId) : (row.subProvId = '');
    }
    emit('rowChange', row);
  };
  // 聚焦时查询二级供应商信息
  const focusSubProv = async (row) => {
    const result = await planApi.mcmsGoodsSubProvList({
      hosGoodsId: row.hosGoodsId,
      provId: row.provId,
    });
    if (result.code == 0) {
      row.subProvList = result.data;
    } else {
      row.subProvList = [];
    }
    emit('rowChange', row);
  };
  const emit = defineEmits<{
    (e: 'subProvChange', param): void;
    (e: 'provChange', param): void;
    (e: 'rowChange', param): void;
  }>();
</script>
<style lang="less" scoped></style>
