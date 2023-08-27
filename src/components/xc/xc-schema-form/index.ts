import XCSchemaForm from './src/xc-schema-form.vue';
import XCSchemaFormItem from './src/xc-schema-form-item.vue';
import type { DefineComponent } from 'vue';
import type { XCSchemaFormProps } from './src/xc-schema-form';

export * from './src/types/';
export * from './src/xc-schema-form';
export * from './src/xc-schema-form-item';
export * from './src/hooks/';
export * from './src/components/';

export { XCSchemaForm, XCSchemaFormItem };

// TODO 暂时是为了解决ts error(如果你有解决方法 请务必联系我~): JSX element type 'SchemaForm' does not have any construct or call signatures.
export default XCSchemaForm as unknown as DefineComponent<Partial<XCSchemaFormProps>>;
