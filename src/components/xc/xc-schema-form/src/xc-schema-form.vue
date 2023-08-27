<template>
  <Form
    ref="schemaFormRef"
    autocomplete="off"
    v-bind="pick(getFormProps, aFormPropKeys)"
    :model="formModel"
  >
    <Row v-bind="getRowConfig" style="width: 100%">
      <slot name="formHeader"></slot>
      <slot>
        <template v-for="schemaItem in formSchemasRef" :key="schemaItem.field">
          <XCSchemaFormItem
            v-model:form-model="formModel"
            :schema="schemaItem"
            :table-instance="tableInstance"
          >
            <template v-for="item in Object.keys($slots)" #[item]="data" :key="item">
              <slot :name="item" v-bind="data || {}"></slot>
            </template>
          </XCSchemaFormItem>
        </template>
        <FormAction
          v-if="showActionButtonGroup"
          v-bind="getFormActionBindProps"
          @toggle-advanced="handleToggleAdvanced"
        >
          <template
            v-for="item in ['resetBefore', 'submitBefore', 'advanceBefore', 'advanceAfter']"
            #[item]="data"
          >
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormAction>
      </slot>
      <slot name="formFooter"></slot>
    </Row>
  </Form>
</template>

<script lang="ts" setup>
  import { useAttrs } from 'vue';
  import { pick } from 'lodash-es';
  import { Form, Row } from 'ant-design-vue';
  import XCSchemaFormItem from './xc-schema-form-item.vue';
  import FormAction from './components/form-action.vue';
  import {
    createFormContext,
    useFormState,
    useFormEvents,
    useFormMethods,
    useAdvanced,
    type XCSchemaFormType,
  } from './hooks/';
  import { xcSchemaFormProps, xcSchemaFormEmits, aFormPropKeys } from './xc-schema-form';

  defineOptions({
    name: 'XCSchemaForm',
  });

  const props = defineProps(xcSchemaFormProps);
  const emit = defineEmits(xcSchemaFormEmits);
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
  } as XCSchemaFormType;

  // 搜索表单 展开/收起 表单项hooks
  const { handleToggleAdvanced } = useAdvanced({
    instance,
    emit,
  });

  emit('register', instance);

  createFormContext(instance);

  defineExpose(instance);
</script>
