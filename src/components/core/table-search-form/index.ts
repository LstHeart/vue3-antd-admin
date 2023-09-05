import TableSearchForm from './src/table-search-form.vue';
import TableSearchFormItem from './src/table-search-form-item.vue';
import type { DefineComponent } from 'vue';
import type { TableSearchFormProps } from './src/table-search-form';

export * from './src/types/';
export * from './src/table-search-form';
export * from './src/table-search-form-item';
export * from './src/hooks/';
export * from './src/components/';

export { TableSearchForm, TableSearchFormItem };

// TODO 暂时是为了解决ts error(如果你有解决方法 请务必联系我~): JSX element type 'TableSearchForm' does not have any construct or call signatures.
export default TableSearchForm as unknown as DefineComponent<Partial<TableSearchFormProps>>;
