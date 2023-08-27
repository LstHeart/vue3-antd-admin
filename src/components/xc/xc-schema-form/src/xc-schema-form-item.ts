import type { TableActionType } from '../../xc-dynamic-table';
import type { FormSchema } from './types';

export const xcSchemaFormItemProps = {
  formModel: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  schema: {
    type: Object as PropType<FormSchema>,
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

export type XCSchemaFormItemProps = typeof xcSchemaFormItemProps;
