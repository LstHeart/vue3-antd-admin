import { nextTick, ref, unref, watch } from 'vue';
import { isEmpty } from 'lodash-es';
import XCDynamicTable from '../../index';
import type { Ref, SetupContext } from 'vue';
import type { XCDynamicTableInstance, XCDynamicTableProps } from '../xc-dynamic-table';

export function useTable(props?: Partial<XCDynamicTableProps>) {
  const dynamicTableRef = ref<XCDynamicTableInstance>({} as XCDynamicTableInstance);

  async function getTableInstance() {
    await nextTick();
    const table = unref(dynamicTableRef);
    if (isEmpty(table)) {
      console.error('未获取表格实例!');
    }
    return table;
  }
  watch(
    () => props,
    async () => {
      if (props) {
        await nextTick();
        const tableInstance = await getTableInstance();
        tableInstance?.setProps?.(props);
      }
    },
    {
      immediate: true,
      deep: true,
    },
  );

  const methods = new Proxy<Ref<XCDynamicTableInstance>>(dynamicTableRef, {
    get(target, key) {
      if (Reflect.has(target, key)) {
        return unref(target);
      }
      if (target.value && Reflect.has(target.value, key)) {
        return Reflect.get(target.value, key);
      }
      return async (...rest) => {
        const table = await getTableInstance();
        return table?.[key]?.(...rest);
      };
    },
  });

  const DynamicTableRender = (
    compProps: Partial<XCDynamicTableProps>,
    { attrs, slots }: SetupContext,
  ) => {
    return (
      <XCDynamicTable
        ref={dynamicTableRef}
        {...{ ...attrs, ...props, ...compProps }}
        v-slots={slots}
      ></XCDynamicTable>
    );
  };

  return [DynamicTableRender, unref(methods)] as const;
}
