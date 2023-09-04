<template>
  <Col v-show="getShow.isShow" class="form-item-col">
    <Form.Item
      v-bind="{ ...schema.formItemProps }"
      :name="namePath"
      :label="renderLabelHelpMessage"
      v-label="schema"
    >
      <!-- <div class="test">6666</div> -->
      <!-- <div :class="{ 'component-prefix': itemLabelWidthProp.showInnerLabel }" v-label="getLabel"> -->
      <component
        :class="getComponentClass"
        :is="getComponent"
        :ref="setItemRef(schema.field)"
        v-bind="getComponentProps"
        v-model:[modelValueType]="modelValue"
        :allow-clear="true"
        :disabled="getDisable"
        :loading="schema.loading"
        :style="{
          '--label-Width': schema.realLabelWidth,
          width: '100%',
        }"
      >
        <template v-if="Object.is(schema.loading, true)" #notFoundContent>
          <Spin size="small" />
        </template>
        <!-- <template
          v-for="(slotFn, slotName) in getComponentSlots"
          #[slotName]="slotData"
          :key="slotName"
        >
          <component
            :is="slotFn?.({ ...getValues, slotData }) ?? slotFn"
            :key="slotName"
          ></component>
        </template> -->
      </component>
      <!-- </div> -->
    </Form.Item>
  </Col>
</template>

<script setup lang="tsx">
  import { computed, unref, toRefs, isVNode, onMounted, watch, nextTick } from 'vue';
  import { debounce } from 'lodash-es';
  import { Form, Col, Spin } from 'ant-design-vue';
  // import { useItemLabelWidth } from './hooks/useLabelWidth';
  import { componentMap, innerLabelMap } from './componentMap';
  import { createPlaceholderMessage } from './helper';
  import { useFormContext } from './hooks/useFormContext';
  import { schemaFormItemProps } from './schema-form-item';
  // import type { ComponentMapType } from './componentMap';
  import type { RenderCallbackParams, ComponentProps } from './types/';
  // import type { RuleObject } from 'ant-design-vue/es/form/';
  import { isBoolean, isString, isFunction, isArray } from '@/utils/is';
  import BasicHelp from '@/components/basic/basic-help/index.vue';
  import { vLabel } from './directives/label';

  defineOptions({
    name: 'SchemaFormItem',
  });

  const props = defineProps(schemaFormItemProps);
  const emit = defineEmits(['update:formModel']);

  // schemaForm组件实例
  const formContext = useFormContext();
  const { formPropsRef, setItemRef, updateSchema, getSchemaByFiled, appendSchemaByField } =
    formContext;

  const { schema } = toRefs(props);

  // @ts-ignore
  // const itemLabelWidthProp = useItemLabelWidth(schema, formPropsRef);

  const renderLabelHelpMessage = computed(() => {
    const { helpMessage, helpComponentProps, subLabel } = props.schema;
    console.log('isInnerLabel', isInnerLabel());
    const renderLabel = subLabel ? (
      <span>
        {getLabel.value} <span class="text-secondary">{subLabel}</span>
      </span>
    ) : isInnerLabel() ? (
      // vnodeFactory(getLabel.value)
      <span class="inner-label">{getLabel.value}</span>
    ) : (
      <span>{getLabel.value}</span>
    );
    const getHelpMessage = isFunction(helpMessage) ? helpMessage(unref(getValues)) : helpMessage;
    if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
      return renderLabel;
    }
    console.log('render help');
    return (
      <span>
        {renderLabel}
        <BasicHelp placement="top" class="mx-1" text={getHelpMessage} {...helpComponentProps} />
      </span>
    );
  });

  const namePath = computed<string[]>(() => {
    const namePath = isArray(schema.value.field)
      ? schema.value.field
      : schema.value.field.split('.');
    return namePath;
  });

  const modelValue = computed({
    get() {
      return namePath.value.reduce((prev, field) => prev?.[field], props.formModel);
    },
    set(val) {
      const namePath = schema.value.field.split('.');
      const prop = namePath.pop()!;
      const target = namePath.reduce((prev, field) => (prev[field] ??= {}), props.formModel);
      target[prop] = val;
      emit('update:formModel', props.formModel);
    },
  });

  const modelValueType = computed<string>(() => {
    const { component, componentProps } = schema.value;
    if (!isFunction(componentProps) && componentProps?.vModelKey) {
      return componentProps.vModelKey;
    }
    const isCheck = isString(component) && ['Switch', 'Checkbox'].includes(component);
    const isUpload = component === 'Upload';
    return {
      true: 'value',
      [`${isCheck}`]: 'checked',
      [`${isUpload}`]: 'file-list',
    }['true'];
  });

  const getValues = computed<RenderCallbackParams>(() => {
    const { formModel, schema, tableInstance } = props;

    const { mergeDynamicData } = unref(formPropsRef);
    return {
      field: schema.field,
      formInstance: formContext,
      tableInstance,
      tableRowKey: props.tableRowKey,
      formModel: props.tableRowKey ? formModel[props.tableRowKey] : formModel,
      values: {
        ...mergeDynamicData,
        ...formModel,
      } as Recordable,
      schema,
    };
  });

  const getShow = computed<{ isShow: boolean; isIfShow: boolean }>(() => {
    const { vShow, vIf, isAdvanced = false } = unref(schema);
    const { showAdvancedButton } = unref(formPropsRef); // 默认显示
    const itemIsAdvanced = showAdvancedButton ? (isBoolean(isAdvanced) ? isAdvanced : true) : true;

    let isShow = true;
    let isIfShow = true;

    if (isBoolean(vShow)) {
      isShow = vShow;
    }
    if (isBoolean(vIf)) {
      isIfShow = vIf;
    }
    if (isFunction(vShow)) {
      isShow = vShow(unref(getValues));
    }
    if (isFunction(vIf)) {
      isIfShow = vIf(unref(getValues));
    }
    isShow = isShow && itemIsAdvanced;
    // debugger;
    return { isShow, isIfShow };
  });

  const getDisable = computed(() => {
    const { disabled: globDisabled } = unref(formPropsRef);
    const { dynamicDisabled } = props.schema;
    const { disabled: itemDisabled = false } = unref(getComponentProps);
    let disabled = !!globDisabled || itemDisabled;
    if (isBoolean(dynamicDisabled)) {
      disabled = dynamicDisabled;
    }
    if (isFunction(dynamicDisabled)) {
      disabled = dynamicDisabled(unref(getValues));
    }
    return disabled;
  });

  // const vnodeFactory = (
  //   // component: FormSchema['componentSlots'] | FormSchema['component'],
  //   values = unref(getValues),
  // ) => {
  //   if (isString(component)) {
  //     return <>{component}</>;
  //   } else if (isVNode(component)) {
  //     return component;
  //   } else if (isFunction(component)) {
  //     return vnodeFactory((component as CustomRenderFn)(values));
  //   } else if (isObject(component)) {
  //     const compKeys = Object.keys(component);
  //     // 如果是组件对象直接return
  //     if (compKeys.some((n) => n.startsWith('_') || ['setup', 'render'].includes(n))) {
  //       return component;
  //     }
  //     return compKeys.reduce<Recordable<CustomRenderFn>>((slots, slotName) => {
  //       slots[slotName] = (...rest: any) => vnodeFactory(component[slotName], ...rest);
  //       return slots;
  //     }, {});
  //   }
  //   return component;
  // };

  /**
   * @description 当前表单项组件
   */
  const getComponent = computed(() => {
    const component = props.schema.component;
    return componentMap[component];
    // return isString(component)
    //   ? componentMap[component] ?? vnodeFactory(component)
    //   : vnodeFactory(component);
  });

  const isInnerLabel = () => {
    const component = props.schema.component;
    return innerLabelMap[component] == getComponent.value;
    // const innerLabelCompList = ['AInput', 'AInputNumber', 'ASelect', 'ADatePicker', 'ARangePicker'];
    // return innerLabelCompList.includes(getComponent.value.name);
  };

  const getComponentClass = computed(() => {
    const component = props.schema.component as string;
    const compName = componentMap[component].name;
    console.log('compName', compName);

    return `form-item-comp-${compName}`;
  });
  /**
   * @description 当前表单项组件的插槽
   */
  // const getComponentSlots = computed<Recordable<CustomRenderFn>>(() => {
  //   const componentSlots = props.schema.componentSlots ?? {};
  //   return isString(componentSlots) || isVNode(componentSlots)
  //     ? {
  //         default: (...rest: any) => vnodeFactory(componentSlots, rest),
  //       }
  //     : vnodeFactory(componentSlots);
  // });

  const getLabel = computed(() => {
    const label = props.schema.label;
    return isFunction(label) ? label(unref(getValues)) : label;
  });

  /**
   * @description 表单组件props
   */
  const getComponentProps = computed(() => {
    const { schema } = props;
    let { componentProps = {}, component } = schema;

    if (isFunction(componentProps)) {
      componentProps = componentProps(unref(getValues)) ?? {};
      if (isFunction(componentProps.onChange)) {
        const { onChange } = componentProps;
        componentProps.onChange = (e) => {
          handleChangeBefore(e, schema);
          return onChange(e);
        };
      }
    }

    if (component === 'InputNumber') {
      const { name } = unref(formPropsRef);
      componentProps = Object.assign({ id: `${name}_${schema.field}` }, componentProps);
    }

    if (component !== 'RangePicker' && isString(component)) {
      componentProps.placeholder ??= createPlaceholderMessage(component, getLabel.value);
    }
    // if (schema.component === 'Divider') {
    //   componentProps = Object.assign({ id: 'horizontal' }, componentProps, {
    //     orientation: 'left',
    //     plain: true,
    //   });
    // }
    if (isVNode(getComponent.value)) {
      Object.assign(componentProps, getComponent.value.props);
    }

    return componentProps;
  });

  /**
   * @description 表单组件事件
   */
  // const componentEvents = computed(() => {
  //   const componentProps = props.schema?.componentProps || {};
  //   const events = Object.keys(componentProps).reduce((prev, key) => {
  //     if (/on([A-Z])/.test(key)) {
  //       // eg: onChange => change
  //       const eventKey = key.replace(/on([A-Z])/, '$1').toLocaleLowerCase();
  //       prev[eventKey] = componentProps[key];
  //     }
  //     return prev;
  //   }, {});
  //   return events;
  // });

  const fetchRemoteData = async (request) => {
    if (request) {
      const { component } = unref(schema);

      try {
        const newSchema = {
          ...unref(schema),
          loading: true,
          componentProps: {
            ...unref(getComponentProps),
            options: [],
          } as ComponentProps,
        };
        updateSchema(newSchema);
        const result = await request(unref(getValues));
        if (['Select', 'RadioGroup', 'CheckBoxGroup'].some((n) => n === component)) {
          newSchema.componentProps.options = result;
        } else if (['TreeSelect', 'Tree'].some((n) => n === component)) {
          newSchema.componentProps.treeData = result;
        }
        if (newSchema.componentProps) {
          newSchema.componentProps.requestResult = result;
        }
        newSchema.loading = false;
        updateSchema(newSchema);
      } finally {
        nextTick(() => {
          schema.value.loading = false;
        });
      }
    }
  };

  const initRequestConfig = () => {
    const request = getComponentProps.value.request;
    if (request) {
      if (isFunction(request)) {
        fetchRemoteData(request);
      } else {
        const { watchFields = [], options = {}, wait = 0, callback } = request;
        const params = watchFields.map((field) => () => props.formModel[field]);
        watch(
          params,
          debounce(() => {
            fetchRemoteData(callback);
          }, wait),
          {
            ...options,
          },
        );
      }
    }
  };

  onMounted(() => {
    if (!getSchemaByFiled(props.schema.field)) {
      appendSchemaByField(props.schema);
    }
    initRequestConfig();
  });

  const handleChangeBefore = ($event, schema) => {
    console.log('$event', $event);
    console.log('schema', schema);
  };
</script>

<style lang="less" scoped>
  // .component-prefix::before {
  //   color: red;
  //   width: var(--label-Width);
  //   content: attr(data-label);
  // }
  .form-item-col {
    /* 显示适配，可视宽度小于1440 每行显示4个 */
    @media screen and(max-width: 1440px) {
      display: block;
      flex: 0 0 25%;
      max-width: 25%;
    }
    /** 显示适配，可视宽度超过1440 每行显示5个 */
    @media screen and(min-width: 1440px) {
      display: block;
      flex: 0 0 20%;
      max-width: 20%;
    }

    /* 表单项间隔 */
    .ant-form-item {
      margin-right: 16px !important;
    }
    :deep(.ant-form-item-label:has(.inner-label)) {
      & {
        display: flex;
        background-color: rgb(240, 235, 235);
        position: absolute;
        z-index: 2;
        padding-left: 8px;
        // pointer-events: none;
        label::after {
          content: ':';
        }
      }
    }

    :deep(.ant-form-item-control-input-content) {
      .paddingL {
        // padding-left: var(--label-Width) !important;
        padding-left: var(--label-Width) !important;
      }
      // 组件设定偏移
      .form-item-comp-AInput,
      .form-item-comp-ADatePicker,
      .form-item-comp-ASelect > .ant-select-selector,
      .form-item-comp-ARangePicker,
      .form-item-comp-ACascader {
        .paddingL();
      }
      .form-item-comp-AInputNumber {
        .paddingL();
        // padding-left: calc(var(--label-Width) - 6px) !important;
      }
      .form-item-comp-ATreeSelect > .ant-select-selector {
        .paddingL();
        // padding-left: calc(var(--label-Width) + 56px) !important;
      }
      // .ant-input-affix-wrapper {
      //   padding-left: 0px !important;
      //   padding-right: 8px !important;
      // }
      // .form-item-comp > .ant-input,
      // // .ant-input-affix-wrapper,
      // .ant-select-selector>.ant-select-selection-search,
      // .ant-select-selector>.ant-select-selection-item,
      // .ant-select-selector>.ant-select-selection-placeholder,
      // .ant-select-auto-complete > span,
      // .ant-picker-range,
      // .ant-picker {
      //   .paddingL();
      // }
      // .form-item-comp {
      //   .ant-select-clear {
      //     padding-right: 11px !important;
      //   }
      //   .ant-select-selection-search {
      //     left: 0px !important;
      //     right: 0px !important;
      //   }
      // }
      // .ant-select-single:not(.ant-select-customize-input) .ant-select-selector {
      //   padding: 0px !important;
      // }
    }
  }
</style>
