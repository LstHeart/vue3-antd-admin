import { provide, inject } from 'vue';
import type { XCSchemaFormType } from './';

const key = Symbol('xc-schema-form');

export async function createFormContext(instance: XCSchemaFormType) {
  provide(key, instance);
}

export function useFormContext(formProps = {}) {
  return inject(key, formProps) as XCSchemaFormType;
}
