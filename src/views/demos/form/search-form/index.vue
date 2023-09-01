<template>
  <div>
    <a-card>
      <schema-form
        ref="dynamicForm"
        v-bind="formProps"
        @submit="confirm"
        @toggle-advanced="(e) => $emit('toggle-advanced', e)"
      >
      </schema-form>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { schemas } from './form-schema';
  import type { SchemaFormProps, SchemaFormInstance } from '@/components/core/table-search-form';
  import { SchemaForm } from '@/components/core/table-search-form';

  defineOptions({
    name: 'DemosFormDynamicSearchForm',
  });

  /**
   * @description 基础表单
   */
  const dynamicForm = ref<SchemaFormInstance>();

  const formProps: SchemaFormProps = {
    schemas,
    labelWidth: 120,
    actionColOptions: { span: 24 },
    // hideAdvanceBtn: false,
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
