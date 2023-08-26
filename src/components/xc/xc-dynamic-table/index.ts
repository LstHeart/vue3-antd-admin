import XCDynamicTable from './src/xc-dynamic-table.vue';
import type { DefineComponent, Ref } from 'vue';
import type { XCDynamicTableInstance, XCDynamicTableProps } from './src/xc-dynamic-table';
export { XCDynamicTable };

export * from './src/types/';
export * from './src/hooks/';
export * from './src/xc-dynamic-table';

export type XCDynamicTableRef = Ref<XCDynamicTableInstance>;

// TODO 暂时是为了解决ts error(如果你有解决方法 请务必联系我~): JSX element type 'DynamicTable' does not have any construct or call signatures.
export default XCDynamicTable as unknown as DefineComponent<Partial<XCDynamicTableProps>>;
