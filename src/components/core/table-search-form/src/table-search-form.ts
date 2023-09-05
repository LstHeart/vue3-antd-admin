import { formProps, type FormProps } from 'ant-design-vue/es/form';
import type TableSearchForm from './table-search-form.vue';
// import type { ColEx } from './types/component';
import type { ExtractPropTypes, ComponentInternalInstance, CSSProperties } from 'vue';
import type { FieldMapToTime, FormSchema, RowProps } from './types/form';
import type { ButtonProps } from '@/components/basic/button';
import type { TableActionType } from '@/components/core/dynamic-table';
import { isObject } from '@/utils/is';

export const aFormPropKeys = Object.keys(formProps());

/* 表单配置 FORM */
export const tableSearchFormProps = {
  /** antd 原生form props */
  ...formProps(),
  /* 表单Name，用于label for绑定前缀 */
  name: {
    type: String,
    default: 'table_search_form',
  },
  /* 表单布局 */
  layout: {
    type: String as PropType<FormProps['layout']>,
    default: 'horizontal',
  },
  /** 表单预置字段默认值 */
  initialValues: {
    type: Object as PropType<Recordable>,
    default: () => ({}),
  },
  // 表单标签宽度  固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 0,
  },
  /* 表单项行配置 */
  rowProps: Object as PropType<RowProps>,
  /* 表单项行样式 */
  baseRowStyle: {
    type: Object as PropType<CSSProperties>,
  },
  /* 组合模式 */
  compact: { type: Boolean as PropType<boolean> },
  /** 表单项配置规则 FORM-ITEM */
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  /* 自动设定 placeHolder */
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
  /** 转化时间 */
  transformDateFunc: {
    type: Function as PropType<Fn>,
    default: (date: any) => {
      return date?.format?.('YYYY-MM-DD HH:mm:ss') ?? date;
    },
  },
  /** 时间字段Map，
   * 格式[字段名, [开始时间字段名, 结束时间字段名], 格式化字符串];
   * 例如：fieldMapToTime: [['fieldTime', ['startTime', 'endTime'], 'YYYY-MM']],
   */
  fieldMapToTime: {
    type: Array as PropType<FieldMapToTime>,
    default: () => [],
  },
  /** 显示操作列按钮（折叠、查询、重置） */
  showActionButtonGroup: { type: Boolean as PropType<boolean>, default: true },
  /** 显示收起展开按钮 */
  showAdvancedButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 显示查询按钮 */
  showSubmitButton: { type: Boolean as PropType<boolean>, default: true },
  /** 显示重置按钮 */
  showResetButton: { type: Boolean as PropType<boolean>, default: true },
  /** 查询按钮配置项 */
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,
  /** 自定义查询函数 */
  submitFunc: Function as PropType<() => Promise<void>>,
  /** 重置按钮配置项 */
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,
  /** 自定义重置函数 */
  resetFunc: Function as PropType<() => Promise<void>>,
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

  /** 动态表格实例 */
  tableInstance: {
    type: Object as PropType<TableActionType>,
  },
  /* 合并动态数据？ */
  // mergeDynamicData: {
  //   type: Object as PropType<Recordable>,
  //   default: null,
  // },
  /** 是否聚焦第一个输入框，只在第一个表单项为input的时候作用 */
  // autoFocusFirstItem: { type: Boolean as PropType<boolean> },
  // baseColProps: {
  //   type: Object as PropType<Partial<ColEx>>,
  // },
  /** 操作列Col配置（查询重置列） */
  // actionColOptions: Object as PropType<Partial<ColEx>>,
  // 是否显示高级筛选
  // isDrawerButton: { type: Boolean as PropType<boolean> },
  // rulesMessageJoinLabel: { type: Boolean as PropType<boolean>, default: true },
};

export const tableSearchFormEmits = {
  register: (exposed: ComponentInternalInstance['exposed']) => isObject(exposed),
  reset: (formModel: Recordable<any>) => isObject(formModel),
  submit: (formModel: Recordable<any>) => isObject(formModel),
  'advanced-change': () => true,
  'toggle-Drawer': () => true,
};

export type TableSearchFormEmits = typeof tableSearchFormEmits;

export type TableSearchFormEmitFn = EmitFn<TableSearchFormEmits>;

export type TableSearchFormProps<T = any> = Partial<
  ExtractPropTypes<typeof tableSearchFormProps> & {
    schemas: FormSchema<T>[];
  }
>;

// @ts-ignore:next-line
export type TableSearchFormInstance = InstanceType<typeof TableSearchForm>;
