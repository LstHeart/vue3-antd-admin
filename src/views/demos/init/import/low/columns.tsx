import type { TableColumn } from '@/components/core/dynamic-table';

export const lowColumnsDetail: TableColumn[] = [
  {
    title: '产品编码',
    dataIndex: 'hosGoodsCode',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '产品名称',
    dataIndex: 'goodsName',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '规格型号',
    dataIndex: 'goodsSpec',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '器械注册人',
    dataIndex: 'goodsMfrsName',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    ellipsis: true,
    resizable: true,
    width: 60,
  },
  {
    title: '库存数量',
    dataIndex: 'stockQty',
    ellipsis: true,
    resizable: true,
    width: 60,
    align: 'right',
  },
  {
    title: '一级供应商',
    // dataIndex: 'provId',
    dataIndex: 'provName',
    ellipsis: true,
    resizable: true,
    width: 120,
  },
  {
    title: '二级供应商',
    // dataIndex: 'subProvId',
    dataIndex: 'subProvName',
    ellipsis: true,
    resizable: true,
    width: 120,
  },
  {
    title: '结算方式',
    dataIndex: 'inSettlement',
    ellipsis: true,
    resizable: true,
    width: 120,
    // formItemProps: {
    //   component: 'Select',
    //   componentProps: ({ formInstance, formModel }) => ({
    //     options: [
    //       {
    //         label: '男',
    //         value: 1,
    //       },
    //       {
    //         label: '女',
    //         value: 0,
    //       },
    //     ],
    //     onChange() {
    //       console.log('formModel', formModel);
    //       console.log('formInstance', formInstance);

    //       // // // 根据当前选择的性别，更新衣服可选项
    //       // formInstance?.updateSchema({
    //       //   field: `clothes`,
    //       //   // componentProps: {
    //       //   //   options: getClothesByGender(formModel.gender),
    //       //   // },
    //       // });
    //       // formModel['clothes'] = undefined;
    //     },
    //   }),
    // },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    resizable: true,
    fixed: 'right',
  },
];

export const columnsAddModal: TableColumn[] = [
  {
    title: '产品编号',
    dataIndex: 'hosGoodsCode',
    ellipsis: true,
    resizable: true,
    width: 120,
  },
  {
    title: '产品名称',
    dataIndex: 'goodsName',
    ellipsis: true,
    resizable: true,
    width: 140,
  },
  {
    title: '规格型号',
    dataIndex: 'goodsSpec',
    ellipsis: true,
    resizable: true,
    width: 140,
  },
  {
    title: '器械注册人',
    dataIndex: 'goodsMfrsName',
    ellipsis: true,
    resizable: true,
    width: 140,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    ellipsis: true,
    resizable: true,
    width: 80,
  },
];

export const batchColumns: TableColumn[] = [
  {
    title: '批号',
    dataIndex: 'batchCode',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '生产日期',
    dataIndex: 'productDate',
    ellipsis: true,
    resizable: true,
    width: 120,
  },
  {
    title: '效期',
    dataIndex: 'expdtDate',
    ellipsis: true,
    resizable: true,
    width: 120,
  },
  {
    title: '库存数量',
    dataIndex: 'stockQty',
    ellipsis: true,
    resizable: true,
    width: 80,
  },
  {
    title: '单元含量',
    dataIndex: 'pkgDefId',
    ellipsis: true,
    resizable: true,
    width: 100,
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80,
    resizable: true,
    fixed: 'right',
  },
];
