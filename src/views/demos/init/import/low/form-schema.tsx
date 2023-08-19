import type { FormSchema } from '@/components/core/schema-form';
import settleApi from '@/api/basic/product/settle-rules';
const loadTree = async () => {
  const data = await settleApi.getSettleType();
  if (data.code === 0) {
    return data.data;
  }
};
export const DataModalSchemas: FormSchema[] = [
  {
    field: 'inSettlement',
    component: 'Select',
    label: '结算方式',
    componentProps: {
      fieldNames: { label: 'name', value: 'key' },
      request: async (_) => {
        return await loadTree();
      },
    },
    // rules: [{ required: true, message: '结算方式不能为空!' }],
  },
];
