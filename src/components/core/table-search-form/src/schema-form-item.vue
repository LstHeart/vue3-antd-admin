<template>
  <Col v-if="getShow.isIfShow" v-show="getShow.isShow" v-bind="schema.colProps">
    <Divider v-if="schema.component === 'Divider'" v-bind="getComponentProps">
      <component :is="renderLabelHelpMessage"></component>
    </Divider>
    <Form.Item
      v-else
      v-bind="{ ...schema.formItemProps }"
      :name="namePath"
      :label-col="itemLabelWidthProp.labelCol"
      :wrapper-col="itemLabelWidthProp.wrapperCol"
      :rules="getRules"
    >
      <slot v-if="schema.slot" :name="schema.slot" v-bind="getValues"> </slot>
      <component
        :class="{ 'component-prefix': itemLabelWidthProp.showInnerLabel }"
        :style="{ '--width': itemLabelWidthProp.innerLabelWidth }"
        :is="getComponent"
        v-else-if="getComponent"
        :ref="setItemRef(schema.field)"
        v-bind="getComponentProps"
        v-model:[modelValueType]="modelValue"
        :allow-clear="true"
        :disabled="getDisable"
        :loading="schema.loading"
        v-on="componentEvents"
        v-label="getLabel"
      >
        <template v-if="Object.is(schema.loading, true)" #notFoundContent>
          <Spin size="small" />
        </template>
        <template
          v-for="(slotFn, slotName) in getComponentSlots"
          #[slotName]="slotData"
          :key="slotName"
          >999
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
  import { cloneDeep, debounce } from 'lodash-es';
  import { Form, Col, Spin, Divider } from 'ant-design-vue';
  import { useItemLabelWidth } from './hooks/useLabelWidth';
  import { componentMap } from './componentMap';
  import { createPlaceholderMessage } from './helper';
  import { useFormContext } from './hooks/useFormContext';
  import { schemaFormItemProps } from './schema-form-item';
  import type { ComponentMapType } from './componentMap';
  import type { CustomRenderFn, FormSchema, RenderCallbackParams, ComponentProps } from './types/';
  import type { RuleObject } from 'ant-design-vue/es/form/';
  import { isBoolean, isNull, isObject, isString, isFunction, isArray } from '@/utils/is';
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
    const { showAdvancedButton } = unref(formPropsRef);
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
  const componentEvents = computed(() => {
    const componentProps = props.schema?.componentProps || {};
    return Object.keys(componentProps).reduce((prev, key) => {
      if (/on([A-Z])/.test(key)) {
        // eg: onChange => change
        const eventKey = key.replace(/on([A-Z])/, '$1').toLocaleLowerCase();
        console.log(
          '🚀 ~ file: schema-form-item.vue:259 ~ returnObject.keys ~ eventKey:',
          eventKey,
        );
        prev[eventKey] = componentProps[key];
      }
      return prev;
    }, {});
  });

  const renderLabelHelpMessage = computed(() => {
    const { helpMessage, helpComponentProps, subLabel } = props.schema;
    const renderLabel = subLabel ? (
      <span>
        {getLabel.value} <span class="text-secondary">{subLabel}</span>
      </span>
    ) : (
      vnodeFactory(getLabel.value)
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

  function setComponentRuleType(
    rule: RuleObject,
    component: ComponentMapType,
    valueFormat: string,
  ) {
    if (['DatePicker', 'MonthPicker', 'WeekPicker', 'TimePicker'].includes(component)) {
      rule.type = valueFormat ? 'string' : 'object';
    } else if (['RangePicker', 'Upload', 'CheckboxGroup', 'TimePicker'].includes(component)) {
      rule.type = 'array';
    } else if (['InputNumber'].includes(component)) {
      rule.type = 'number';
    }
  }

  const getRules = computed(() => {
    const {
      rules: defRules = [],
      component,
      rulesMessageJoinLabel,
      dynamicRules,
      required,
    } = props.schema;

    if (isFunction(dynamicRules)) {
      return dynamicRules(unref(getValues)) as RuleObject[];
    }

    let rules = cloneDeep<RuleObject[]>(defRules);
    const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = unref(formPropsRef);

    const joinLabel = Reflect.has(unref(formPropsRef), 'rulesMessageJoinLabel')
      ? rulesMessageJoinLabel
      : globalRulesMessageJoinLabel;
    const defaultMsg = isString(component)
      ? `${createPlaceholderMessage(component, getLabel.value)}${joinLabel ? getLabel.value : ''}`
      : undefined;

    function validator(rule: any, value: any) {
      const msg = rule.message || defaultMsg;

      if (value === undefined || isNull(value)) {
        // 空值
        return Promise.reject(msg);
      } else if (Array.isArray(value) && value.length === 0) {
        // 数组类型
        return Promise.reject(msg);
      } else if (typeof value === 'string' && value.trim() === '') {
        // 空字符串
        return Promise.reject(msg);
      } else if (
        typeof value === 'object' &&
        Reflect.has(value, 'checked') &&
        Reflect.has(value, 'halfChecked') &&
        Array.isArray(value.checked) &&
        Array.isArray(value.halfChecked) &&
        value.checked.length === 0 &&
        value.halfChecked.length === 0
      ) {
        // 非关联选择的tree组件
        return Promise.reject(msg);
      }
      return Promise.resolve();
    }

    const getRequired = isFunction(required) ? required(unref(getValues)) : required;

    if ((!rules || rules.length === 0) && getRequired) {
      rules = [{ required: getRequired, validator }];
    }

    const requiredRuleIndex: number = rules.findIndex(
      (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
    );

    if (requiredRuleIndex !== -1) {
      const rule = rules[requiredRuleIndex];

      if (component && isString(component)) {
        if (!Reflect.has(rule, 'type')) {
          rule.type = component === 'InputNumber' ? 'number' : 'string';
        }

        rule.message = rule.message || defaultMsg;

        if (component.includes('Input') || component.includes('Textarea')) {
          rule.whitespace = true;
        }
        const valueFormat = unref(getComponentProps)?.valueFormat;
        setComponentRuleType(rule, component, valueFormat);
      }
    }

    // Maximum input length rule check
    const characterInx = rules.findIndex((val) => val.max);
    if (characterInx !== -1 && !rules[characterInx].validator) {
      rules[characterInx].message =
        rules[characterInx].message || `字符数应小于${[rules[characterInx].max] as Recordable}位`;
    }

    return rules;
  });

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
</script>

<style lang="less" scoped>
  .component-prefix::before {
    color: red;
    width: var(--width);
    content: attr(data-label);
  }
</style>
