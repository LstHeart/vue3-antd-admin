import { formProps, type FormProps } from 'ant-design-vue/es/form';
import type SchemaForm from './schema-form.vue';
import type { ColEx } from './types/component';
import type { ExtractPropTypes, ComponentInternalInstance, CSSProperties } from 'vue';
import type { FieldMapToTime, FormSchema, RowProps } from './types/form';
import type { ButtonProps } from '@/components/basic/button';
import type { TableActionType } from '@/components/core/dynamic-table';
import { isObject } from '@/utils/is';

export const aFormPropKeys = Object.keys(formProps());
type ButtonOptions = Partial<ButtonProps> & { text: string };

/* 表单配置 FORM */
export const schemaFormProps = {
  /** antd 原生form props */
  ...formProps(),
  name: {
    type: String,
    default: 'table_search_form',
  },
  layout: {
    type: String as PropType<FormProps['layout']>,
    default: 'horizontal',
  },
  /** 预置字段默认值 */
  initialValues: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // 标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  compact: { type: Boolean as PropType<boolean> },
  /** 表单项配置规则 FORM-ITEM */
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  mergeDynamicData: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  // baseColProps: {
  //   type: Object as PropType<Partial<ColEx>>,
  // },
  autoSetPlaceHolder: { type: Boolean as PropType<boolean>, default: true },
  /** 在INPUT组件上单击回车时，是否自动提交 */
  autoSubmitOnEnter: { type: Boolean as PropType<boolean>, default: false },
  submitOnReset: { type: Boolean as PropType<boolean> },
  submitOnChange: { type: Boolean as PropType<boolean> },
  /** 禁用表单 */
  disabled: { type: Boolean as PropType<boolean> },
  emptySpan: {
    type: [Number, Object] as PropType<number>,
    default: 0,
  },
  /** 是否显示收起展开按钮 */
  showAdvancedButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 查询按钮配置项 */
  submitButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({
      text: '查询',
    }),
  },
  /** 重置按钮配置项 */
  resetButtonOptions: {
    type: Object as PropType<ButtonOptions>,
    default: () => ({
      text: '重置',
    }),
  },

  /** 转化时间 */
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },
  rulesMessageJoinLabel: { type: Boolean as PropType<boolean>, default: true },
  /** 超过2行自动折叠 */
  autoAdvancedLine: {
    type: Number as PropType<number>,
    default: 2,
  },
  /** 不受折叠影响的行数 */
  alwaysShowLines: {
    type: Number as PropType<number>,
    default: 1,
  },

  /** 是否显示操作按钮 */
  showActionButtonGroup: { type: Boolean as PropType<boolean>, default: true },
  /** 操作列Col配置 */
  actionColOptions: Object as PropType<Partial<ColEx>>,
  /** 显示重置按钮 */
  showResetButton: { type: Boolean as PropType<boolean>, default: true },
  /** 是否聚焦第一个输入框，只在第一个表单项为input的时候作用 */
  autoFocusFirstItem: { type: Boolean as PropType<boolean> },
  /** 显示确认按钮 */
  showSubmitButton: { type: Boolean as PropType<boolean>, default: true },
  /** 自定义重置函数 */
  resetFunc: Function as PropType<() => Promise<void>>,
  submitFunc: Function as PropType<() => Promise<void>>,
  /** 动态表格实例 */
  tableInstance: {
    type: Object as PropType<TableActionType>,
  },

  rowProps: Object as PropType<RowProps>,
  // 是否显示高级筛选
  isDrawerButton: { type: Boolean as PropType<boolean> },
};

export const schemaFormEmits = {
  register: (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  reset: (formModel: Recordable<any>) => isObject(formModel),
  submit: (formModel: Recordable<any>) => isObject(formModel),
  'advanced-change': () => true,
  'toggle-Drawer': () => true,
};

export type SchemaFormEmits = typeof schemaFormEmits;

export type SchemaFormEmitFn = EmitFn<SchemaFormEmits>;

export type SchemaFormProps<T = any> = Partial<
  ExtractPropTypes<typeof schemaFormProps> & {
    schemas: FormSchema<T>[];
  }
>;

// @ts-ignore:next-line
export type SchemaFormInstance = InstanceType<typeof SchemaForm>;