import { nextTick, ref, unref, watch } from 'vue';
import { isEmpty } from 'lodash-es';
import SchemaForm from '../../index';
import type { Ref, SetupContext } from 'vue';
import type { XCSchemaFormInstance, XCSchemaFormProps } from '../xc-schema-form';

export function useForm(props?: Partial<XCSchemaFormProps>) {
  const formRef = ref<XCSchemaFormInstance>({} as XCSchemaFormInstance);

  async function getFormInstance() {
    await nextTick();
    const form = unref(formRef);
    if (isEmpty(form)) {
      console.error('未获取表单实例!');
    }
    return form;
  }
  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick();
        const formInstance = await getFormInstance();
        formInstance.setSchemaFormProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
      flush: 'post',
    },
  );

  const methods = new Proxy<Ref<XCSchemaFormInstance>>(formRef, {
    get(target, key) {
      if (Reflect.has(target, key)) {
        return unref(target);
      }
      if (target.value && Reflect.has(target.value, key)) {
        return Reflect.get(target.value, key);
      }
      return async (...rest) => {
        const form = await getFormInstance();
        return form?.[key]?.(...rest);
      };
    },
  });

  const SchemaFormRender = (
    compProps: Partial<XCSchemaFormProps>,
    { attrs, slots }: SetupContext,
  ) => {
    return (
      <SchemaForm
        ref={formRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}
      ></SchemaForm>
    );
  };

  return [SchemaFormRender, unref(methods)] as const;
}
