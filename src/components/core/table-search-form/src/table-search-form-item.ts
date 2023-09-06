import type { TableActionType } from '@/components/core/dynamic-table';
import type { FormItemSchema } from './types';

export const tableSearchFormItemProps = {
  formModel: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /* 表单项配置，继承form上的schema */
  schema: {
    type: Object as PropType<FormItemSchema>,
    default: () => ({}),
  },
  // 动态表格实例
  tableInstance: {
    type: Object as PropType<TableActionType>,
  },
  // 动态表格rowKey
  tableRowKey: {
    type: [String, Number] as PropType<Key>,
  },
};

export type TableSearchFormItemProps = typeof tableSearchFormItemProps;
