import { computed, reactive, ref, unref, watchEffect } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { SetupContext, DefineComponent } from 'vue';
import type { AdvanceState } from '../types/hooks';
import type { TableSearchFormProps } from '../table-search-form';
import type { FormInstance } from 'ant-design-vue';
import type { ComponentProps, RenderCallbackParams } from '../types';
import { isFunction } from '@/utils/is';

export type FormState = ReturnType<typeof useFormState>;

export type useFormStateParams = {
  props: TableSearchFormProps;
  attrs: SetupContext['attrs'];
};

export const useFormState = ({ props, attrs }: useFormStateParams) => {
  // TODO 将formSchema克隆一份，避免修改原有的formSchema
  const formPropsRef = ref<TableSearchFormProps>(cloneDeep(props));
  /** 表单项数据 */
  const formModel = reactive({ ...props.initialValues });
  // 表单默认数据
  const defaultFormValues = reactive({ ...props.initialValues });
  // 表单实例
  const tableSearchFormRef = ref<FormInstance>();
  // 缓存的表单值，用于恢复form-item v-if为true后的值
  const cacheFormModel = { ...props.initialValues };
  // 将所有的表单组件实例保存起来
  const compRefMap = new Map<string, DefineComponent<any>>();
  const compItemRefMap = new Map<string, any>();
  // 初始时的componentProps，用于updateSchema更新时不覆盖componentProps为函数时的值
  const originComponentPropsFnMap = new Map<
    string,
    (opt: RenderCallbackParams) => ComponentProps
  >();

  // 展开/收起状态
  const advanceState = reactive<AdvanceState>({
    isAdvanced: true,
    hideAdvanceBtn: false, // 初始不隐藏
    isLoad: false,
    actionSpan: 5,
  });

  // 获取表单所有属性
  const getFormProps = computed(() => {
    // debugger;
    return {
      ...attrs,
      ...formPropsRef.value,
    } as TableSearchFormProps;
  });

  // 获取栅栏Row配置
  const getRowConfig = computed((): Recordable => {
    const { baseRowStyle = {}, rowProps } = unref(getFormProps);
    return {
      style: baseRowStyle,
      ...rowProps,
    };
  });

  const getFormActionBindProps = computed((): Recordable => {
    // debugger;
    return {
      ...getFormProps.value,
      ...advanceState,
    };
  });

  watchEffect(() => {
    formPropsRef.value.schemas?.forEach((item) => {
      if (!originComponentPropsFnMap.has(item.field) && isFunction(item.componentProps)) {
        originComponentPropsFnMap.set(item.field, item.componentProps);
      }
    });
  });

  return {
    formModel,
    defaultFormValues,
    tableSearchFormRef,
    formPropsRef,
    cacheFormModel,
    compRefMap,
    compItemRefMap,
    getFormProps,
    advanceState,
    getRowConfig,
    getFormActionBindProps,
    originComponentPropsFnMap,
    formSchemasRef: computed(() => unref(formPropsRef).schemas || []),
  };
};
