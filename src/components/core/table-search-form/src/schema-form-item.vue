<template>
  <Col v-show="getShow.isShow" class="form-item-col">
    <Form.Item v-bind="{ ...schema.formItemProps }" :name="namePath">
      <component
        :class="{ 'component-prefix': itemLabelWidthProp.showInnerLabel }"
        :style="{ '--width': itemLabelWidthProp.innerLabelWidth }"
        :is="getComponent"
        :ref="setItemRef(schema.field)"
        v-bind="getComponentProps"
        v-model:[modelValueType]="modelValue"
        :allow-clear="true"
        :disabled="getDisable"
        :loading="schema.loading"
        v-label="getLabel"
      >
        <template v-if="Object.is(schema.loading, true)" #notFoundContent>
          <Spin size="small" />
        </template>
        <template
          v-for="(slotFn, slotName) in getComponentSlots"
          #[slotName]="slotData"
          :key="slotName"
        >
          <component
            :is="slotFn?.({ ...getValues, slotData }) ?? slotFn"
            :key="slotName"
          ></component>
        </template>
      </component>
    </Form.Item>
  </Col>
</template>

<script setup lang="tsx">
  import { computed, unref, toRefs, isVNode, onMounted, watch, nextTick } from 'vue';
  import { debounce } from 'lodash-es';
  import { Form, Col, Spin } from 'ant-design-vue';
  import { useItemLabelWidth } from './hooks/useLabelWidth';
  import { componentMap } from './componentMap';
  import { createPlaceholderMessage } from './helper';
  import { useFormContext } from './hooks/useFormContext';
  import { schemaFormItemProps } from './schema-form-item';
  // import type { ComponentMapType } from './componentMap';
  import type { CustomRenderFn, FormSchema, RenderCallbackParams, ComponentProps } from './types/';
  // import type { RuleObject } from 'ant-design-vue/es/form/';
  import { isBoolean, isObject, isString, isFunction, isArray } from '@/utils/is';
  // import BasicHelp from '@/components/basic/basic-help/index.vue';
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
  const itemLabelWidthProp = useItemLabelWidth(schema, formPropsRef);

  const namePath = computed<string[]>(() => {
    return isArray(schema.value.field) ? schema.value.field : schema.value.field.split('.');
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
    debugger;
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

  const vnodeFactory = (
    component: FormSchema['componentSlots'] | FormSchema['component'],
    values = unref(getValues),
  ) => {
    if (isString(component)) {
      return <>{component}</>;
    } else if (isVNode(component)) {
      return component;
    } else if (isFunction(component)) {
      return vnodeFactory((component as CustomRenderFn)(values));
    } else if (isObject(component)) {
      const compKeys = Object.keys(component);
      // 如果是组件对象直接return
      if (compKeys.some((n) => n.startsWith('_') || ['setup', 'render'].includes(n))) {
        return component;
      }
      return compKeys.reduce<Recordable<CustomRenderFn>>((slots, slotName) => {
        slots[slotName] = (...rest: any) => vnodeFactory(component[slotName], ...rest);
        return slots;
      }, {});
    }
    return component;
  };

  /**
   * @description 当前表单项组件
   */
  const getComponent = computed(() => {
    const component = props.schema.component;
    return isString(component)
      ? componentMap[component] ?? vnodeFactory(component)
      : vnodeFactory(component);
  });

  /**
   * @description 当前表单项组件的插槽
   */
  const getComponentSlots = computed<Recordable<CustomRenderFn>>(() => {
    const componentSlots = props.schema.componentSlots ?? {};
    return isString(componentSlots) || isVNode(componentSlots)
      ? {
          default: (...rest: any) => vnodeFactory(componentSlots, rest),
        }
      : vnodeFactory(componentSlots);
  });

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
    }

    if (component !== 'RangePicker' && isString(component)) {
      componentProps.placeholder ??= createPlaceholderMessage(component, getLabel.value);
    }
    if (schema.component === 'Divider') {
      componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
        orientation: 'left',
        plain: true,
      });
    }
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
  //       console.log('🚀 ~ file: schema-form-item.vue:252 ~ events ~ eventKey:', eventKey);
  //       prev[eventKey] = componentProps[key];
  //     }
  //     return prev;
  //   }, {});

  //   // console.log('🚀 ~ file: schema-form-item.vue:256 ~ events ~ events:', events);

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

  // const handleChange = ($event) => {
  //   console.log('$event', $event);
  // };
</script>

<style lang="less" scoped>
  .component-prefix::before {
    color: red;
    width: var(--width);
    content: attr(data-label);
  }
  .form-item-col {
    @media screen and(max-width: 1440px) {
      display: block;
      flex: 0 0 25%;
      max-width: 25%;
    }
    @media screen and(min-width: 1440px) {
      display: block;
      flex: 0 0 20%;
      max-width: 20%;
    }
  }
</style>
