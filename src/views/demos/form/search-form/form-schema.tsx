import type { FormSchema } from '@/components/core/table-search-form';
// import { Radio } from 'ant-design-vue';
// import type { FormSchema } from '@/components/core/schema-form';
// import { optionsListApi } from '@/api/demos/select';

const provincesOptions = [
  {
    id: 'guangdong',
    label: '广东省',
    value: '1',
    key: '1',
  },
  {
    id: 'jiangsu',
    label: '江苏省',
    value: '2',
    key: '2',
  },
];
const citiesOptionsData = {
  guangdong: [
    {
      label: '珠海市',
      value: '1',
      key: '1',
    },
    {
      label: '深圳市',
      value: '2',
      key: '2',
    },
    {
      label: '广州市',
      value: '3',
      key: '3',
    },
  ],
  jiangsu: [
    {
      label: '南京市',
      value: '1',
      key: '1',
    },
    {
      label: '无锡市',
      value: '2',
      key: '2',
    },
    {
      label: '苏州市',
      value: '3',
      key: '3',
    },
  ],
};

// const fetchOptionList = async () => {
//   const data = await optionsListApi();
//   return data.list.map((item) => ({
//     label: item.name,
//     value: item.id,
//   }));
// };

export const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    // componentProps:{},
    // can func
    componentProps: () => {
      return {
        placeholder: '请输入',
        onChange: (e: any) => {
          console.log(e);
        },
      };
    },
    // componentSlots: () => {
    //   return {
    //     prefix: () => 'pSlot',
    //     suffix: () => 'sSlot',
    //   };
    // },
  },
  {
    field: 'field2',
    component: 'InputNumber',
    label: '带后缀',
    defaultValue: '111',

    componentProps: {
      // onChange: (e: any) => {
      //   console.log(e);
      // },
    },
    // suffix: '天',
  },
  {
    field: 'field3',
    component: 'DatePicker',
    label: '字段3',
  },
  {
    field: 'field4',
    component: 'Select',
    label: '字段4',

    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
          key: '1',
        },
        {
          label: '选项2',
          value: '2',
          key: '2',
        },
      ],
    },
  },
  {
    field: 'field5',
    component: 'RangePicker',
    label: '字段5',
  },
  {
    field: 'field6',
    component: 'CheckboxGroup',
    label: '字段6',

    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field7',
    component: 'RadioGroup',
    label: '字段7',

    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field8',
    component: 'Checkbox',
    label: '字段8',

    // componentSlots: 'Check',
  },
  {
    field: 'field9',
    component: 'Switch',
    label: '字段9',
  },
  {
    field: 'field10',
    component: 'RadioGroup',
    label: '字段10',

    componentProps: {
      options: [
        {
          label: '选项1',
          value: '1',
        },
        {
          label: '选项2',
          value: '2',
        },
      ],
    },
  },
  {
    field: 'field11',
    component: 'Cascader',
    label: '字段11',

    componentProps: {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake',
                },
              ],
            },
          ],
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men',
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    field: 'field30',
    component: 'Select',
    label: '懒加载远程下拉',
    required: true,
    componentProps: {
      // more details see /src/components/Form/src/components/ApiSelect.vue
      // request: async (values) => {
      //   console.log('field30 fetch', values);
      //   return await fetchOptionList();
      // },
      onChange: (e) => {
        console.log('selected:', e);
      },
    },

    defaultValue: 1,
  },
  {
    field: 'field31',
    component: 'Input',
    label: '下拉本地搜索',
    helpMessage: ['Select组件', '远程数据源本地搜索', '只发起一次请求获取所有选项'],
    required: true,
    slot: 'localSearch',

    defaultValue: '0',
  },
  {
    field: 'field32',
    component: 'Input',
    label: '下拉远程搜索',
    helpMessage: ['Select组件', '将关键词发送到接口进行远程搜索'],
    required: true,
    slot: 'remoteSearch',

    defaultValue: '0',
  },
  {
    field: 'field33',
    component: 'TreeSelect',
    label: '远程下拉树',
    helpMessage: ['TreeSelect组件', '使用接口提供的数据生成选项'],
    required: true,
    componentProps: {
      request: () => {
        return new Promise((resolve) => {
          const treeData = Array.from({ length: 5 }).map((_, i) => ({
            title: `选项 ${i}`,
            value: `选项 ${i}`,
            children: Array.from({ length: 3 }).map((_, j) => ({
              title: `选项 ${i}-${j}`,
              value: `选项 ${i}-${j}`,
            })),
          }));
          setTimeout(() => resolve(treeData), 2000);
        });
      },
    },
  },
  // {
  //   field: 'field34',
  //   component: ({ schema }) => {
  //     const options = schema.componentProps?.requestResult || [];
  //     return <Radio.Group options={options.slice(0, 2)}></Radio.Group>;
  //   },
  //   label: '远程Radio',
  //   helpMessage: ['RadioGroup组件', '使用接口提供的数据生成选项'],
  //   required: true,
  //   componentProps: {
  //     optionType: 'button',
  //     // request: async () => {
  //     //   const data = await fetchOptionList();
  //     //   return data;
  //     // },
  //   },
  //   defaultValue: '1',
  // },
  {
    field: 'field35',
    component: 'RadioGroup',
    label: '远程Radio',
    helpMessage: ['RadioGroup组件', '使用接口提供的数据生成选项'],
    required: true,
    componentProps: {
      optionType: 'button',
      // request: async () => {
      //   const data = await fetchOptionList();
      //   return data.slice(0, 2);
      // },
    },
    defaultValue: '1',
  },
  {
    field: 'province',
    component: 'Select',
    label: '省份',

    componentProps: ({ formModel, formInstance }) => {
      return {
        options: provincesOptions,
        placeholder: '省份与城市联动',
        onChange: (e: any) => {
          // console.log(e)
          let citiesOptions =
            e == 1
              ? citiesOptionsData[provincesOptions[0].id]
              : citiesOptionsData[provincesOptions[1].id];
          // console.log(citiesOptions)
          if (e === undefined) {
            citiesOptions = [];
          }
          formModel.city = undefined; //  reset city value
          const { updateSchema } = formInstance;
          updateSchema({
            field: 'city',
            componentProps: {
              options: citiesOptions,
            },
          });
        },
      };
    },
  },
  {
    field: 'city',
    component: 'Select',
    label: '城市',

    componentProps: {
      options: [], // defalut []
      placeholder: '省份与城市联动',
      showSearch: true,
    },
  },
  {
    field: 'selectA',
    component: 'Select',
    label: '互斥SelectA',
    slot: 'selectA',
    defaultValue: [],
  },
  {
    field: 'selectB',
    component: 'Select',
    label: '互斥SelectB',
    slot: 'selectB',
    defaultValue: [],
  },
  {
    field: 'field20',
    component: 'InputNumber',
    label: '字段20',
    required: true,
  },
  {
    field: 'field21',
    component: 'Slider',
    label: '字段21',
    componentProps: {
      min: 0,
      max: 100,
      range: true,
      marks: {
        20: '20°C',
        60: '60°C',
      },
    },
  },
  {
    field: 'field22',
    component: 'Rate',
    label: '字段22',
    defaultValue: 3,

    componentProps: {
      disabled: false,
      allowHalf: true,
    },
  },
];
// export const schemas: FormSchema[] = [
//   {
//     field: 'field1',
//     component: 'Input',
//     label: '字段1',
//     // dynamicDisabled: ({ formModel }) => {
//     //   return !!formModel.field7;
//     // },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field1') as FormSchema;
//         // schema.labelWidth = e ? 64 : 0;
//         console.log('field1 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field2',
//     component: 'InputNumber',
//     label: '字段2',
//     // dynamicDisabled: ({ formModel }) => {
//     //   return !!formModel.field7;
//     // },
//     // componentProps: ({ formInstance }) => ({
//     //   onChange(e) {
//     //     console.log('formInstance', formInstance);
//     //     console.log('this', this);
//     //     const schema = formInstance.getSchemaByFiled('field2') as FormSchema;
//     //     schema.labelWidth = e ? 64 : 0;
//     //     console.log('field3 schema', schema);
//     //     formInstance.updateSchema(schema);
//     //     console.log('e', e);
//     //     // requestIdleCallback(() => {
//     //     //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//     //     // });
//     //   },
//     // }),
//   },
//   {
//     field: 'field3',
//     component: 'Select',
//     label: '字段3',
//     dynamicRules: ({ formModel }) => {
//       return formModel.field8 ? [{ required: true, message: '字段3必填' }] : [];
//     },
//     componentProps: ({ formInstance }) => ({
//       options: [
//         {
//           label: '选项1',
//           value: '1',
//           key: '1',
//         },
//         {
//           label: '选项2',
//           value: '2',
//           key: '2',
//         },
//       ],
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         // const schema = formInstance.getSchemaByFiled('field3') as FormSchema;
//         // schema.labelWidth = e ? 32 : 0;
//         // console.log('field3 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field4',
//     component: 'RangePicker',
//     label: '字段4',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         // console.log('this', this);
//         // const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         // schema.labelWidth = e ? 64 : 0;
//         // console.log('field3 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field5',
//     component: 'DatePicker',
//     label: '字段5',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         // const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//         // schema.labelWidth = e ? 64 : 0;
//         // console.log('field3 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field6',
//     component: 'Input',
//     label: '字段6',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         // const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         // schema.labelWidth = e ? 64 : 0;
//         // console.log('field3 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field7',
//     component: 'DatePicker',
//     label: '字段7',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         // const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//         // schema.labelWidth = e ? 64 : 0;
//         // console.log('field3 schema', schema);
//         // formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field8',
//     component: 'DatePicker',
//     label: '字段8',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field9',
//     component: 'DatePicker',
//     label: '字段9',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field10',
//     component: 'DatePicker',
//     label: '字段10',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field11',
//     component: 'DatePicker',
//     label: '字段11',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field12',
//     component: 'DatePicker',
//     label: '字段12',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field13',
//     component: 'DatePicker',
//     label: '字段13',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   {
//     field: 'field14',
//     component: 'DatePicker',
//     label: '字段14',
//     // colProps: {
//     //   span: '4-8',
//     // },
//     dynamicDisabled: ({ formModel }) => {
//       return !!formModel.field7;
//     },
//     componentProps: ({ formInstance }) => ({
//       onChange(e) {
//         console.log('formInstance', formInstance);
//         console.log('this', this);
//         const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
//         schema.labelWidth = e ? 64 : 0;
//         console.log('field3 schema', schema);
//         formInstance.updateSchema(schema);
//         console.log('e', e);
//         // requestIdleCallback(() => {
//         //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//         // });
//       },
//     }),
//   },
//   // {
//   //   field: 'field15',
//   //   component: 'DatePicker',
//   //   label: '字段15',
//   //   // colProps: {
//   //   //   span: '4-8',
//   //   // },
//   //   dynamicDisabled: ({ formModel }) => {
//   //     return !!formModel.field7;
//   //   },
//   //   componentProps: ({ formInstance }) => ({
//   //     onChange(e) {
//   //       console.log('formInstance', formInstance);
//   //       console.log('this', this);
//   //       const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
//   //       schema.labelWidth = e ? 64 : 0;
//   //       console.log('field3 schema', schema);
//   //       formInstance.updateSchema(schema);
//   //       console.log('e', e);
//   //       // requestIdleCallback(() => {
//   //       //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
//   //       // });
//   //     },
//   //   }),
//   // },
// ];
