<template>
  <div>
    <a-card>
      <TableSearchForm
        ref="dynamicForm"
        v-bind="formProps"
        @submit="confirm"
        @toggle-advanced="(e) => $emit('toggle-advanced', e)"
      >
      </TableSearchForm>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { schemas } from './form-schema';
  import type {
    TableSearchFormProps,
    TableSearchFormInstance,
  } from '@/components/core/table-search-form';
  import { TableSearchForm } from '@/components/core/table-search-form';

  defineOptions({
    name: 'DemosFormDynamicSearchForm',
  });

  /**
   * @description 基础表单
   */
  const dynamicForm = ref<TableSearchFormInstance>();

  const formProps: TableSearchFormProps = {
    schemas,
    fieldMapToTime: [['field5', ['startTime', 'endTime'], 'YYYY-MM']],
    // labelWidth: 120,
    // actionColOptions: { span: 24 },
  };

  // 点击提交
  function confirm() {
    console.log('dynamicForm.value', dynamicForm.value?.formModel);

    dynamicForm.value?.validate().then(() => message.success('验证通过！'));
  }
</script>

<style lang="less" scoped>
  .btn-rows {
    button {
      margin-right: 12px;
    }
  }
</style>
