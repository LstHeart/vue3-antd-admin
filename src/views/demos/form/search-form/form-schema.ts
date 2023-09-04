import type { FormSchema } from '@/components/core/table-search-form';

export const schemas: FormSchema[] = [
  {
    field: 'field1',
    component: 'Input',
    label: '字段1',
    // dynamicDisabled: ({ formModel }) => {
    //   return !!formModel.field7;
    // },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field1') as FormSchema;
        // schema.labelWidth = e ? 64 : 0;
        console.log('field1 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field2',
    component: 'AutoComplete',
    label: '字段2',
    // dynamicDisabled: ({ formModel }) => {
    //   return !!formModel.field7;
    // },
    // componentProps: ({ formInstance }) => ({
    //   onChange(e) {
    //     console.log('formInstance', formInstance);
    //     console.log('this', this);
    //     const schema = formInstance.getSchemaByFiled('field2') as FormSchema;
    //     schema.labelWidth = e ? 64 : 0;
    //     console.log('field3 schema', schema);
    //     formInstance.updateSchema(schema);
    //     console.log('e', e);
    //     // requestIdleCallback(() => {
    //     //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
    //     // });
    //   },
    // }),
  },
  {
    field: 'field3',
    component: 'Select',
    label: '字段3',
    dynamicRules: ({ formModel }) => {
      return formModel.field8 ? [{ required: true, message: '字段3必填' }] : [];
    },
    componentProps: ({ formInstance }) => ({
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
      onChange(e) {
        console.log('formInstance', formInstance);
        // const schema = formInstance.getSchemaByFiled('field3') as FormSchema;
        // schema.labelWidth = e ? 32 : 0;
        // console.log('field3 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field4',
    component: 'RangePicker',
    label: '字段4',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        // console.log('this', this);
        // const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        // schema.labelWidth = e ? 64 : 0;
        // console.log('field3 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field5',
    component: 'DatePicker',
    label: '字段5',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        // const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
        // schema.labelWidth = e ? 64 : 0;
        // console.log('field3 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field6',
    component: 'Input',
    label: '字段6',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        // const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        // schema.labelWidth = e ? 64 : 0;
        // console.log('field3 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field7',
    component: 'DatePicker',
    label: '字段7',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        // const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
        // schema.labelWidth = e ? 64 : 0;
        // console.log('field3 schema', schema);
        // formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field8',
    component: 'DatePicker',
    label: '字段8',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field9',
    component: 'DatePicker',
    label: '字段9',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field10',
    component: 'DatePicker',
    label: '字段10',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field11',
    component: 'DatePicker',
    label: '字段11',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field12',
    component: 'DatePicker',
    label: '字段12',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field13',
    component: 'DatePicker',
    label: '字段13',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  {
    field: 'field14',
    component: 'DatePicker',
    label: '字段14',
    // colProps: {
    //   span: '4-8',
    // },
    dynamicDisabled: ({ formModel }) => {
      return !!formModel.field7;
    },
    componentProps: ({ formInstance }) => ({
      onChange(e) {
        console.log('formInstance', formInstance);
        console.log('this', this);
        const schema = formInstance.getSchemaByFiled('field4') as FormSchema;
        schema.labelWidth = e ? 64 : 0;
        console.log('field3 schema', schema);
        formInstance.updateSchema(schema);
        console.log('e', e);
        // requestIdleCallback(() => {
        //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
        // });
      },
    }),
  },
  // {
  //   field: 'field15',
  //   component: 'DatePicker',
  //   label: '字段15',
  //   // colProps: {
  //   //   span: '4-8',
  //   // },
  //   dynamicDisabled: ({ formModel }) => {
  //     return !!formModel.field7;
  //   },
  //   componentProps: ({ formInstance }) => ({
  //     onChange(e) {
  //       console.log('formInstance', formInstance);
  //       console.log('this', this);
  //       const schema = formInstance.getSchemaByFiled('field5') as FormSchema;
  //       schema.labelWidth = e ? 64 : 0;
  //       console.log('field3 schema', schema);
  //       formInstance.updateSchema(schema);
  //       console.log('e', e);
  //       // requestIdleCallback(() => {
  //       //   e ? formInstance?.validateFields() : formInstance?.clearValidate();
  //       // });
  //     },
  //   }),
  // },
];
