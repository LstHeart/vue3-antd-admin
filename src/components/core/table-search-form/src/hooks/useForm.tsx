import { nextTick, ref, unref, watch } from 'vue';
import { isEmpty } from 'lodash-es';
import TableSearchForm from '../../index';
import type { Ref, SetupContext } from 'vue';
import type { TableSearchFormInstance, TableSearchFormProps } from '../table-search-form';

export function useForm(props?: Partial<TableSearchFormProps>) {
  const formRef = ref<TableSearchFormInstance>({} as TableSearchFormInstance);

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
        formInstance.setTableSearchFormProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
      flush: 'post',
    },
  );

  const methods = new Proxy<Ref<TableSearchFormInstance>>(formRef, {
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

  const TableSearchFormRender = (
    compProps: Partial<TableSearchFormProps>,
    { attrs, slots }: SetupContext,
  ) => {
    return (
      <TableSearchForm
        ref={formRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}
      ></TableSearchForm>
    );
  };

  return [TableSearchFormRender, unref(methods)] as const;
}
