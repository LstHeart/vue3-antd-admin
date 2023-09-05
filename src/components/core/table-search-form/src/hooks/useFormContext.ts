import { provide, inject } from 'vue';
import type { TableSearchFormType } from './';

const key = Symbol('table-search-form');

export async function createFormContext(instance: TableSearchFormType) {
  provide(key, instance);
}

export function useFormContext(formProps = {}) {
  return inject(key, formProps) as TableSearchFormType;
}
