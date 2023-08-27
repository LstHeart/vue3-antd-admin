import { provide, inject } from 'vue';
import type { XCDynamicTableType } from './index';

const key = Symbol('xc-dynamic-table');

export function createTableContext(instance: XCDynamicTableType) {
  provide(key, instance);
}

export function useTableContext() {
  return inject(key) as XCDynamicTableType;
}
