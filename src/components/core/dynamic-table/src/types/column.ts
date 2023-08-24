import type { TableColumnType } from 'ant-design-vue';
import type { VNode } from 'vue';
import type { FormSchema } from '@/components/core/schema-form';
import type { ActionItem } from './tableAction';
import { ColumnsType } from 'ant-design-vue/es/table';

export type ColumnType<T> = ColumnsType<T>[number];
export type CustomRenderParams<T = any> = Omit<
  Parameters<NonNullable<ColumnType<T>['customRender']>>[number],
  'column'
> & { column: TableColumn<T> };

export type ColumnParams<T = any> = {
  record: T;
  text: string;
  index: number;
  column: TableColumn<T>;
};

/**
 * 表格属性
 */
export interface TableColumn<T = Indexable> extends Omit<TableColumnType<T>, 'dataIndex' | 'key'> {
  title: string;
  dataIndex: keyof T | '$action';
  key?: keyof T | '$action';
  width?: number;
  /** 指定搜索的字段 */
  searchField?: string;
  /** 在查询表单中不展示此项 */
  hideInSearch?: boolean;
  /** 在 Table 中不展示此列 */
  hideInTable?: boolean;
  sort?: number;
  /** 传递给 Form.Item 的配置,可以配置 rules */
  formItemProps?: Partial<FormSchema<T>>;
  bodyCell?: (params: ColumnParams<T>) => VNode | string;
  headerCell?: (params: ColumnParams<T>) => VNode | string;
  actions?: (params: ColumnParams<T>) => ActionItem[];
  /** 传递给可编辑表格 Form.Item 的配置,可以配置 rules */
  editFormItemProps?: Partial<FormSchema<T>> & {
    /**
     * 是否继承于搜索表单`TableColumn.formItemProps`的所有属性,为深拷贝合并
     * 值为`true`时的行为伪代码如下：
     * ```js
     * Object.assign({}, TableColumn.formItemProps, TableColumn.editFormItemProps)
     * ```
     * @defaultValue 默认值为`true`
     * */
    extendSearchFormProps?: boolean;
  };
  /** 当前单元格是否允许被编辑 */
  editable?: boolean | ((params: CustomRenderParams<T>) => boolean);
  /** 当前单元格是否默认开启编辑，仅 `editableType`为`cell`时有效 */
  defaultEditable?: boolean;
}

export enum ColumnKeyFlag {
  ACTION = 'ACTION',
  INDEX = 'INDEX',
}
export type ColumnKeyFlagType = `${ColumnKeyFlag}`;
