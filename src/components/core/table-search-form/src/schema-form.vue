<template>
  <Form
    ref="schemaFormRef"
    autocomplete="off"
    v-bind="pick(getFormProps, aFormPropKeys)"
    :model="formModel"
  >
    <Row v-bind="getRowConfig" style="width: 100%">
      <!-- 表单项 -->
      <template v-for="schemaItem in formSchemasRef" :key="schemaItem.field">
        <SchemaFormItem
          v-model:form-model="formModel"
          :schema="schemaItem"
          :table-instance="tableInstance"
        >
          <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </SchemaFormItem>
      </template>

      <!-- 展开、收起、查询、重置按钮 -->
      <FormAction
        v-if="showActionButtonGroup"
        v-bind="getFormActionBindProps"
        @toggle-advanced="handleToggleAdvanced"
      >
      </FormAction>
    </Row>
  </Form>
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';
  import { pick } from 'lodash-es';
  import { Form, Row } from 'ant-design-vue';
  import SchemaFormItem from './schema-form-item.vue';
  import {
    createFormContext,
    useFormState,
    useFormEvents,
    useFormMethods,
    useAdvanced,
    type SchemaFormType,
  } from './hooks/';
  import { schemaFormProps, schemaFormEmits, aFormPropKeys } from './schema-form';
  import FormAction from './components/form-action.vue';

  defineOptions({
    name: 'SchemaForm',
  });

  const props = defineProps(schemaFormProps);
  const emit = defineEmits(schemaFormEmits);
  const attrs = useAttrs();

  // 表单内部状态
  const formState = useFormState({ props, attrs });
  const {
    formModel,
    getRowConfig,
    schemaFormRef,
    getFormProps,
    getFormActionBindProps,
    formSchemasRef,
  } = formState;
  console.log('🚀 ~ file: schema-form.vue:100 ~ formSchemasRef:', formSchemasRef);

  // 表单内部方法
  const formMethods = useFormMethods({ ...formState });
  const { initFormValues, handleFormValues } = formMethods;

  // 初始化表单默认值
  initFormValues();

  // a-form表单事件二次封装和扩展
  const formEvents = useFormEvents({ ...formState, emit, handleFormValues });

  // 当前组件所有的状态和方法
  const instance = {
    ...formState,
    ...formEvents,
    ...formMethods,
  } as SchemaFormType;

  // 搜索表单 展开/收起 表单项hooks
  const { handleToggleAdvanced } = useAdvanced({
    instance,
    emit,
  });

  emit('register', instance);

  createFormContext(instance);

  defineExpose(instance);
</script>

<style lang="less" scoped>
  // .ant-col-4-8 {
  //   display: block;
  //   flex: 0 0 20%;
  //   max-width: 20%;
  // }
  // .ant-col-6 {
  //   display: block;
  //   flex: 0 0 20%;
  //   max-width: 20%;
  // }
</style>
